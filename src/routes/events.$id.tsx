import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QR } from "@/components/site";
import {
  eventsQuery,
  inr,
  newId,
  rememberId,
  settingsQuery,
  UPI_APPS,
  upiLink,
  type EventItem,
  type PassType,
  type Booking,
} from "@/lib/data";
import {
  MapPin,
  Calendar,
  Clock,
  Mic,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Info,
  Users,
  AlertCircle,
  Sparkles,
  Flame,
  ArrowLeft,
  Share2,
  Ticket,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/events/$id")({
  loader: async ({ context, params }) => {
    const [events, s] = await Promise.all([
      context.queryClient.ensureQueryData(eventsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]);
    const e = events.find((x) => x.id === params.id);
    if (!e) throw notFound();
    return { event: e, settings: s, name: e.name, about: e.about };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} Passes & Tickets — AapnoPass Surat` },
          { name: "description", content: loaderData.about },
          { property: "og:title", content: `${loaderData.name} — AapnoPass` },
          { property: "og:description", content: loaderData.about },
        ]
      : [{ title: "Event unavailable — AapnoPass" }, { name: "robots", content: "noindex" }],
  }),
  component: EventPage,
});

function EventPage() {
  const { id } = Route.useParams();
  const loaderData = Route.useLoaderData();
  const nav = useNavigate();

  const { data: events = [] } = useQuery(eventsQuery);
  const { data: s = loaderData.settings } = useQuery({
    ...settingsQuery,
    initialData: loaderData.settings,
  });

  const e: EventItem = events.find((x) => x.id === id) || loaderData.event;

  const [selectedPassId, setSelectedPassId] = useState<string>(e.passes?.[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [selectedNight, setSelectedNight] = useState<string>(e.nights?.[0] ?? e.dates);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [step, setStep] = useState<"select" | "pay">("select");
  const [utrNumber, setUtrNumber] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "highlights" | "facilities" | "rules">("about");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const pass = e.passes?.find((p) => p.id === selectedPassId) || e.passes?.[0];
  if (!pass) {
    return (
      <div className="py-28 text-center">
        <h2 className="font-display text-3xl">Event Unavailable</h2>
        <p className="mt-2 text-muted-foreground">Passes for this event are not on sale yet.</p>
        <Link to="/events" className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const total = pass.price * qty;
  const isFormValid =
    form.name.trim().length > 1 &&
    /^\d{10}$/.test(form.phone) &&
    /\S+@\S+\.\S+/.test(form.email);
  const note = `AapnoPass ${e.name} ${pass.name}`.slice(0, 35);
  const allImages = [e.coverImage, ...(e.galleryImages || [])];

  const handleStartBooking = async () => {
    setErrorMessage("");
    setIsSubmitting(true);
    const newBid = newId();

    const bookingPayload: Booking = {
      id: newBid,
      event_id: e.id,
      event_name: e.name,
      pass_id: pass.id,
      pass_name: pass.name,
      qty,
      name: form.name.trim(),
      phone: form.phone,
      email: form.email.trim(),
      night: pass.season ? e.dates : selectedNight,
      total,
      utr: null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // Attempt Supabase insert
    try {
      const { error } = await supabase.from("bookings").insert({
        id: bookingPayload.id,
        event_id: bookingPayload.event_id,
        event_name: bookingPayload.event_name,
        pass_id: bookingPayload.pass_id,
        pass_name: bookingPayload.pass_name,
        qty: bookingPayload.qty,
        name: bookingPayload.name,
        phone: bookingPayload.phone,
        email: bookingPayload.email,
        night: bookingPayload.night,
        total: bookingPayload.total,
      });

      if (error) {
        console.warn("Supabase insert notice, saving locally", error);
      }
    } catch (err) {
      console.warn("Supabase insert exception, using local store", err);
    }

    // Always mirror to localStorage
    if (typeof window !== "undefined") {
      try {
        const existingRaw = localStorage.getItem("aapnopass.local_bookings") || "[]";
        const parsed = JSON.parse(existingRaw);
        localStorage.setItem(
          "aapnopass.local_bookings",
          JSON.stringify([bookingPayload, ...parsed])
        );
      } catch (e) {}
    }

    rememberId(newBid);
    setBookingId(newBid);
    setIsSubmitting(false);
    setStep("pay");
  };

  const handleConfirmUtrPayment = async () => {
    if (!utrNumber || utrNumber.length < 6) {
      setErrorMessage("Please enter a valid 12-digit UPI reference (UTR) number.");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await supabase.rpc("attach_utr", { _id: bookingId, _utr: utrNumber });
      await supabase.from("bookings").update({ utr: utrNumber }).eq("id", bookingId);
    } catch (e) {
      console.warn("UTR update fallback", e);
    }

    // Update local storage record
    if (typeof window !== "undefined" && bookingId) {
      try {
        const raw = localStorage.getItem("aapnopass.local_bookings") || "[]";
        const list: Booking[] = JSON.parse(raw);
        const idx = list.findIndex((b) => b.id === bookingId);
        if (idx !== -1) {
          list[idx].utr = utrNumber;
          localStorage.setItem("aapnopass.local_bookings", JSON.stringify(list));
        }
      } catch {}
    }

    setIsSubmitting(false);
    nav({ to: "/success/$bookingId", params: { bookingId: bookingId! } });
  };

  const copyUpiId = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(s.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const inputClass =
    "mt-2 h-11 w-full rounded-xl border bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Back button & Breadcrumb bar */}
      <div className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 text-xs text-muted-foreground">
          <Link to="/events" className="flex items-center gap-1.5 font-medium hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all events
          </Link>
          <div className="flex items-center gap-2">
            <span>Surat</span>
            <ChevronRight className="h-3 w-3" />
            <span>{e.area}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground truncate max-w-[200px]">{e.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Column: Event Media & Comprehensive Information */}
        <div>
          {/* Cover & Gallery Hero */}
          <div className="relative overflow-hidden rounded-3xl border bg-forest">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <img
                src={allImages[activeImageIndex] || e.coverImage}
                alt={e.name}
                className="h-full w-full object-cover transition duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-forest/90 px-3 py-1 text-xs font-semibold text-saffron backdrop-blur border border-forest-foreground/20">
                {e.eventType}
              </span>
              {e.tag && (
                <span className="rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {e.tag}
                </span>
              )}
              {e.isTrending && (
                <span className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  <Flame className="h-3 w-3" /> Trending
                </span>
              )}
            </div>

            {/* Source URL badge */}
            {e.sourceUrl && (
              <a
                href={e.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur hover:bg-black/80 transition"
              >
                <span>{e.sourceName || "FastTicket Verified"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-sm font-semibold text-saffron flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {e.area}, Surat
              </p>
              <h1 className="mt-1 font-display text-3xl md:text-5xl font-bold leading-tight">
                {e.name}
              </h1>
            </div>
          </div>

          {/* Gallery Thumbnails if multiple */}
          {allImages.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition ${
                    activeImageIndex === idx ? "ring-2 ring-primary" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-2xl border bg-card p-3.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Dates
              </span>
              <p className="mt-1 font-semibold text-foreground text-sm">{e.dates}</p>
            </div>
            <div className="rounded-2xl border bg-card p-3.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" /> Timings
              </span>
              <p className="mt-1 font-semibold text-foreground text-sm">{e.time || `${e.startTime} - ${e.endTime}`}</p>
            </div>
            <div className="rounded-2xl border bg-card p-3.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <Mic className="h-3.5 w-3.5 text-primary" /> Headliner
              </span>
              <p className="mt-1 font-semibold text-foreground text-sm truncate">{e.artist || "Live Folk Symphony"}</p>
            </div>
            <div className="rounded-2xl border bg-card p-3.5">
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Locality
              </span>
              <p className="mt-1 font-semibold text-foreground text-sm">{e.area}, Surat</p>
            </div>
          </div>

          {/* Venue & Google Maps Address Card */}
          <div className="mt-6 rounded-2xl border bg-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-saffron">Venue & Location</p>
                <h3 className="mt-1 font-display text-xl font-bold">{e.venue}</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-md">{e.address || `${e.venue}, ${e.area}, Surat, Gujarat`}</p>
              </div>
              <a
                href={e.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(e.venue + " " + e.area + " Surat")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition shrink-0"
              >
                <MapPin className="h-3.5 w-3.5" /> Open in Google Maps <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Tab Navigation for Event Details */}
          <div className="mt-8 border-b">
            <div className="flex gap-6 text-sm font-semibold">
              {[
                { id: "about", label: "About Event" },
                { id: "highlights", label: "Highlights & Lineup" },
                { id: "facilities", label: "Facilities & Amenities" },
                { id: "rules", label: "Dress Code & Guidelines" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 transition ${
                    activeTab === tab.id
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <p className="text-base leading-relaxed text-muted-foreground">{e.about}</p>
                </div>

                {e.organizer && (
                  <div className="rounded-2xl border bg-secondary/30 p-4 text-xs">
                    <span className="text-muted-foreground">Presented by Organizer:</span>
                    <p className="mt-0.5 font-bold text-foreground text-sm">{e.organizer}</p>
                    <p className="mt-1 text-muted-foreground">
                      Official partner event registered with Surat Navratri Board and AapnoPass verification protocol.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "highlights" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Event Highlights</h4>
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {e.highlights?.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {e.artists && e.artists.length > 0 && (
                  <div className="border-t pt-5">
                    <h4 className="font-semibold text-sm mb-3">Artists & Performers</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {e.artists.map((art, idx) => (
                        <div key={idx} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-forest text-saffron text-sm font-bold">
                            {art.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{art.name}</p>
                            <p className="text-xs text-muted-foreground">{art.role || "Performer"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "facilities" && (
              <div>
                <h4 className="font-semibold text-sm mb-3">Venue Amenities & Facilities</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {e.facilities?.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 rounded-xl border bg-card p-3.5 text-sm">
                      <div className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        ✓
                      </div>
                      <span className="font-medium text-foreground">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "rules" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs">
                  <p className="font-bold text-amber-600 text-sm flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Dress Code Requirement
                  </p>
                  <p className="mt-1 text-muted-foreground">{e.dressCode}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-card p-4">
                    <h5 className="font-semibold text-sm mb-2">Age Restrictions</h5>
                    <p className="text-xs text-muted-foreground">{e.ageRestriction}</p>
                  </div>
                  <div className="rounded-2xl border bg-card p-4">
                    <h5 className="font-semibold text-sm mb-2">Entry Turnstiles Rules</h5>
                    <ul className="space-y-1 text-xs text-muted-foreground list-disc pl-4">
                      {e.rules?.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {e.terms && e.terms.length > 0 && (
                  <div className="rounded-2xl border bg-card p-4 text-xs">
                    <h5 className="font-semibold text-sm mb-2">Terms & Conditions</h5>
                    <ul className="space-y-1 text-muted-foreground list-disc pl-4">
                      {e.terms.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pass Tiers Overview */}
          <div className="mt-10 border-t pt-8">
            <h3 className="font-display text-2xl font-bold">Select Pass Tier</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose your pass category. All passes include digital QR access for turnstile entry.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {e.passes?.map((p) => {
                const isSelected = p.id === selectedPassId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPassId(p.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-base">{p.name}</span>
                      {p.vip && (
                        <span className="rounded-full bg-amber-500/20 text-amber-600 px-2.5 py-0.5 text-[10px] font-bold">
                          VIP LOUNGE
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="font-display text-xl font-bold text-primary">{inr(p.price)}</span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {p.left > 0 ? `${p.left} passes available` : "Sold Out"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking & UPI Checkout Engine */}
        <aside className="h-fit rounded-3xl border bg-card p-6 shadow-lg lg:sticky lg:top-24">
          {step === "select" ? (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-saffron">Step 1 of 2</span>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium">Instant QR Pass</span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">Book Pass</h2>

              {/* Night Selector if not season */}
              {!pass.season && e.nights && e.nights.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-semibold text-foreground">Select Garba Night</label>
                  <select
                    value={selectedNight}
                    onChange={(ev) => setSelectedNight(ev.target.value)}
                    className={inputClass}
                  >
                    {e.nights.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center justify-between rounded-xl border bg-secondary/50 p-3">
                <div>
                  <p className="text-xs font-semibold">Quantity</p>
                  <p className="text-[11px] text-muted-foreground">Max 10 per booking</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    className="h-8 w-8 rounded-full border bg-card font-bold hover:bg-secondary disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="font-bold text-base w-4 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(10, qty + 1))}
                    disabled={qty >= 10}
                    className="h-8 w-8 rounded-full border bg-card font-bold hover:bg-secondary disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Contact Information Fields */}
              <div className="mt-5 space-y-3">
                <div>
                  <label className="text-xs font-semibold">Full Name (Printed on pass)</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(ev) => setForm({ ...form, name: ev.target.value })}
                    placeholder="e.g. Hardik Patel"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">WhatsApp Number (For instant pass)</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(ev) =>
                      setForm({ ...form, phone: ev.target.value.replace(/\D/g, "").slice(0, 10) })
                    }
                    placeholder="10-digit mobile number"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold">Email Address (For PDF ticket)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(ev) => setForm({ ...form, email: ev.target.value })}
                    placeholder="yourname@gmail.com"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="mt-6 border-t pt-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Total Payable</span>
                  <span className="font-display text-3xl font-bold text-primary">{inr(total)}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Includes {qty} × {pass.name} ({inr(pass.price)} each)
                </p>
              </div>

              {errorMessage && <p className="mt-3 text-xs text-destructive">{errorMessage}</p>}

              <button
                disabled={!isFormValid || isSubmitting}
                onClick={handleStartBooking}
                className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground shadow hover:opacity-95 disabled:opacity-40 transition"
              >
                {isSubmitting ? "Creating Booking…" : "Proceed to UPI Payment →"}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero convenience fee · Direct organizer settlement</span>
              </div>
            </div>
          ) : (
            /* STEP 2: UPI Payment & UTR Submission */
            <div className="text-center">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-saffron">Step 2 of 2</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  ID: {bookingId}
                </span>
              </div>

              <div className="mt-4 text-left rounded-2xl bg-secondary/60 p-4 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event:</span>
                  <span className="font-semibold text-foreground truncate max-w-[180px]">{e.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pass:</span>
                  <span className="font-semibold text-foreground">{pass.name} × {qty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Night:</span>
                  <span className="font-semibold text-foreground">{pass.season ? "All 9 Nights" : selectedNight}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Amount to Pay</p>
                <p className="font-display text-4xl font-bold text-primary mt-1">{inr(total)}</p>
              </div>

              {/* UPI QR Display */}
              <div className="mt-4 flex flex-col items-center">
                <div className="rounded-2xl border bg-white p-3 shadow-sm">
                  <QR value={upiLink(s, total, note, bookingId || "")} size={150} />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Scan using Google Pay, PhonePe, Paytm, or BHIM
                </p>

                {/* Copy UPI ID button */}
                <button
                  onClick={copyUpiId}
                  className="mt-2 inline-flex items-center gap-1 rounded-full border bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80"
                >
                  {copiedUpi ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUpi ? "Copied!" : `Copy UPI: ${s.upiId}`}</span>
                </button>
              </div>

              {/* Direct UPI App launcher buttons */}
              <div className="mt-4 divide-y rounded-2xl border text-left text-xs font-medium">
                {UPI_APPS.slice(0, 3).map((app) => (
                  <a
                    key={app.name}
                    href={upiLink(s, total, note, bookingId || "", app.base)}
                    className="flex items-center justify-between px-3.5 py-2.5 hover:bg-secondary transition"
                  >
                    <span>Pay with {app.name}</span>
                    <span className="text-primary font-bold">Open ›</span>
                  </a>
                ))}
              </div>

              {/* UTR Submission Box */}
              <div className="mt-5 rounded-2xl border bg-secondary/30 p-4 text-left">
                <label className="text-xs font-bold text-foreground block">
                  Enter 12-digit UPI Reference (UTR)
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  After paying, copy the 12-digit UTR from your bank/UPI app and enter it here to instantly activate your pass.
                </p>
                <input
                  type="text"
                  maxLength={30}
                  value={utrNumber}
                  onChange={(ev) => setUtrNumber(ev.target.value.trim())}
                  placeholder="e.g. 428198271049"
                  className="mt-2 h-11 w-full font-mono rounded-xl border bg-background px-3 text-sm"
                />
              </div>

              {errorMessage && <p className="mt-3 text-xs text-destructive">{errorMessage}</p>}

              <button
                disabled={isSubmitting || !utrNumber}
                onClick={handleConfirmUtrPayment}
                className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary font-bold text-primary-foreground shadow hover:opacity-95 disabled:opacity-40 transition"
              >
                {isSubmitting ? "Verifying…" : "Submit UTR & Get Pass →"}
              </button>

              <button
                onClick={() => setStep("select")}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground"
              >
                ← Edit Booking Details
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
