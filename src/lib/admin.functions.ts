import { createServerFn } from "@tanstack/react-start";

export type AdminCard = {
  id: string;
  code: string;
  amount: number;
  fromName: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  status: "pending" | "issued";
  balance: number;
  createdAt: string;
  issuedAt: string;
  redeemedAt: string;
  notice: {
    to: string;
    subject: string;
    body: string;
    status: string;
  } | null;
};

export type AdminDashboard =
  | { ok: false }
  | { ok: true; cards: AdminCard[] };

function passwordInput(input: unknown) {
  if (!input || typeof input !== "object") return { password: "" };
  return { password: String((input as { password?: unknown }).password ?? "") };
}

export const adminDashboard = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminDashboard> => {
    const { hasAdminSession, listAdminCards } = await import("@/lib/admin.server");
    if (!(await hasAdminSession())) return { ok: false };
    return { ok: true, cards: await listAdminCards() };
  },
);

export const adminLogin = createServerFn({ method: "POST" })
  .validator(passwordInput)
  .handler(async ({ data }) => {
    const { passwordMatches, writeAdminSession } = await import(
      "@/lib/admin.server"
    );
    if (!passwordMatches(data.password)) {
      throw new Error("That password is not right.");
    }
    await writeAdminSession();
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearAdminSession } = await import("@/lib/admin.server");
  await clearAdminSession();
  return { ok: true as const };
});

export const adminDelete = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Not signed in.");
    const id = String((input as { id?: unknown }).id ?? "").trim();
    if (!id.startsWith("gc_")) throw new Error("Missing card.");
    return { id };
  })
  .handler(async ({ data }) => {
    const { hasAdminSession, deleteGiftCard } = await import("@/lib/admin.server");
    if (!(await hasAdminSession())) throw new Error("Not signed in.");
    await deleteGiftCard(data.id);
    return { ok: true as const };
  });

export const adminSetRedeemed = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Not signed in.");
    const raw = input as { id?: unknown; redeemed?: unknown };
    const id = String(raw.id ?? "").trim();
    if (!id) throw new Error("Missing card.");
    return { id, redeemed: Boolean(raw.redeemed) };
  })
  .handler(async ({ data }) => {
    const { hasAdminSession, setCardRedeemed } = await import(
      "@/lib/admin.server"
    );
    if (!(await hasAdminSession())) throw new Error("Not signed in.");
    await setCardRedeemed(data.id, data.redeemed);
    return { ok: true as const };
  });

export const adminResetBalance = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Not signed in.");
    const raw = input as { id?: unknown; amount?: unknown };
    const id = String(raw.id ?? "").trim();
    const amount = Number(raw.amount);
    if (!id.startsWith("gc_")) throw new Error("Missing card.");
    if (!Number.isFinite(amount)) throw new Error("Enter a remaining amount.");
    return { id, amount: Math.round(amount * 100) / 100 };
  })
  .handler(async ({ data }) => {
    const { hasAdminSession, resetGiftCardBalance } = await import(
      "@/lib/admin.server"
    );
    if (!(await hasAdminSession())) throw new Error("Not signed in.");
    await resetGiftCardBalance(data.id, data.amount);
    return { ok: true as const };
  });
