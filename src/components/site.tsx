import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useQuery } from "@tanstack/react-query";
import {
  settingsQuery,
  INDIAN_CITIES,
  getSelectedCity,
  setSelectedCity,
  CATEGORIES,
  type Settings,
  type IndianCity,
} from "@/lib/data";
import {
  MapPin,
  Search,
  Ticket,
  ChevronDown,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Menu,
  X,
  PlusCircle,
  Home,
  Compass,
  Trophy,
  User,
  Heart,
  ExternalLink,
  Flame,
} from "lucide-react";

export function Header() {
  const [currentCity, setCurrentCity] = useState("Surat");
  const [showCityModal, setShowCityModal] = useState(false);
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentCity(getSelectedCity());
    const handler = (e: any) => setCurrentCity(e.detail);
    window.addEventListener("city_changed", handler);
    return () => window.removeEventListener("city_changed", handler);
  }, []);

  const handleCitySelect = (c: string) => {
    setSelectedCity(c);
    setCurrentCity(c);
    setShowCityModal(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate({ to: "/events" });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md">
        {/* Main Desktop Header Bar */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Brand Logo & Location */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-forest text-saffron font-bold text-base shadow-sm">
                ⚡
              </div>
              <div>
                <span className="font-display text-lg font-black tracking-tight text-foreground block leading-tight">
                  FastTicket <span className="text-primary text-xs font-semibold">| AapnoPass</span>
                </span>
                <span className="text-[9px] font-bold text-saffron uppercase tracking-widest block -mt-0.5">
                  Surat Live
                </span>
              </div>
            </Link>

            {/* City Selector Button */}
            <button
              onClick={() => setShowCityModal(true)}
              className="flex items-center gap-1.5 rounded-full border bg-secondary/80 px-3 py-1 text-xs font-bold text-foreground hover:bg-secondary transition shrink-0"
              title="Change City"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>{currentCity}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>

          {/* Desktop Search Bar (Exact FastTicket: "Search events, sports, cities...") */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex flex-1 max-w-md items-center"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search events, sports, cities..."
              className="h-10 w-full rounded-full border bg-background pl-10 pr-4 text-xs outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </form>

          {/* 24*7 Support Badge */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>24*7 Support</span>
          </div>

          {/* Navigation Links & Action Buttons */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-muted-foreground">
            <Link
              to="/"
              className="hover:text-primary transition"
              activeProps={{ className: "text-primary font-bold" }}
            >
              Home
            </Link>
            <Link
              to="/events"
              className="hover:text-primary transition"
              activeProps={{ className: "text-primary font-bold" }}
            >
              Events
            </Link>
            <a href="/#sports-pitch-section" className="hover:text-primary transition">
              Sports
            </a>
            <Link
              to="/how-it-works"
              className="hover:text-primary transition"
              activeProps={{ className: "text-primary font-bold" }}
            >
              About Us
            </Link>
            <Link to="/events" className="hover:text-primary transition text-amber-700 font-bold">
              Offers
            </Link>
            <Link
              to="/my-pass"
              className="hover:text-primary transition"
              activeProps={{ className: "text-primary font-bold" }}
            >
              My Passes
            </Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowOrganizerModal(true)}
              className="hidden sm:flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition"
            >
              <PlusCircle className="h-3.5 w-3.5" /> List Your Event
            </button>
            <Link
              to="/admin"
              className="rounded-full bg-forest px-4 py-2 text-xs font-bold text-saffron hover:opacity-90 transition shadow-sm"
            >
              Admin / Gate
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className="border-t px-4 py-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder={`Search events & sports in ${currentCity}...`}
              className="h-9 w-full rounded-full border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary"
            />
          </form>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-card px-5 py-4 lg:hidden text-sm space-y-3">
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold py-1 hover:text-primary"
            >
              Explore All Events
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold py-1 text-primary flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-saffron" /> Navratri 2026 Passes
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold py-1 hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              to="/my-pass"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold py-1 hover:text-primary"
            >
              My Passes
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold py-1 hover:text-primary"
            >
              Contact Support
            </Link>
            <div className="border-t pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowOrganizerModal(true);
                }}
                className="w-full text-center rounded-full border border-primary text-primary py-2 text-xs font-bold"
              >
                + List Your Event (Organizer Onboarding)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* City Selection Modal */}
      {showCityModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setShowCityModal(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-display text-xl font-bold">Select Your City</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Currently showing events and sports activities in{" "}
                  <strong className="text-foreground">{currentCity}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowCityModal(false)}
                className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-saffron mb-3">
                Major Hubs & Popular Cities
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {INDIAN_CITIES.map((c) => {
                  const isSelected = c === currentCity;
                  return (
                    <button
                      key={c}
                      onClick={() => handleCitySelect(c)}
                      className={`rounded-2xl border px-3 py-2.5 text-xs font-semibold text-center transition ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow"
                          : "bg-background hover:bg-secondary text-foreground hover:border-primary/40"
                      }`}
                    >
                      {c === "Surat" && "⭐ "}
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-secondary/50 p-3.5 text-xs text-muted-foreground text-center">
              AapnoPass is actively partnering with organizers in Gujarat and western India for
              Navratri 2026.
            </div>
          </div>
        </div>
      )}

      {/* Organizer Onboarding Modal */}
      {showOrganizerModal && (
        <OrganizerModal onClose={() => setShowOrganizerModal(false)} currentCity={currentCity} />
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 py-1.5 px-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-around text-[10px] font-semibold text-muted-foreground">
          <Link to="/" className="flex flex-col items-center gap-1 hover:text-primary">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link to="/events" className="flex flex-col items-center gap-1 hover:text-primary">
            <Compass className="h-4 w-4" />
            <span>Explore</span>
          </Link>
          <Link
            to="/events"
            className="flex flex-col items-center gap-1 hover:text-primary text-saffron"
          >
            <Sparkles className="h-4 w-4" />
            <span>Navratri</span>
          </Link>
          <Link to="/my-pass" className="flex flex-col items-center gap-1 hover:text-primary">
            <Ticket className="h-4 w-4" />
            <span>Tickets</span>
          </Link>
          <Link to="/admin" className="flex flex-col items-center gap-1 hover:text-primary">
            <User className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </>
  );
}

function OrganizerModal({ onClose, currentCity }: { onClose: () => void; currentCity: string }) {
  const [form, setForm] = useState({
    organizerName: "",
    orgTitle: "",
    email: "",
    phone: "",
    eventCategory: "navratri",
    city: currentCity,
    expectedAttendees: "1000 - 5000",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="font-display text-2xl font-bold">List Your Event on AapnoPass</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reach thousands of attendees in Surat with automated ticketing & QR entry.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-secondary text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center text-xs">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 text-2xl mx-auto">
              ✓
            </span>
            <h4 className="mt-3 font-display text-xl font-bold">Inquiry Submitted!</h4>
            <p className="mt-1 text-muted-foreground max-w-xs mx-auto">
              Thank you, {form.organizerName}. Our event onboarder will call or WhatsApp you at{" "}
              {form.phone} within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="font-semibold block mb-1">Your Full Name</label>
                <input
                  required
                  type="text"
                  value={form.organizerName}
                  onChange={(e) => setForm({ ...form, organizerName: e.target.value })}
                  placeholder="e.g. Bhavesh Shah"
                  className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Company / Organization / Club</label>
                <input
                  required
                  type="text"
                  value={form.orgTitle}
                  onChange={(e) => setForm({ ...form, orgTitle: e.target.value })}
                  placeholder="e.g. Surat Youth Garba Club"
                  className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="font-semibold block mb-1">WhatsApp / Phone Number</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile"
                  className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Official Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="organizer@gmail.com"
                  className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="font-semibold block mb-1">Event Category</label>
                <select
                  value={form.eventCategory}
                  onChange={(e) => setForm({ ...form, eventCategory: e.target.value })}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
                >
                  <option value="navratri">Navratri Garba / Dandiya</option>
                  <option value="concerts">Live Concert / Music Show</option>
                  <option value="comedy">Stand-up Comedy</option>
                  <option value="sports">Sports Turf / Box Cricket / Padel</option>
                  <option value="parties">Nightlife / DJ Party</option>
                  <option value="workshops">Workshop / Seminar</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">City Location</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Expected Attendee Footfall</label>
              <select
                value={form.expectedAttendees}
                onChange={(e) => setForm({ ...form, expectedAttendees: e.target.value })}
                className="h-10 w-full rounded-xl border bg-background px-3 text-xs"
              >
                <option value="Under 500">Under 500 Attendees</option>
                <option value="500 - 2000">500 – 2,000 Attendees</option>
                <option value="2000 - 5000">2,000 – 5,000 Attendees</option>
                <option value="5000+">Mega Festival (5,000+ Attendees)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
              >
                Submit Organizer Application →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function Footer({ initialSettings }: { initialSettings?: Settings | null }) {
  const { data: s = initialSettings } = useQuery({
    ...settingsQuery,
    initialData: initialSettings ?? undefined,
  });

  return (
    <footer className="border-t bg-forest text-forest-foreground pt-16 pb-20 lg:pb-12 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Trust Banner */}
        <div className="rounded-3xl border border-forest-foreground/15 bg-forest-foreground/5 p-6 md:p-8 backdrop-blur grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-saffron text-accent-foreground text-lg shrink-0">
              🔒
            </span>
            <div>
              <p className="font-bold text-sm text-foreground/90 text-white">
                Fast & Secure Checkout
              </p>
              <p className="mt-0.5 text-forest-foreground/75 text-[11px]">
                Instant UPI verification with bank-grade encryption.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-saffron text-accent-foreground text-lg shrink-0">
              ⚡
            </span>
            <div>
              <p className="font-bold text-sm text-foreground/90 text-white">
                Instant Confirmation
              </p>
              <p className="mt-0.5 text-forest-foreground/75 text-[11px]">
                Receive digital QR passes on your device immediately.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-saffron text-accent-foreground text-lg shrink-0">
              🎟️
            </span>
            <div>
              <p className="font-bold text-sm text-foreground/90 text-white">
                Official Ticket Partner
              </p>
              <p className="mt-0.5 text-forest-foreground/75 text-[11px]">
                Direct integration with verified organizers in Surat.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-saffron text-accent-foreground text-lg shrink-0">
              💬
            </span>
            <div>
              <p className="font-bold text-sm text-foreground/90 text-white">
                24/7 Dedicated Support
              </p>
              <p className="mt-0.5 text-forest-foreground/75 text-[11px]">
                Reliable WhatsApp & phone assistance for every booking.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-Column Sitemap Section */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 md:grid-cols-5">
          {/* Brand Info & Hotline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-saffron text-accent-foreground font-bold text-sm">
                ⚡
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                FastTicket <span className="text-saffron">AapnoPass</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-forest-foreground/80 max-w-sm leading-relaxed">
              Entertainment discovery and monetization platform. Official partner for Surat Navratri
              2026, sports pitch reservations, and live entertainment.
            </p>
            <div className="mt-4 rounded-2xl bg-forest-foreground/10 border border-forest-foreground/15 p-4 text-xs space-y-2">
              <p className="font-bold text-saffron uppercase tracking-wider text-[10px]">
                Ticket Hotline & Customer Care
              </p>
              <p className="text-white">
                We're here to help, Email us now:{" "}
                <a href="mailto:info@fastticket.live" className="font-mono text-saffron underline">
                  info@fastticket.live
                </a>
              </p>
              <p className="text-forest-foreground/75 text-[11px]">
                Mon to Sat · Support available for bookings and ticket assistance.
              </p>
            </div>
          </div>

          {/* List Your Show & Customer Support */}
          <div>
            <p className="font-bold text-white text-sm tracking-wider uppercase">Partner With Us</p>
            <div className="mt-3 text-xs text-forest-foreground/80 space-y-2">
              <p className="font-semibold text-white">List Your Show</p>
              <p className="text-[11px]">
                Got a show, event, activity or a great experience? Partner with us & get listed on
                FastTicket.
              </p>
              <Link
                to="/contact"
                className="inline-block rounded-full bg-saffron px-3.5 py-1.5 text-[11px] font-bold text-slate-950 mt-1 hover:opacity-90"
              >
                + List Your Event
              </Link>
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-forest-foreground/80">
              <li>
                <Link to="/how-it-works" className="hover:text-saffron">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/my-pass" className="hover:text-saffron">
                  My Passes & QR Entry
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-saffron">
                  Refund Guarantee Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Events in Top Cities */}
          <div>
            <p className="font-bold text-white text-sm tracking-wider uppercase">
              Events in Top Cities
            </p>
            <ul className="mt-3 space-y-1 text-xs text-forest-foreground/80">
              {[
                "Surat",
                "Ahmedabad",
                "Mumbai",
                "Pune",
                "Delhi-NCR",
                "Chennai",
                "Bengaluru",
                "Hyderabad",
                "Daman",
                "Indore",
                "Jaipur",
                "Vadodara",
                "Kolkata",
                "Kochi",
              ].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => {
                      setSelectedCity(c);
                    }}
                    className="hover:text-saffron text-left"
                  >
                    Events in {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Comedy & Entertainment */}
          <div>
            <p className="font-bold text-white text-sm tracking-wider uppercase">Comedy & Genres</p>
            <ul className="mt-3 space-y-1 text-xs text-forest-foreground/80">
              {["Surat", "Ahmedabad", "Mumbai", "Pune", "Delhi-NCR"].map((c) => (
                <li key={c}>
                  <Link to="/events" className="hover:text-saffron">
                    Comedy Shows in {c}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-forest-foreground/15">
                <Link to="/events" className="hover:text-saffron font-bold text-saffron">
                  Navratri 2026 Passes
                </Link>
              </li>
              <li>
                <a href="/#sports-pitch-section" className="hover:text-saffron">
                  Pickleball & Padel Courts
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-saffron text-emerald-400 font-semibold">
                  Gate Scanner / Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Category & Keyword Cloud */}
        <div className="mt-12 border-t border-forest-foreground/15 pt-6 text-[11px] text-forest-foreground/60 leading-relaxed">
          <p className="font-semibold text-forest-foreground/80 mb-1">
            Trending Searches in Surat:
          </p>
          <p>
            Suvarn Navratri - Premium Dome Dumas Road · Kesariya Navratri 4.0 Vesu · Yashvi Navratri
            3.0 With Purva Mantri Sarsana · Yashvi Navratri 3.0 - Falguni Pathak · The OG Navratri
            2026 – Surat VIP Road · Raas Utsav Flat 5% OFF Adajan · Mandli Garba 2026 Shyam Mandir
            Althan · Nav Avsar & Shubh Avsar Navratri 2026 Pal · Garvi Vaarso - Navratri 2026
            Katargam · Rajrang Navratri 2.0 Citylight · The Baseline Padel Surat · Pickle Fusion
            Gujarat · 97 Esports Zone Pal · Shubh Mandli Ahmedabad · Dwarkadhish Ni Ramzat
          </p>
        </div>

        {/* Bottom Legal */}
        <div className="mt-8 border-t border-forest-foreground/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-forest-foreground/60">
          <p>
            © 2026 FastTicket & AapnoPass. All Rights Reserved. Entertainment discovery and
            monetization platform.
          </p>

          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-saffron">
              Terms
            </Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-saffron">
              Privacy
            </Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-saffron">
              Admin Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function QR({ value, size = 96 }: { value: string; size?: number }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(value, { margin: 1, width: size * 2 }).then(setSrc);
  }, [value, size]);
  return src ? (
    <img
      src={src}
      width={size}
      height={size}
      alt="Pass QR code"
      className="rounded-md bg-card p-1"
    />
  ) : (
    <div style={{ width: size, height: size }} className="rounded-md bg-card" />
  );
}

export function PassCard({
  event,
  name,
  date,
  type,
  id,
}: {
  event: string;
  name: string;
  date: string;
  type: string;
  id: string;
}) {
  return (
    <div className="ticket-notch w-76 rounded-3xl bg-forest p-6 text-forest-foreground shadow-2xl border border-forest-foreground/20">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
        <span className="text-saffron font-bold">AapnoPass Verified</span>
        <span className="opacity-75 font-mono">{id}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold leading-tight text-white">{event}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="opacity-60 text-[10px] uppercase">Attendee</p>
          <p className="font-semibold text-white truncate">{name}</p>
        </div>
        <div>
          <p className="opacity-60 text-[10px] uppercase">Date</p>
          <p className="font-semibold text-white">{date}</p>
        </div>
        <div className="col-span-2">
          <p className="opacity-60 text-[10px] uppercase">Pass Category</p>
          <p className="font-bold text-saffron">{type}</p>
        </div>
      </div>
      <div className="my-4 border-t border-dashed border-forest-foreground/30" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-white">Gate Admission Pass</p>
          <p className="text-[10px] opacity-60">Scan at venue turnstile</p>
        </div>
        <div className="rounded-xl bg-white p-1.5 shadow">
          <QR value={`AAPNOPASS:${id}`} size={64} />
        </div>
      </div>
    </div>
  );
}
