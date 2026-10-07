import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gift-cards_/{$code}.png")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const code = String(params.code || "")
          .trim()
          .toUpperCase()
          .slice(0, 40);
        if (!/^GD-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
          return new Response("Not found", { status: 404 });
        }
        try {
          const { getSql } = await import("@/lib/db");
          const sql = await getSql();
          const rows = await sql<{
            code: string;
            amount_cents: number | string;
            from_name: string;
            recipient_name: string;
            message: string;
            status: string;
          }>`
            select code, amount_cents, from_name, recipient_name, message, status
            from gift_cards
            where code = ${code} and status = 'issued'
          `;
          const row = rows[0];
          if (!row) return new Response("Not found", { status: 404 });

          const { renderGiftCardPng } = await import(
            "@/lib/gift-card-image.server"
          );
          const png = await renderGiftCardPng({
            amount: `$${(Number(row.amount_cents) / 100).toFixed(2)}`,
            fromName: row.from_name || "",
            recipientName: row.recipient_name || "",
            message: row.message || "",
            code: row.code,
          });
          return new Response(new Uint8Array(png), {
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
            },
          });
        } catch (err) {
          console.error("[gift-card-png]", err);
          const detail =
            err instanceof Error ? err.message : "Could not render gift card";
          return new Response(`Could not render gift card: ${detail}`, {
            status: 500,
          });
        }
      },
    },
  },
});
