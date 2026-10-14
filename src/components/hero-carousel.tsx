import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Search,
  ShieldCheck,
  Flame,
  ArrowRight,
  Ticket,
  Users,
  Headphones,
} from "lucide-react";
import { inr, type EventItem } from "@/lib/data";

interface HeroCarouselProps {
  events: EventItem[];
  currentCity: string;
}

export function HeroCarousel({ events, currentCity }: HeroCarouselProps) {
  const navigate = useNavigate();
  // We use the 7 featured Navratri events for the 7 carousel slides
  const featuredSlides = events.filter((e) => e.category === "navratri").slice(0, 7);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = featuredSlides.length || 1;

  // Auto-advance slides every 4.5 seconds unless paused
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalSlides]);

  const goToPrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const currentEvent = featuredSlides[currentSlideIndex] || events[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/events" });
    }
  };

  if (!currentEvent) return null;

  return (
    <div
      className="relative bg-gradient-to-b from-forest-dark via-forest to-forest-dark text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative Traditional Bandhani & Garland Backdrops */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-saffron/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      {/* Trust Announcement Top Bar */}
      <div className="border-b border-forest-foreground/15 bg-black/30 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-saffron font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Official FastTicket Surat Partner
            </span>
            <span className="hidden md:inline text-forest-foreground/50">|</span>
            <span className="hidden md:inline text-forest-foreground/80">
              Best Event Ticket Booking & Listing Platform in India
            </span>
          </div>
          <div className="flex items-center gap-4 text-forest-foreground/85">
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Genuine Pass Guarantee
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-1 text-saffron font-semibold">
              <Headphones className="h-3.5 w-3.5" /> 24*7 Support
            </span>
          </div>
        </div>
      </div>

      {/* Main Carousel Hero Stage */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-14">
        {/* Slide Stage Container */}
        <div className="relative min-h-[460px] md:min-h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-md">
          {/* Background Image with Dynamic Transitions */}
          {featuredSlides.map((slide, index) => {
            const isActive = index === currentSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.coverImage}
                  alt={slide.name}
                  className="h-full w-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
              </div>
            );
          })}

          {/* Slide Content Overlay */}
          <div className="relative z-20 flex flex-col justify-between h-full p-6 sm:p-10 md:p-12 min-h-[460px] md:min-h-[500px]">
            {/* Top Row: Slide Badges & City */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-saffron px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md">
                  {currentEvent.offerBadge || (currentEvent.isPromoted ? "PROMOTED" : "FEATURED")}
                </span>
                <span className="rounded-full border border-white/20 bg-black/40 backdrop-blur px-3 py-1 text-xs font-semibold text-white/90 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-saffron" />
                  {currentEvent.venue}, {currentEvent.area} · Surat
                </span>
              </div>

              {/* Numbered Slide Pills: Slide 1, Slide 2, etc. */}
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full border border-white/10">
                {featuredSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                      idx === currentSlideIndex
                        ? "bg-saffron text-slate-950 shadow"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    Slide {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Section: Event Name, Artist & Key Details */}
            <div className="max-w-3xl my-6">
              <div className="inline-flex items-center gap-2 text-saffron text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Surat Navratri 2026 · Exclusive Passes
              </div>

              <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
                {currentEvent.name}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-white/85 line-clamp-2 max-w-2xl leading-relaxed">
                {currentEvent.about}
              </p>

              {/* Event Metas */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-white/90">
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
                  <Calendar className="h-4 w-4 text-saffron" />
                  <span>{currentEvent.dates}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="h-4 w-4 text-saffron" />
                  <span>{currentEvent.time}</span>
                </div>
                {currentEvent.artist && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
                    <Users className="h-4 w-4 text-saffron" />
                    <span>
                      Artist: <strong className="text-white">{currentEvent.artist}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Price, CTA & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pt-4 border-t border-white/15">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-white/70 uppercase tracking-wider font-semibold">
                  Starts from
                </span>
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-saffron">
                  {inr(currentEvent.passes[0]?.price || 499)}
                </span>
                <span className="text-xs text-white/60 font-medium">/ onward</span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/events/$id"
                  params={{ id: currentEvent.id }}
                  className="flex items-center gap-2 rounded-full bg-saffron px-7 py-3.5 text-xs font-bold text-slate-950 shadow-xl hover:bg-saffron-light transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Ticket className="h-4 w-4" /> Book Passes Now
                </Link>
                <Link
                  to="/events/$id"
                  params={{ id: currentEvent.id }}
                  className="rounded-full border border-white/30 bg-white/10 backdrop-blur px-5 py-3.5 text-xs font-semibold text-white hover:bg-white/20 transition"
                >
                  View Details
                </Link>
              </div>

              {/* Prev / Next Slide Nav Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrev}
                  className="h-10 w-10 rounded-full border border-white/20 bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-saffron hover:text-slate-950 hover:border-transparent transition"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={goToNext}
                  className="h-10 w-10 rounded-full border border-white/20 bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-saffron hover:text-slate-950 hover:border-transparent transition"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar (FastTicket style: "Search events, sports, cities...") */}
        <div className="mt-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl"
          >
            <div className="flex flex-1 items-center w-full px-2">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, sports, cities, artists, venues (e.g. Suvarn, Kesariya, Padel, Kinjal Dave)..."
                className="h-11 w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto rounded-xl bg-forest px-8 py-3 text-xs font-bold text-saffron hover:bg-forest/90 transition shrink-0"
            >
              Search Events
            </button>
          </form>
        </div>

        {/* Explore Our Categories: FastTicket Dual Category Banners */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Event Category Banner */}
          <Link
            to="/events"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary/30 to-black/60 p-6 backdrop-blur transition hover:border-saffron hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-saffron">
                  Festivals & Live Entertainment
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">Event Category</h3>
                <p className="mt-1 text-xs text-white/70">
                  Navratri Garba, Live Concerts, Stand-up Comedy & DJ nights
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-saffron group-hover:underline">
                  Explore More{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-saffron/20 text-3xl border border-saffron/30 shrink-0">
                💃
              </div>
            </div>
          </Link>

          {/* Sport Category Banner */}
          <a
            href="#sports-pitch-section"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-950/40 to-black/60 p-6 backdrop-blur transition hover:border-emerald-400 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Turfs & Indoor Games
                </span>
                <h3 className="font-display text-2xl font-bold text-white mt-1">Sport Category</h3>
                <p className="mt-1 text-xs text-white/70">
                  Pickleball, Glass Padel Courts, Box Cricket & Esports gaming
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:underline">
                  Explore More{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/20 text-3xl border border-emerald-500/30 shrink-0">
                🏏
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
