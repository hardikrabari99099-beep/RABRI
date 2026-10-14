import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect, useRef } from "react";
import { HeroCarousel } from "@/components/hero-carousel";
import { PassCard, QR } from "@/components/site";
import { EventCard } from "./events";
import {
  eventsQuery,
  settingsQuery,
  CATEGORIES,
  SPORTS_ACTIVITIES,
  INDIAN_CITIES,
  FASTTICKET_ARTISTS,
  FASTTICKET_ORGANIZERS,
  FASTTICKET_TOP_CITIES,
  getSelectedCity,
  setSelectedCity,
  inr,
  newId,
  rememberId,
  type EventItem,
  type Settings,
  type SportActivity,
  type Booking,
} from "@/lib/data";
import {
  Sparkles,
  MapPin,
  Flame,
  ShieldCheck,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Search,
  Calendar,
  Clock,
  Trophy,
  Activity,
  CheckCircle2,
  Tag,
  ArrowRight,
  SlidersHorizontal,
  X,
  CreditCard,
  PlusCircle,
  Headphones,
  Users,
  Award,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(eventsQuery),
    ]),
  head: () => ({
    meta: [
      { title: "FastTicket Surat — Book Navratri Passes, Events & Sports Turfs" },
      {
        name: "description",
        content:
          "Official ticket partner for Surat Navratri 2026. Book Suvarn Navratri, Kesariya 4.0, Yashvi Purva Mantri, Falguni Pathak, The OG Navratri, Padel, Pickleball, and Box Cricket turfs with instant QR entry.",
      },
      { property: "og:title", content: "FastTicket Surat — Book It. Love It. Live It." },
      {
        property: "og:description",
        content: "Discover exciting events, popular artists, and sports pitches near you in Surat.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const loaderData = Route.useLoaderData();
  const initialSettings = loaderData?.[0] as Settings;
  const initialEvents = loaderData?.[1] as EventItem[];
  const navigate = useNavigate();

  const { data: s = initialSettings } = useQuery({
    ...settingsQuery,
    initialData: initialSettings,
  });
  const { data: events = initialEvents } = useQuery({
    ...eventsQuery,
    initialData: initialEvents,
  });

  const [currentCity, setCurrentCity] = useState("Surat");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArtistFilter, setSelectedArtistFilter] = useState<string | null>(null);
  const [upcomingVisibleCount, setUpcomingVisibleCount] = useState(10);
  const [bookingSport, setBookingSport] = useState<SportActivity | null>(null);

  // Artist horizontal scroll ref
  const artistScrollRef = useRef<HTMLDivElement>(null);
  const organizerScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentCity(getSelectedCity());
    const handler = (e: any) => setCurrentCity(e.detail);
    window.addEventListener("city_changed", handler);
    return () => window.removeEventListener("city_changed", handler);
  }, []);

  const scrollArtists = (direction: "left" | "right") => {
    if (artistScrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      artistScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const scrollOrganizers = (direction: "left" | "right") => {
    if (organizerScrollRef.current) {
      const offset = direction === "left" ? -340 : 340;
      organizerScrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Surat FastTicket primary events (First 10)
  const suratNavratriEvents = useMemo(() => {
    return events.filter((e) => e.city.toLowerCase() === "surat" && e.category === "navratri");
  }, [events]);

  // Filtered main events for "Book the Events You Love"
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedArtistFilter) {
        const matchesArtist =
          e.artist?.toLowerCase().includes(selectedArtistFilter.toLowerCase()) ||
          e.artists?.some((a) => a.name.toLowerCase().includes(selectedArtistFilter.toLowerCase()));
        if (!matchesArtist) return false;
      }
      if (activeCategory === "all") return true;
      if (activeCategory === "navratri")
        return (
          e.category === "navratri" ||
          e.eventType.includes("Garba") ||
          e.eventType.includes("Dandiya")
        );
      return e.category === activeCategory;
    });
  }, [events, activeCategory, selectedArtistFilter]);

  // Ahmedabad Live Events
  const ahmedabadLiveEvents = useMemo(() => {
    return events.filter((e) => e.city.toLowerCase() === "ahmedabad");
  }, [events]);

  return (
    <div className="min-h-screen bg-background">
      {/* 1. HIGH-IMPACT HERO SECTION WITH CAROUSEL TRANSITION */}
      <HeroCarousel events={events} currentCity={currentCity} />

      {/* 2. EXPLORE OUR CATEGORIES BAR */}
      <section className="border-b bg-card py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-saffron">
                Discover Exciting Events Near You
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-bold">Explore Our Categories</h2>
            </div>
            <Link to="/events" className="text-xs font-bold text-primary hover:underline">
              See All →
            </Link>
          </div>

          <div className="mt-4 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id && !selectedArtistFilter;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedArtistFilter(null);
                    if (cat.id === "sports") {
                      document
                        .getElementById("sports-pitch-section")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold whitespace-nowrap transition shadow-2xs ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow"
                      : "bg-background hover:bg-secondary text-foreground hover:border-primary/40"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. BOOK THE EVENTS YOU LOVE ("Book It. Love It. Live It.") */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-saffron flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Book It. Love It. Live It.
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
                Book the Events You Love.
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Verified Surat Navratri passes, VIP domes, and celebrity garba arenas with turnstile
                QR entry.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedArtistFilter && (
                <button
                  onClick={() => setSelectedArtistFilter(null)}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  Clear "{selectedArtistFilter}" <X className="h-3 w-3" />
                </button>
              )}
              <Link
                to="/events"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                See All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Grid of the 10 Surat Navratri FastTicket events */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.slice(0, 10).map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEET THE ARTISTS YOU LOVE (Popular Artists - All 50 Artists from FastTicket) */}
      <section className="py-16 bg-forest text-forest-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest-foreground/15 pb-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-foreground/10 px-3 py-1 text-xs font-semibold text-saffron">
                <Users className="h-3.5 w-3.5" /> Popular Artists
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white">
                Meet the Artists You Love.
              </h2>
              <p className="mt-1 text-xs text-forest-foreground/80">
                Over 50 celebrated Gujarati folk legends, Bollywood playback singers, and Dandiya
                superstars.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollArtists("left")}
                className="h-9 w-9 rounded-full border border-forest-foreground/20 bg-forest-foreground/10 text-white flex items-center justify-center hover:bg-saffron hover:text-slate-950 transition"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollArtists("right")}
                className="h-9 w-9 rounded-full border border-forest-foreground/20 bg-forest-foreground/10 text-white flex items-center justify-center hover:bg-saffron hover:text-slate-950 transition"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Artists Carousel */}
          <div
            ref={artistScrollRef}
            className="mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x"
          >
            {FASTTICKET_ARTISTS.map((artist) => {
              const isSelected = selectedArtistFilter === artist.name;
              return (
                <div
                  key={artist.name}
                  onClick={() => {
                    setSelectedArtistFilter(isSelected ? null : artist.name);
                    const el = document.getElementById("events-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`group flex-shrink-0 w-36 sm:w-40 cursor-pointer rounded-2xl p-3 text-center transition snap-start border ${
                    isSelected
                      ? "bg-saffron text-slate-950 border-saffron shadow-lg"
                      : "bg-forest-foreground/5 hover:bg-forest-foreground/15 border-forest-foreground/15 text-white"
                  }`}
                >
                  <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border-2 border-saffron/40 group-hover:border-saffron group-hover:scale-105 transition duration-300">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="mt-3 font-display text-sm font-bold truncate leading-tight">
                    {artist.name}
                  </h4>
                  <p
                    className={`mt-0.5 text-[10px] truncate ${
                      isSelected ? "text-slate-900" : "text-forest-foreground/70"
                    }`}
                  >
                    {artist.genre}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isSelected
                        ? "bg-slate-950 text-white"
                        : "bg-forest-foreground/10 text-saffron"
                    }`}
                  >
                    {artist.showsCount} Shows
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. BRINGING YOUR VISION TO LIFE (Event Organizers) */}
      <section className="py-14 border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-saffron">
                Event Organizers
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold">
                Bringing Your Vision to Life
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Trusted event creators, sound engineers, and festival organizers partnering with
                FastTicket.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollOrganizers("left")}
                className="h-8 w-8 rounded-full border bg-background text-foreground flex items-center justify-center hover:bg-secondary transition"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollOrganizers("right")}
                className="h-8 w-8 rounded-full border bg-background text-foreground flex items-center justify-center hover:bg-secondary transition"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Organizers Horizontal Marquee / Carousel */}
          <div
            ref={organizerScrollRef}
            className="mt-6 flex gap-3.5 overflow-x-auto pb-3 scrollbar-none snap-x"
          >
            {FASTTICKET_ORGANIZERS.map((org) => (
              <div
                key={org.name}
                className="flex-shrink-0 w-64 rounded-2xl border bg-background p-4 shadow-2xs transition hover:border-primary/50 hover:shadow-md snap-start"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-saffron font-bold text-sm shrink-0">
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs truncate leading-tight text-foreground">
                      {org.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {org.category} · {org.city}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-2.5 text-[10px]">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Verified Partner
                  </span>
                  <span className="font-bold text-primary">{org.eventsCount} Events</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOOK THE PERFECT PITCH ("Unleash Your Inner Athlete") */}
      <section id="sports-pitch-section" className="py-16 bg-secondary/35 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                <Trophy className="h-4 w-4" /> Unleash Your Inner Athlete
              </div>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold">
                Book the Perfect Pitch
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Reserve floodlit Padel glass courts, dedicated Pickleball clubs, and esports zones
                across Surat.
              </p>
            </div>
            <span className="rounded-full border bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground">
              ⚡ Instant Slot Confirmation
            </span>
          </div>

          {/* The Baseline Padel, Pickle Fusion, 97 Esports Zone */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SPORTS_ACTIVITIES.slice(0, 3).map((sp) => (
              <div
                key={sp.id}
                className="group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:shadow-xl hover:border-primary/40"
              >
                <div className="relative h-48 w-full overflow-hidden bg-forest">
                  <img
                    src={sp.image}
                    alt={sp.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-forest/90 px-3 py-1 text-[11px] font-semibold text-saffron backdrop-blur border border-forest-foreground/20">
                    {sp.sportType}
                  </span>
                  {sp.tag && (
                    <span className="absolute top-3 right-3 rounded-full bg-saffron px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground">
                      {sp.tag}
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-saffron flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {sp.area}, {sp.city}
                    </p>
                    <h3 className="font-display text-xl font-bold">{sp.name}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{sp.about}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {sp.amenities.slice(0, 3).map((am, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">
                        Price per slot
                      </p>
                      <p className="font-display text-2xl font-bold text-primary">
                        Rs. {sp.pricePerHour.toLocaleString("en-IN")}{" "}
                        <span className="text-xs font-normal text-muted-foreground">onwards</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setBookingSport(sp)}
                      className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition"
                    >
                      Book Slot Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EASY BOOKING, UNFORGETTABLE EXPERIENCES ("Experience the Energy of Surat.") */}
      <section id="events-section" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-saffron">
                Easy Booking, Unforgettable Experiences.
              </p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold">
                Experience the Energy of Surat.
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                All prominent Surat Navratri grounds, dome arenas, and heritage utsavs.
              </p>
            </div>
            <Link
              to="/events"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              See All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suratNavratriEvents.slice(0, upcomingVisibleCount).map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>

          {upcomingVisibleCount < suratNavratriEvents.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setUpcomingVisibleCount((prev) => prev + 6)}
                className="rounded-full border bg-card px-8 py-3 text-xs font-bold text-foreground hover:bg-secondary transition shadow-2xs"
              >
                Load More Events ↓
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 8. SIMPLE BOOKING, ENDLESS FUN ("Ahmedabad Live—Get Your Tickets") */}
      {ahmedabadLiveEvents.length > 0 && (
        <section className="py-14 bg-secondary/30 border-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-saffron">
                  Simple Booking, Endless Fun.
                </p>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold">
                  Ahmedabad Live—Get Your Tickets
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Shubh Mandli and Dwarkadhish Ni Ramzat live events on FastTicket.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCity("Ahmedabad");
                  navigate({ to: "/events" });
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Explore Ahmedabad Events →
              </button>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {ahmedabadLiveEvents.map((e) => (
                <div
                  key={e.id}
                  className="rounded-3xl border bg-card p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-center transition hover:shadow-lg hover:border-primary/40"
                >
                  <img
                    src={e.coverImage}
                    alt={e.name}
                    className="h-40 w-full sm:w-48 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="rounded-full bg-saffron/20 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold">
                      {e.offerBadge || "AHMEDABAD"}
                    </span>
                    <h3 className="font-display text-xl font-bold mt-1 text-foreground">
                      {e.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3.5 w-3.5 text-saffron" /> {e.dates} {e.time}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-saffron" /> {e.venue}, {e.city}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Price
                        </span>
                        <p className="font-display text-2xl font-bold text-primary">
                          {inr(e.passes[0]?.price || 100)}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            / onward
                          </span>
                        </p>
                      </div>
                      <Link
                        to="/events/$id"
                        params={{ id: e.id }}
                        className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition"
                      >
                        Book Passes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. FEEL THE JOY OF FESTIVALS WHEREVER YOU ARE ("Festive Vibes, Anytime, Anywhere") */}
      <section className="py-14 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-saffron">
            Feel the Joy of Festivals Wherever You Are
          </p>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold">
            Festive Vibes, Anytime, Anywhere
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xl mx-auto">
            Book passes and events in premier entertainment destinations across India.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {FASTTICKET_TOP_CITIES.map((city) => (
              <button
                key={city}
                onClick={() => {
                  setSelectedCity(city);
                  navigate({ to: "/events" });
                }}
                className={`rounded-full px-4 py-2 text-xs font-medium border transition ${
                  city === currentCity
                    ? "bg-primary text-primary-foreground font-bold shadow"
                    : "bg-background hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {city === "Surat" && "⭐ "}
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FASTTICKET - YOUR RELIABLE TICKET PARTNER (Trust & Guarantees) */}
      <section className="py-14 border-t bg-secondary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron">
              FastTicket Guarantee
            </span>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold">
              Your Reliable Ticket Partner
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Official ticket issuer powering the smoothest turnstile access and booking
              experiences.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border bg-card p-6 shadow-2xs">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 text-2xl">
                🔒
              </span>
              <h4 className="mt-4 font-display text-base font-bold">Secure Checkout</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Fast & Secured Payment via official UPI apps with instant UTR verification.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-2xs">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron/20 text-amber-700 text-2xl">
                ⚡
              </span>
              <h4 className="mt-4 font-display text-base font-bold">Instant Confirmation</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Receive digital QR passes instantly on your screen and in My Passes with refund
                guarantee options.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-2xs">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 text-2xl">
                🎫
              </span>
              <h4 className="mt-4 font-display text-base font-bold">Official Ticket Seller</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Used by over 6M+ people across India for Navratri, sports pitches, and concerts.
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-2xs">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-500/10 text-purple-600 text-2xl">
                🎧
              </span>
              <h4 className="mt-4 font-display text-base font-bold">24/7 Customer Service</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Reliable after-sales support via dedicated hotline and WhatsApp ticketing desk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. LIST YOUR SHOW / ORGANIZER PARTNER CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="rounded-3xl bg-forest p-8 sm:p-12 text-forest-foreground text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron text-accent-foreground text-xl mx-auto shadow-md">
            📢
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl font-bold text-white">
            List Your Show on FastTicket
          </h2>
          <p className="mt-3 max-w-xl text-sm sm:text-base opacity-85 mx-auto leading-relaxed">
            Got a show, event, activity or a great experience? Partner with us & get listed on
            FastTicket to reach millions of eventgoers in Surat & across India.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-saffron px-8 py-3.5 text-xs font-bold text-accent-foreground shadow-lg hover:opacity-90 transition transform hover:-translate-y-0.5"
            >
              Partner With Us & List Show →
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-forest-foreground/30 px-6 py-3.5 text-xs font-semibold hover:bg-forest-foreground/10 transition"
            >
              Ticket Hotline: info@fastticket.live
            </Link>
          </div>
        </div>
      </section>

      {/* 12. SPORTS BOOKING MODAL */}
      {bookingSport && (
        <SportsBookingModal sport={bookingSport} onClose={() => setBookingSport(null)} />
      )}
    </div>
  );
}

function SportsBookingModal({ sport, onClose }: { sport: SportActivity; onClose: () => void }) {
  const [selectedSlot, setSelectedSlot] = useState(sport.slots[0] || "06:00 PM - 07:00 PM");
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [date, setDate] = useState("Today, 14 Oct 2026");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"slot" | "success">("slot");
  const [bookingId, setBookingId] = useState("");

  const subtotal = sport.pricePerHour * selectedDuration;

  const handleConfirm = () => {
    if (!name || phone.length < 10) return;
    const bid = newId();
    setBookingId(bid);

    const b: Booking = {
      id: bid,
      event_id: sport.id,
      event_name: `${sport.name} (${sport.sportType})`,
      pass_id: "pitch_slot",
      pass_name: `${selectedDuration} Hr Slot · ${selectedSlot}`,
      qty: 1,
      name: name.trim(),
      phone: phone.trim(),
      email: `${phone}@fastticket.live`,
      night: date,
      total: subtotal,
      utr: "SLOT-" + Math.floor(Math.random() * 900000 + 100000),
      status: "approved",
      created_at: new Date().toISOString(),
    };

    rememberId(bid);
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("aapnopass.local_bookings") || "[]";
        const list = JSON.parse(raw);
        localStorage.setItem("aapnopass.local_bookings", JSON.stringify([b, ...list]));
      } catch {}
    }

    setStep("success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
              {sport.sportType} · {sport.area}
            </span>
            <h3 className="font-display text-xl font-bold">{sport.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {step === "slot" ? (
          <div className="mt-4 space-y-4 text-xs">
            {/* Slot selector */}
            <div>
              <label className="font-semibold block mb-1.5">Select Time Slot</label>
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1">
                {sport.slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border px-3 py-2 text-[11px] font-semibold text-center transition ${
                      selectedSlot === slot
                        ? "bg-primary text-primary-foreground border-primary shadow"
                        : "bg-background hover:bg-secondary text-muted-foreground"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration selector */}
            <div>
              <label className="font-semibold block mb-1.5">Duration</label>
              <div className="flex gap-2">
                {[1, 2].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setSelectedDuration(hrs)}
                    className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                      selectedDuration === hrs
                        ? "bg-forest text-saffron border-forest shadow"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {hrs} Hour (Rs. {(sport.pricePerHour * hrs).toLocaleString("en-IN")})
                  </button>
                ))}
              </div>
            </div>

            {/* Player details */}
            <div className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Team Captain / Player Name"
                className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit WhatsApp number"
                className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
              />
            </div>

            <div className="border-t pt-3 flex items-baseline justify-between">
              <span className="font-medium text-muted-foreground">Total Slot Fee</span>
              <span className="font-display text-2xl font-bold text-primary">
                Rs. {subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              disabled={!name || phone.length < 10}
              onClick={handleConfirm}
              className="w-full rounded-full bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:opacity-90 disabled:opacity-40 transition"
            >
              Confirm & Book Slot →
            </button>
          </div>
        ) : (
          <div className="py-6 text-center text-xs">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 text-xl mx-auto">
              ✓
            </span>
            <h4 className="mt-2 font-display text-xl font-bold">Slot Confirmed!</h4>
            <p className="mt-1 font-mono font-bold text-primary">Booking ID: {bookingId}</p>
            <p className="mt-1 text-muted-foreground">
              {sport.name} reserved for {selectedDuration} hr ({selectedSlot}). An entry QR has been
              created.
            </p>
            <div className="mt-4 flex justify-center">
              <QR value={`AAPNOPASS:${bookingId}`} size={80} />
            </div>
            <Link
              to="/my-pass"
              className="mt-5 inline-block rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow"
            >
              View in My Passes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
