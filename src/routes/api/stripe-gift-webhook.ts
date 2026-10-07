import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stripe-gift-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("stripe-signature") || "";
        try {
          const paid = await paidGiftOrder(raw, signature);
          if (paid) {
            const { issueAndDeliver } = await import(
              "@/lib/gift-order-mail.server"
            );
            await issueAndDeliver(paid);
          }
          return new Response("ok");
        } catch {
          return new Response("retry", { status: 400 });
        }
      },
    },
  },
});

type PaidOrder = {
  amount: string;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  orderedAt: string;
  orderId: string;
  buyerEmail: string;
  stripeId: string;
};

async function paidGiftOrder(raw: string, header: string): Promise<PaidOrder | null> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !(await signed(raw, header, secret))) {
    throw new Error("unsigned");
  }
  const event = JSON.parse(raw) as {
    id?: string;
    type?: string;
    created?: number;
    data?: { object?: Record<string, unknown> };
  };
  if (event.type !== "checkout.session.completed") return null;
  const session = event.data?.object;
  if (!session || session.payment_status !== "paid") return null;
  const amount = Number(session.amount_total);
  const dollars = Number.isFinite(amount) ? `$${(amount / 100).toFixed(2)}` : "";
  const reference = String(session.client_reference_id || "");
  const note = parseNote(reference);
  const details = session.customer_details as { email?: string; name?: string } | null;
  const created = Number(session.created || event.created || 0);
  return {
    amount: dollars,
    fromName: note.fromName,
    recipientName: note.recipientName,
    recipientEmail: note.recipientEmail,
    buyerEmail: details?.email || "",
    message: note.message,
    orderedAt: created ? new Date(created * 1000).toISOString() : "",
    orderId: note.orderId,
    stripeId: String(session.id || event.id || ""),
  };
}

function parseNote(reference: string) {
  return {
    orderId: field(reference, "Order"),
    fromName: field(reference, "From"),
    recipientName: field(reference, "For"),
    recipientEmail: "",
    message: field(reference, "Note"),
  };
}

function field(reference: string, label: string) {
  const prefix = `${label.toLowerCase()}:`;
  const part = reference
    .split("|")
    .map((item) => item.trim())
    .find((item) => item.toLowerCase().startsWith(prefix));
  return part ? part.slice(prefix.length).trim() : "";
}

async function signed(raw: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((part) => {
      const index = part.indexOf("=");
      return [part.slice(0, index), part.slice(index + 1)];
    }),
  );
  const stamp = parts.t;
  const expected = parts.v1;
  if (!stamp || !expected) return false;
  const age = Math.abs(Date.now() / 1000 - Number(stamp));
  if (!Number.isFinite(age) || age > 300) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${stamp}.${raw}`),
  );
  const actual = [...new Uint8Array(mac)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return actual === expected;
}
