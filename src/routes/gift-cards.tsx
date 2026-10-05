import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gift-cards")({
  component: () => <Outlet />,
});
