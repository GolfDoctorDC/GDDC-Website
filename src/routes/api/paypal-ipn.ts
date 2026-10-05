import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paypal-ipn")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        try {
          const { recordPaypalGiftPayment } = await import(
            "@/lib/gift-notice.server"
          );
          await recordPaypalGiftPayment(raw);
          return new Response("ok");
        } catch {
          return new Response("retry", { status: 500 });
        }
      },
    },
  },
});
