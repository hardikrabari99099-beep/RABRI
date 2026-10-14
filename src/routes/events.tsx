import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  eventsQuery,
  inr,
  minPrice,
  SURAT_AREAS,
  EVENT_TYPES,
  type EventItem,
  type EventType,
} from "@/lib/data";
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Flame,
  Calendar,
  MapPin,
  Mic,
  SlidersHorizontal,
  Grid,
  List as ListIcon,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/events")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  head: () => ({
    meta: [
      { title: "Explore Navratri Events in Surat 2026 — AapnoPass" },
      { name: "description", content: "Browse every Navratri garba, dandiya, and techno folk event across Surat. Filter by area, price, artist, and book passes instantly." },
      { property: "og:title", content: "Explore Navratri Events in Surat — AapnoPass" },
      { property: "og:description", content: "All Surat Navratri events in one place with instant pass booking." },
    ],
  }),
  component: EventsLayout,
});

export function EventCard({ e, viewMode = "grid" }: { e: EventItem; viewMode?: "grid" | "list" }) {
  const lowest = minPrice(e);
  const totalLeft = e.passes ? e.passes.reduce((sum, p) => sum + (p.left || 0), 0) : 0;
  const isAlmostSoldOut = totalLeft > 0 && totalLeft < 30;
  const isSoldOut = totalLeft <= 0 || e.isSoldOut;

  if (viewMode === "list") {
    return (
      <Link
        to="/events/$id"
        params={{ id: e.id }}
        className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border bg-card transition hover:border-primary/50 hover:shadow-xl"
      >
        <div className="relative h-48 md:h-auto md:w-72 shrink-0 overflow-hidden bg-forest">
          <img
            src={e.coverImage}
            alt={e.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-forest/90 px-2.5 py-1 text-[11px] font-semibold text-saffron backdrop-blur">
              {e.eventType}
            </span>
            {e.tag && (
              <span className="rounded-full bg-saffron px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                {e.tag}
              </span>
            )}
          </div>
          {isSoldOut ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-bold text-destructive-foreground">
              Sold Out
            </span>
          ) : isAlmostSoldOut ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white animate-pulse">
              Fast Filling ({totalLeft} left)
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-primary">
                <MapPin className="h-3.5 w-3.5" /> {e.area}, Surat
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {e.dates}
              </span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold leading-snug group-hover:text-primary">
              {e.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{e.about}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {e.artist && (
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Mic className="h-3.5 w-3.5 text-saffron" /> {e.artist}
                </span>
              )}
              <span>•</span>
              <span>{e.venue}</span>
              <span>•</span>
              <span>{e.time}</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="font-display text-2xl font-bold text-primary">{inr(lowest)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                Book Pass →
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/events/$id"
      params={{ id: e.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
    >
      <div className="relative h-48 w-full overflow-hidden bg-forest">
        <img
          src={e.coverImage}
          alt={e.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-forest/90 px-2.5 py-1 text-[11px] font-semibold text-saffron backdrop-blur">
            {e.eventType}
          </span>
          {e.tag && (
            <span className="rounded-full bg-saffron px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
              {e.tag}
            </span>
          )}
        </div>

        {isSoldOut ? (
          <span className="absolute top-3 right-3 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-bold text-destructive-foreground">
            Sold Out
          </span>
        ) : isAlmostSoldOut ? (
          <span className="absolute top-3 right-3 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white animate-pulse">
            Fast Filling
          </span>
        ) : e.isTrending ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            <Flame className="h-3 w-3" /> Trending
          </span>
        ) : null}

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs font-semibold text-saffron flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {e.area} · {e.dates}
          </p>
          <h3 className="font-display text-xl font-bold leading-tight text-white line-clamp-1 group-hover:text-saffron transition">
            {e.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Mic className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{e.artist || "Live Folk Symphony"}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground truncate">{e.venue}</p>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {e.facilities && e.facilities.slice(0, 2).map((fac) => (
              <span key={fac} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                {fac}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <div>
            <p className="text-[11px] text-muted-foreground">Pass starts at</p>
            <p className="font-display text-xl font-bold text-primary">{inr(lowest)}</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition">
            View Passes →
          </span>
        </div>
      </div>
    </Link>
  );
}

function EventsLayout() {
  const match = useMatchRoute();
  if (match({ to: "/events/$id", fuzzy: true })) return <Outlet />;
  return <EventList />;
}

function EventList() {
  const loaderEvents = Route.useLoaderData();
  const { data: events = loaderEvents } = useQuery({
    ...eventsQuery,
    initialData: loaderEvents,
  });

  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"all" | "featured" | "trending" | "popular" | "today">("all");
  const [priceTier, setPriceTier] = useState<"all" | "under500" | "500to1000" | "above1000">("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "in_stock" | "vip_only">("all");
  const [sortBy, setSortBy] = useState<
    "recommended" | "popular" | "trending" | "price_asc" | "price_desc" | "nearest_date" | "recent"
  >("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Filter & Search Logic
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // 1. Text Search across name, venue, area, artist, keywords
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${e.name} ${e.venue} ${e.area} ${e.artist} ${e.about} ${e.eventType} ${e.organizer}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // 2. Area Filter
      if (selectedArea !== "All" && e.area.toLowerCase() !== selectedArea.toLowerCase()) {
        return false;
      }

      // 3. Event Type Filter
      if (selectedType !== "All" && e.eventType !== selectedType) {
        return false;
      }

      // 4. Quick Discovery Tabs
      if (activeTab === "featured" && !e.isFeatured) return false;
      if (activeTab === "trending" && !e.isTrending) return false;
      if (activeTab === "popular" && !e.isPopular) return false;
      if (activeTab === "today") {
        // Mock today match: events active for Oct 3 / current dates
        if (!e.dates.includes("3") && !e.dates.includes("Oct")) return false;
      }

      // 5. Price Tier Filter
      const lowest = minPrice(e);
      if (priceTier === "under500" && lowest > 500) return false;
      if (priceTier === "500to1000" && (lowest < 500 || lowest > 1000)) return false;
      if (priceTier === "above1000" && lowest < 1000) return false;

      // 6. Availability Filter
      if (availabilityFilter === "in_stock") {
        const totalStock = e.passes?.reduce((acc, p) => acc + (p.left || 0), 0) || 0;
        if (totalStock <= 0 || e.isSoldOut) return false;
      }
      if (availabilityFilter === "vip_only") {
        const hasVip = e.passes?.some((p) => p.vip && p.left > 0);
        if (!hasVip) return false;
      }

      return true;
    });
  }, [events, search, selectedArea, selectedType, activeTab, priceTier, availabilityFilter]);

  // Sorting Logic
  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];
    switch (sortBy) {
      case "popular":
        return list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
      case "trending":
        return list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
      case "price_asc":
        return list.sort((a, b) => minPrice(a) - minPrice(b));
      case "price_desc":
        return list.sort((a, b) => minPrice(b) - minPrice(a));
      case "nearest_date":
        return list.sort((a, b) => a.dates.localeCompare(b.dates));
      case "recent":
        return list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
      case "recommended":
      default:
        return list.sort((a, b) => (a.sort || 99) - (b.sort || 99));
    }
  }, [filteredEvents, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setSelectedArea("All");
    setSelectedType("All");
    setActiveTab("all");
    setPriceTier("all");
    setAvailabilityFilter("all");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    search !== "" ||
    selectedArea !== "All" ||
    selectedType !== "All" ||
    activeTab !== "all" ||
    priceTier !== "all" ||
    availabilityFilter !== "all" ||
    sortBy !== "recommended";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <section className="border-b bg-forest py-12 text-forest-foreground">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-forest-foreground/10 px-3 py-1 text-xs font-semibold text-saffron">
                <Sparkles className="h-3.5 w-3.5" /> Surat Navratri Mahotsav 2026
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
                Explore Navratri Passes
              </h1>
              <p className="mt-2 max-w-2xl text-sm md:text-base opacity-80">
                Discover verified Garba, Dandiya, and Techno Folk festivals across Vesu, Adajan, Piplod, and Surat. Book official passes with instant digital QR entry.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-2xl border border-forest-foreground/20 bg-forest-foreground/5 px-4 py-2 text-xs font-medium">
                ⚡ Synced with FastTicket Feeds
              </span>
            </div>
          </div>

          {/* Quick Discovery Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-t border-forest-foreground/15 pt-6">
            {[
              { id: "all", label: "All Events", icon: null },
              { id: "featured", label: "Featured Picks", icon: Sparkles },
              { id: "trending", label: "Trending in Surat", icon: Flame },
              { id: "popular", label: "Most Popular", icon: TrendingUp },
              { id: "today", label: "Tonight's Garba", icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-saffron text-accent-foreground shadow"
                      : "bg-forest-foreground/10 text-forest-foreground hover:bg-forest-foreground/20"
                  }`}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-5 pt-8">
        {/* Search & Top Action Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event name, artist (e.g. Kinjal Dave), venue, or area..."
              className="h-12 w-full rounded-2xl border bg-card pl-11 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-xs font-medium">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending Now</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="nearest_date">Date: Nearest First</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center rounded-2xl border bg-card p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-xl p-2 transition ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-xl p-2 transition ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
                title="List view"
              >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills - Areas */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Area:
          </span>
          {SURAT_AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                selectedArea === area
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border bg-card hover:bg-secondary text-muted-foreground"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Filter Pills - Event Types */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Type:
          </span>
          <button
            onClick={() => setSelectedType("All")}
            className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
              selectedType === "All"
                ? "bg-forest text-forest-foreground"
                : "border bg-card hover:bg-secondary text-muted-foreground"
            }`}
          >
            All Types
          </button>
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition ${
                selectedType === type
                  ? "bg-forest text-forest-foreground shadow-sm"
                  : "border bg-card hover:bg-secondary text-muted-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar: Price & Availability Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card/60 p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-muted-foreground">Price:</span>
            {[
              { id: "all", label: "All Prices" },
              { id: "under500", label: "Under ₹500" },
              { id: "500to1000", label: "₹500 – ₹1,000" },
              { id: "above1000", label: "₹1,000+" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPriceTier(p.id as any)}
                className={`rounded-lg px-2.5 py-1 font-medium transition ${
                  priceTier === p.id
                    ? "bg-secondary text-foreground font-semibold ring-1 ring-primary/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}

            <span className="mx-2 text-border">|</span>

            <span className="font-semibold text-muted-foreground">Availability:</span>
            <button
              onClick={() =>
                setAvailabilityFilter(availabilityFilter === "in_stock" ? "all" : "in_stock")
              }
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                availabilityFilter === "in_stock"
                  ? "bg-emerald-500/10 text-emerald-600 font-semibold ring-1 ring-emerald-500/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ✓ In Stock Only
            </button>
            <button
              onClick={() =>
                setAvailabilityFilter(availabilityFilter === "vip_only" ? "all" : "vip_only")
              }
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                availabilityFilter === "vip_only"
                  ? "bg-amber-500/10 text-amber-600 font-semibold ring-1 ring-amber-500/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ★ VIP Passes Available
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <RefreshCw className="h-3 w-3" /> Reset all filters
            </button>
          )}
        </div>

        {/* Results Count & Active Search indicator */}
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing <strong className="text-foreground">{sortedEvents.length}</strong> Navratri events in Surat
            {selectedArea !== "All" && ` in ${selectedArea}`}
            {selectedType !== "All" && ` · ${selectedType}`}
          </p>
        </div>

        {/* Events Gallery Grid / List */}
        {sortedEvents.length > 0 ? (
          <div
            className={`mt-6 ${
              viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-4"
            }`}
          >
            {sortedEvents.map((e) => (
              <EventCard key={e.id} e={e} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-3xl border border-dashed p-12 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary text-2xl">
              🔍
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold">No Navratri events match your filters</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Try clearing your search term, expanding the price range, or choosing "All" areas in Surat.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              View All Surat Events
            </button>
          </div>
        )}

        {/* Event Organization & FastTicket Authorized Notice */}
        <div className="mt-16 rounded-2xl border bg-secondary/50 p-6 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Official AapnoPass Navratri Guarantee
                </p>
                <p className="mt-0.5">
                  All listed events are verified against permitted organizer feeds, including FastTicket Surat Navratri network. Passes feature digital QR encryption for fast gate entry.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap font-semibold text-primary hover:underline"
            >
              List your Surat event →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
