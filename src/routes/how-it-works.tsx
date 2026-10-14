import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery, type Settings } from "@/lib/data";
import {
  Search,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  head: () => ({
    meta: [
      { title: "How It Works — AapnoPass Surat Navratri" },
      { name: "description", content: "Learn how to find Surat Garba events, book passes via UPI, and enter with digital QR passes." },
      { property: "og:title", content: "How It Works — AapnoPass" },
      { property: "og:description", content: "Find. Book. Celebrate." },
    ],
  }),
  component: How,
});

const FAQS = [
  {
    q: "How do I receive my pass after booking?",
    a: "Immediately after entering your 12-digit UPI reference (UTR) number, your digital pass is generated. You can view your dynamic QR code on screen and download a PDF pass to save on your phone.",
  },
  {
    q: "Can I enter the venue by showing the pass on my phone?",
    a: "Yes! AapnoPass QR codes are designed for high-speed scanning at turnstiles directly from mobile screens. Physical printouts are not required.",
  },
  {
    q: "What if my UPI payment succeeds but I forgot my UTR?",
    a: "Open your UPI app (Google Pay, PhonePe, or Paytm), go to Transaction History, tap the transaction, and copy the 12-digit number labeled 'UPI Transaction ID' or 'Ref No'. You can enter it on the 'My Pass' page to claim your booking.",
  },
  {
    q: "Are the passes verified with the event organizers?",
    a: "Yes, AapnoPass is integrated with official organizer registries, including FastTicket partner feeds in Surat. Every ticket is registered directly on the venue turnstile system.",
  },
];

function How() {
  const loaderData = Route.useLoaderData();
  const { data: s = loaderData } = useQuery({
    ...settingsQuery,
    initialData: loaderData as Settings,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <section className="border-b bg-forest py-16 text-forest-foreground text-center">
        <div className="mx-auto max-w-4xl px-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest-foreground/10 px-3.5 py-1 text-xs font-semibold text-saffron">
            <Sparkles className="h-3.5 w-3.5" /> Surat's Digital Pass Guide
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold">How AapnoPass Works</h1>
          <p className="mt-3 text-sm md:text-base opacity-80 max-w-xl mx-auto">
            Experience seamless Navratri admissions across Surat. Say goodbye to black-market pass queues.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        {/* Step-by-Step Flow */}
        <div className="grid gap-8">
          {s.steps.map((st, i) => {
            const [t, d] = st.split("|");
            const icons = [Search, CreditCard, QrCode];
            const StepIcon = icons[i] || ShieldCheck;
            return (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start gap-6 rounded-3xl border bg-card p-8 shadow-sm transition hover:shadow-md"
              >
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-forest text-saffron shrink-0 font-display text-2xl font-bold">
                  <StepIcon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-primary">STEP 0{i + 1}</span>
                    <h3 className="font-display text-2xl font-bold">{t}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="mt-20">
          <h2 className="font-display text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border bg-card p-6">
                <h4 className="font-bold text-sm text-foreground flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-secondary/70 p-8 text-center border">
          <h3 className="font-display text-2xl font-bold">Ready to book your pass?</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Explore 9+ nights of celebrations across Vesu, Adajan, Piplod, and Sarsana.
          </p>
          <Link
            to="/events"
            className="mt-5 inline-block rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow hover:opacity-90"
          >
            Explore All Surat Events →
          </Link>
        </div>
      </section>
    </div>
  );
}
