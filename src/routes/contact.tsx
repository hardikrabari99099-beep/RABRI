import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery, type Settings } from "@/lib/data";
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  head: () => ({
    meta: [
      { title: "Contact & Event Listing Desk — AapnoPass Surat" },
      { name: "description", content: "Get in touch with the AapnoPass team for booking support or listing your Surat Navratri event." },
      { property: "og:title", content: "Contact AapnoPass — Surat Navratri" },
      { property: "og:description", content: "24/7 Navratri booking help and organizer desk." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const loaderData = Route.useLoaderData();
  const { data: s = loaderData } = useQuery({
    ...settingsQuery,
    initialData: loaderData as Settings,
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "booking_help", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactCards = [
    { label: "Phone Helpline", value: s.contactPhone, href: `tel:${s.contactPhone.replace(/\s/g, "")}`, icon: Phone },
    { label: "WhatsApp Desk", value: "Instant WhatsApp Chat", href: `https://wa.me/${s.whatsapp}`, icon: MessageCircle },
    { label: "Support Email", value: s.contactEmail, href: `mailto:${s.contactEmail}`, icon: Mail },
    { label: "Surat Office", value: s.contactAddress, href: undefined, icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <section className="border-b bg-forest py-16 text-forest-foreground text-center">
        <div className="mx-auto max-w-4xl px-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-foreground/10 px-3 py-1 text-xs font-semibold text-saffron">
            <ShieldCheck className="h-3.5 w-3.5" /> 24/7 Festival Support Desk
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold">Contact AapnoPass</h1>
          <p className="mt-2 text-sm md:text-base opacity-80 max-w-lg mx-auto">
            {s.contactText}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        {/* Contact info grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {contactCards.map((c, i) => {
            const Icon = c.icon;
            const Comp = c.href ? "a" : "div";
            return (
              <Comp
                key={i}
                href={c.href}
                className="flex items-center gap-4 rounded-2xl border bg-card p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-0.5 font-bold text-foreground text-sm">{c.value}</p>
                </div>
              </Comp>
            );
          })}
        </div>

        {/* Message / Listing Inquiry Form */}
        <div className="mt-12 rounded-3xl border bg-card p-8 shadow-sm">
          <h2 className="font-display text-2xl font-bold">Send us a Message or List Your Event</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Are you an event organizer in Surat? Inquire here to integrate your festival with FastTicket & AapnoPass.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center text-xs">
              <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
              <h3 className="mt-2 font-bold text-base text-foreground">Message Received!</h3>
              <p className="mt-1 text-muted-foreground max-w-md mx-auto">
                Thank you, {form.name}. Our festival coordinator in Surat will call or WhatsApp you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold block mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Hardik Patel"
                    className="h-11 w-full rounded-xl border bg-background px-3.5 text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Contact Phone</label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="h-11 w-full rounded-xl border bg-background px-3.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold block mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@email.com"
                    className="h-11 w-full rounded-xl border bg-background px-3.5 text-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Topic / Inquiry Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="h-11 w-full rounded-xl border bg-background px-3.5 text-sm"
                  >
                    <option value="booking_help">Booking / UTR Verification Help</option>
                    <option value="list_event">List New Surat Navratri Event</option>
                    <option value="corporate">Corporate / Group Pass Booking</option>
                    <option value="general">General Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Message Details</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share your booking ID or event details..."
                  className="w-full rounded-xl border bg-background p-3.5 text-sm"
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-primary px-7 py-3 font-bold text-primary-foreground shadow hover:opacity-90 transition text-sm flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
