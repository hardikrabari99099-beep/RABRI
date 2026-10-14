import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/booking-view";
import { QR } from "@/components/site";
import { fetchBookings, inr, myIds, rememberId, type Booking } from "@/lib/data";
import { downloadPass } from "@/lib/pdf";
import {
  Ticket,
  Search,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/my-pass")({
  head: () => ({
    meta: [
      { title: "My Passes & Digital QR Tickets — AapnoPass" },
      { name: "description", content: "View, manage, and download your Navratri digital entry passes." },
      { property: "og:title", content: "My Passes — AapnoPass" },
      { property: "og:description", content: "All your Surat Navratri passes in one place." },
    ],
  }),
  component: MyPass,
});

function MyPass() {
  const [ids, setIds] = useState<string[]>([]);
  const [findInput, setFindInput] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    setIds(myIds());
  }, []);

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["my-passes", ids],
    queryFn: () => fetchBookings(ids),
    enabled: ids.length > 0,
    refetchInterval: 10000,
  });

  const handleAddId = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = findInput.trim().toUpperCase().replace("AAPNOPASS:", "");
    if (clean) {
      rememberId(clean);
      setIds(myIds());
      setFindInput("");
    }
  };

  const handleDownload = async (b: Booking) => {
    setDownloadingId(b.id);
    try {
      await downloadPass(b);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <section className="border-b bg-forest py-14 text-forest-foreground text-center">
        <div className="mx-auto max-w-4xl px-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-foreground/10 px-3 py-1 text-xs font-semibold text-saffron">
            <Ticket className="h-3.5 w-3.5" /> Digital Turnstile Passes
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">My Navratri Passes</h1>
          <p className="mt-2 text-sm opacity-80 max-w-md mx-auto">
            Access your encrypted QR passes for turnstile scanning at venues across Surat.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10">
        {/* Search / Claim pass by ID */}
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <form onSubmit={handleAddId} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={findInput}
                onChange={(e) => setFindInput(e.target.value)}
                placeholder="Booked on another phone? Enter Booking ID (e.g. AP7K2Q91)"
                className="h-11 w-full font-mono rounded-xl border bg-background pl-10 pr-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition"
            >
              Claim Pass
            </button>
          </form>
        </div>

        {/* Passes list */}
        {list.length > 0 ? (
          <div className="mt-8 space-y-6">
            {list.map((b) => {
              const isReady = b.status === "approved" || b.status === "used";
              return (
                <div
                  key={b.id}
                  className="overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:shadow-md"
                >
                  <div className="border-b bg-secondary/50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary">#{b.id}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">Booked for {b.name}</span>
                    </div>
                    <StatusBadge s={b.status} />
                  </div>

                  <div className="p-6 grid gap-6 md:grid-cols-[1fr_auto] items-center">
                    <div>
                      <h3 className="font-display text-2xl font-bold">{b.event_name}</h3>
                      <p className="mt-1 text-sm font-semibold text-primary">
                        {b.pass_name} × {b.qty} ({inr(b.total)})
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>Night: <strong className="text-foreground">{b.night}</strong></span>
                        <span>•</span>
                        <span>Mobile: {b.phone}</span>
                        {b.utr && (
                          <>
                            <span>•</span>
                            <span className="font-mono">UTR: {b.utr}</span>
                          </>
                        )}
                      </div>

                      {b.status === "pending" && (
                        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800">
                          <p className="font-bold flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-amber-600" /> Payment Under Verification
                          </p>
                          <p className="mt-0.5 text-muted-foreground">
                            Our team verifies your 12-digit UTR against bank records. Pass activates automatically once confirmed.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* QR Code and Actions */}
                    <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                      {isReady ? (
                        <>
                          <div className="rounded-2xl border bg-white p-2 shadow-sm">
                            <QR value={`AAPNOPASS:${b.id}`} size={90} />
                          </div>
                          <span className="mt-1 text-[10px] font-mono text-muted-foreground">Gate Pass QR</span>
                          <button
                            onClick={() => handleDownload(b)}
                            disabled={downloadingId === b.id}
                            className="mt-3 flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {downloadingId === b.id ? "Generating…" : "Download PDF"}
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-4 text-xs text-muted-foreground">
                          <QrCode className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                          <p className="mt-2 font-medium">QR unlocks upon payment approval</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-12 rounded-3xl border border-dashed p-12 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-2xl">
              🎟️
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold">No passes found yet</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Any passes you book on this device appear here automatically with encrypted QR codes.
            </p>
            <Link
              to="/events"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
            >
              Browse Surat Navratri Events <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
