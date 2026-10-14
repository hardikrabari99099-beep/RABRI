import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PassCard } from "@/components/site";
import { StatusBadge } from "@/components/booking-view";
import { fetchBookings, inr, type Booking } from "@/lib/data";
import { downloadPass } from "@/lib/pdf";
import { supabase } from "@/integrations/supabase/client";
import {
  CheckCircle2,
  Clock,
  Download,
  Ticket,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/success/$bookingId")({
  head: () => ({
    meta: [
      { title: "Booking Confirmation — AapnoPass Surat" },
      { name: "description", content: "Your Navratri pass booking status and digital pass." },
      { property: "og:title", content: "Booking Received — AapnoPass" },
      { property: "og:description", content: "Your Navratri pass booking status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

function Success() {
  const { bookingId } = Route.useParams();
  const [utrInput, setUtrInput] = useState("");
  const [updatingUtr, setUpdatingUtr] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBookings([bookingId]),
    refetchInterval: 6000,
  });

  const b: Booking | undefined = data?.[0];

  const handleUpdateUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrInput || utrInput.length < 6 || !b) return;
    setUpdatingUtr(true);

    try {
      await supabase.rpc("attach_utr", { _id: b.id, _utr: utrInput.trim() });
      await supabase.from("bookings").update({ utr: utrInput.trim() }).eq("id", b.id);
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("aapnopass.local_bookings") || "[]";
        const list: Booking[] = JSON.parse(raw);
        const idx = list.findIndex((item) => item.id === b.id);
        if (idx !== -1) {
          list[idx].utr = utrInput.trim();
          localStorage.setItem("aapnopass.local_bookings", JSON.stringify(list));
        }
      } catch {}
    }

    setUpdatingUtr(false);
    refetch();
  };

  const handleDownload = async () => {
    if (!b) return;
    setDownloading(true);
    try {
      await downloadPass(b);
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 text-center text-xs text-muted-foreground">
        Loading booking information…
      </div>
    );
  }

  if (!b) {
    return (
      <div className="py-24 text-center px-4">
        <h2 className="font-display text-3xl font-bold">Booking Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Could not find booking reference <strong>{bookingId}</strong>.
        </p>
        <Link
          to="/my-pass"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground"
        >
          Go to My Passes →
        </Link>
      </div>
    );
  }

  const ok = b.status === "approved" || b.status === "used";

  return (
    <div className="min-h-screen bg-background pb-24">
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-5 py-16 md:grid-cols-2">
        <div>
          <StatusBadge s={b.status} />

          <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight">
            {ok
              ? `Aapno pass is ready, ${b.name.split(" ")[0]}!`
              : b.status === "rejected"
              ? "Payment could not be verified"
              : "Booking Submitted! Verifying Payment."}
          </h1>

          <div className="mt-4 rounded-2xl border bg-card p-4 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event:</span>
              <span className="font-semibold text-foreground">{b.event_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pass Tier:</span>
              <span className="font-semibold text-primary">{b.pass_name} × {b.qty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Night:</span>
              <span className="font-semibold">{b.night}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-foreground text-sm">{inr(b.total)}</span>
            </div>
            <div className="flex justify-between border-t pt-1.5">
              <span className="text-muted-foreground">Booking ID:</span>
              <span className="font-mono font-bold text-primary">{b.id}</span>
            </div>
          </div>

          {!ok && b.status === "pending" && (
            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-600 shrink-0" /> Turnstile QR Activates Automatically
                </p>
                <p className="mt-1 text-muted-foreground">
                  Our system verifies your 12-digit UPI reference ID ({b.utr ? `UTR: ${b.utr}` : "Awaiting UTR submission"}). Once matched, your official entry pass unlocks here.
                </p>
              </div>

              {!b.utr && (
                <form onSubmit={handleUpdateUtr} className="flex gap-2">
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value.trim())}
                    placeholder="Enter 12-digit UTR from UPI app"
                    className="h-10 flex-1 font-mono rounded-xl border bg-background px-3 text-xs"
                  />
                  <button
                    disabled={updatingUtr || utrInput.length < 6}
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
                  >
                    {updatingUtr ? "Saving…" : "Save UTR"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {ok && (
              <button
                disabled={downloading}
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow hover:opacity-90 transition text-xs"
              >
                <Download className="h-4 w-4" />
                {downloading ? "Creating Pass PDF…" : "Download PDF Pass"}
              </button>
            )}
            <Link
              to="/my-pass"
              className="flex items-center gap-1.5 rounded-full border bg-card px-6 py-3 text-xs font-bold hover:bg-secondary transition"
            >
              <Ticket className="h-4 w-4" /> View in My Passes
            </Link>
          </div>
        </div>

        {/* Dynamic Pass Preview */}
        <div className="flex flex-col items-center justify-center">
          <div className={ok ? "drop-shadow-2xl" : "opacity-50 blur-[1px] select-none"}>
            <PassCard
              event={b.event_name}
              name={b.name}
              date={b.night}
              type={`${b.pass_name} × ${b.qty}`}
              id={b.id}
            />
          </div>
          {!ok && (
            <span className="mt-3 text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Entry QR blurred until payment is verified
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
