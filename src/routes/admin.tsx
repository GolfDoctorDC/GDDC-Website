import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Eyebrow, Section } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminDashboard,
  adminDelete,
  adminLogin,
  adminLogout,
  adminResetBalance,
  adminSetRedeemed,
  type AdminCard,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  loader: () => adminDashboard(),
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Studio desk | The Golf Doctor DC" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const when = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatWhen(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return when.format(date);
}

function spent(card: AdminCard) {
  return card.balance <= 0;
}

function statusLabel(card: AdminCard) {
  if (card.status !== "issued") return "Not paid";
  if (spent(card)) return "Used";
  if (card.balance < card.amount) return "Partial";
  return "Open";
}

function AdminPage() {
  const data = Route.useLoaderData();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  async function onLogin(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminLogin({ data: { password } });
      setPassword("");
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(card: AdminCard) {
    setBusy(true);
    setError("");
    try {
      await adminDelete({ data: { id: card.id } });
      setPendingDelete(null);
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t delete that card.");
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    await adminLogout();
    await router.invalidate();
  }

  async function onReset(card: AdminCard, amount: number) {
    setBusy(true);
    setError("");
    try {
      await adminResetBalance({ data: { id: card.id, amount } });
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t reset that value.");
    } finally {
      setBusy(false);
    }
  }

  async function onRedeem(card: AdminCard) {
    setBusy(true);
    try {
      await adminSetRedeemed({
        data: { id: card.id, redeemed: !card.redeemedAt },
      });
      await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t update that card.");
    } finally {
      setBusy(false);
    }
  }

  if (!data.ok) {
    return (
      <main id="main">
        <Section className="max-w-md">
          <Eyebrow>Studio desk</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold">
            Gift cards
          </h1>
          <p className="mt-3 text-sm text-muted">
            Issued and unpaid cards stay on this page. The public site never
            lists them.
          </p>
          <form onSubmit={onLogin} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={busy}>
              {busy ? "Checking…" : "Open the desk"}
            </Button>
          </form>
        </Section>
      </main>
    );
  }

  const cards = data.cards;
  const issued = cards.filter((card) => card.status === "issued");
  const openValue = issued
    .filter((card) => !spent(card))
    .reduce((sum, card) => sum + card.balance, 0);

  return (
    <main id="main">
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Studio desk</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-semibold">
              Gift cards
            </h1>
          </div>
          <Button type="button" variant="outline" onClick={onLogout}>
            Sign out
          </Button>
        </div>
        <dl className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Cards" value={String(cards.length)} />
          <Stat label="Issued" value={String(issued.length)} />
          <Stat label="Still open" value={money.format(openValue)} />
        </dl>
        {error ? (
          <p className="mt-4 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {cards.length === 0 ? (
          <p className="mt-10 text-muted">No gift cards yet.</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {cards.map((card) => (
              <li
                key={card.id}
                className="rounded-xl border border-border bg-surface p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-lg tracking-[0.14em]">
                      {card.code}
                    </p>
                    <p className="mt-1 font-display text-3xl tabular-nums">
                      {money.format(
                        card.status === "issued" ? card.balance : card.amount,
                      )}
                    </p>
                    {card.status === "issued" && card.balance !== card.amount ? (
                      <p className="mt-1 text-sm text-muted">
                        of {money.format(card.amount)} purchased
                      </p>
                    ) : null}
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {statusLabel(card)}
                  </span>
                </div>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <Field label="From" value={card.fromName || "—"} />
                  <Field label="For" value={card.recipientName || "—"} />
                  <Field label="Email" value={card.recipientEmail || "—"} />
                  <Field label="Started" value={formatWhen(card.createdAt)} />
                  <Field
                    label="Issued"
                    value={card.issuedAt ? formatWhen(card.issuedAt) : "—"}
                  />
                  <Field
                    label="Used"
                    value={card.redeemedAt ? formatWhen(card.redeemedAt) : "—"}
                  />
                </dl>
                {card.message ? (
                  <p className="mt-3 text-sm text-muted">“{card.message}”</p>
                ) : null}
                {card.notice ? (
                  <div className="mt-4 rounded-lg border border-border bg-paper p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      {card.notice.status === "sent"
                        ? `Emailed to ${card.notice.to}`
                        : `Purchase email for ${card.notice.to}`}
                    </p>
                    <p className="mt-1 text-sm font-medium">{card.notice.subject}</p>
                    <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-sm text-ink">
                      {card.notice.body}
                    </pre>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    Studio email waits until PayPal confirms this payment.
                  </p>
                )}
                {card.status === "issued" ? (
                  <BalanceReset card={card} busy={busy} onReset={onReset} />
                ) : null}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {card.status === "issued" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => onRedeem(card)}
                    >
                      {spent(card) ? "Mark open again" : "Mark used"}
                    </Button>
                  ) : (
                    <p className="text-sm text-muted">
                      Checkout was started and not finished. Do not honor this
                      code.
                    </p>
                  )}
                  {pendingDelete === card.id ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() => onDelete(card)}
                      >
                        {busy ? "Deleting…" : "Delete gift card"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={busy}
                        onClick={() => setPendingDelete(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={busy}
                      onClick={() => setPendingDelete(card.id)}
                    >
                      Delete gift card
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </main>
  );
}

function BalanceReset({
  card,
  busy,
  onReset,
}: {
  card: AdminCard;
  busy: boolean;
  onReset: (card: AdminCard, amount: number) => Promise<void>;
}) {
  const [value, setValue] = useState(card.balance.toFixed(2));
  useEffect(() => {
    setValue(card.balance.toFixed(2));
  }, [card.balance]);
  const next = Number(value);
  const ready =
    Number.isFinite(next) &&
    next >= 0 &&
    Math.round(next * 100) <= Math.round(card.amount * 100) &&
    Math.round(next * 100) !== Math.round(card.balance * 100);

  return (
    <form
      className="mt-4 flex flex-wrap items-end gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!ready) return;
        void onReset(card, next);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor={`balance-${card.id}`}>Remaining value</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            $
          </span>
          <Input
            id={`balance-${card.id}`}
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-32 pl-7"
          />
        </div>
      </div>
      <Button type="submit" variant="outline" size="sm" disabled={busy || !ready}>
        Reset value
      </Button>
    </form>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-display text-3xl tabular-nums">{value}</dd>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
