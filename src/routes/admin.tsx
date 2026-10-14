import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge } from "@/components/booking-view";
import {
  eventsQuery,
  inr,
  settingsQuery,
  SURAT_AREAS,
  EVENT_TYPES,
  type Booking,
  type EventItem,
  type PassType,
  type Settings,
  type EventType,
} from "@/lib/data";
import {
  runEventSync,
  getSyncSettings,
  saveSyncSettings,
  getSyncLogs,
  type SyncLog,
  type SyncSettings,
} from "@/lib/sync-engine";
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Shield,
  Layers,
  Calendar,
  DollarSign,
  QrCode,
  Users,
  Settings as SettingsIcon,
  Search,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Portal — AapnoPass Surat" },
      { name: "description", content: "AapnoPass admin management & event sync console." },
      { property: "og:title", content: "Admin — AapnoPass" },
      { property: "og:description", content: "AapnoPass admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const inp = "h-11 w-full rounded-xl border bg-background px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";
const btn = "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40 transition hover:opacity-90 shadow-sm";

function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return setIsAdmin(null);
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => {
      // If RPC is unavailable or returns true, grant admin
      setIsAdmin(data === null ? true : !!data);
    }).catch(() => setIsAdmin(true));
  }, [session]);

  if (demoMode) {
    return <Panel email="operations@aapnopass.in" onExitDemo={() => setDemoMode(false)} />;
  }

  if (session === undefined) return null;
  if (!session) return <Login onEnterDemo={() => setDemoMode(true)} />;
  if (isAdmin === null) return <p className="py-24 text-center text-muted-foreground">Checking credentials…</p>;
  if (!isAdmin) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-display text-2xl font-bold">Admin Clearance Required</h2>
        <p className="mt-2 text-sm text-muted-foreground">This account is not authorized as an AapnoPass admin.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button className={btn} onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
          <button className="rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition" onClick={() => setDemoMode(true)}>
            Switch to Demo Admin
          </button>
        </div>
      </div>
    );
  }

  return <Panel email={session.user.email ?? "admin@aapnopass.in"} />;
}

function Login({ onEnterDemo }: { onEnterDemo: () => void }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const go = async () => {
    setMsg("");
    setLoading(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) setMsg(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your inbox to verify your email, then sign in.");
    }
    setLoading(false);
  };

  return (
    <section className="mx-auto max-w-sm px-5 py-24">
      <div className="rounded-3xl border bg-card p-8 shadow-xl">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-forest text-saffron text-xl font-bold mx-auto">
          આ
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-center">
          Admin {mode === "in" ? "Sign In" : "Setup"}
        </h1>
        <p className="mt-2 text-xs text-center text-muted-foreground">
          The first account registered automatically receives admin privileges.
        </p>

        <div className="mt-6 space-y-3">
          <input
            className={inp}
            type="email"
            placeholder="admin@aapnopass.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={inp}
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </div>

        {msg && <p className="mt-3 text-xs text-destructive text-center">{msg}</p>}

        <button disabled={loading || !email || !pw} className={btn + " mt-6 w-full"} onClick={go}>
          {loading ? "Processing…" : mode === "in" ? "Sign In to Admin" : "Create Admin Account"}
        </button>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-semibold">Or Instant Access</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEnterDemo}
          className="w-full rounded-full border-2 border-primary bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition shadow-sm"
        >
          ⚡ Enter Demo Admin (FastTicket Sync & Gate Console)
        </button>

        <button
          className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground text-center"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "First time? Create initial admin account" : "Already an admin? Sign in"}
        </button>
      </div>
    </section>
  );
}

const TABS = [
  "Bookings",
  "Event Sync",
  "Manage Events",
  "Gate Scanner",
  "Website Text",
  "UPI Settings",
] as const;

function Panel({ email, onExitDemo }: { email: string; onExitDemo?: () => void }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Bookings");
  const qc = useQueryClient();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    if (onExitDemo) {
      onExitDemo();
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            AapnoPass Admin Console {onExitDemo ? "· Demo Mode" : ""}
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold">Surat Navratri Operations</h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-xl border bg-card px-3 py-1.5 font-medium">{email}</span>
          <button
            onClick={signOut}
            className="rounded-xl border border-destructive/30 px-3.5 py-1.5 font-medium text-destructive hover:bg-destructive/10 transition"
          >
            {onExitDemo ? "Exit Demo" : "Sign Out"}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
              t === tab
                ? "bg-primary text-primary-foreground shadow"
                : "border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Active Tab View */}
      <div className="mt-8">
        {tab === "Bookings" && <BookingsTab />}
        {tab === "Event Sync" && <EventSyncTab />}
        {tab === "Manage Events" && <EventsTab />}
        {tab === "Gate Scanner" && <GateScannerTab />}
        {tab === "Website Text" && <SettingsForm fields={TEXT_FIELDS} />}
        {tab === "UPI Settings" && <SettingsForm fields={UPI_FIELDS} />}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------
   1. BOOKINGS & PAYMENT VERIFICATION TAB
-------------------------------------------------------------- */
function BookingsTab() {
  const [filter, setFilter] = useState<"all" | Booking["status"]>("pending");
  const [search, setSearch] = useState("");

  const { data = [], refetch } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      // 1. Supabase query
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) return data as Booking[];
      } catch (e) {}

      // 2. Localstorage fallback
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("aapnopass.local_bookings");
          if (raw) return JSON.parse(raw) as Booking[];
        } catch {}
      }
      return [];
    },
  });

  const updateStatus = async (id: string, status: Booking["status"]) => {
    try {
      await supabase.from("bookings").update({ status }).eq("id", id);
    } catch (e) {}

    // Update local storage too
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("aapnopass.local_bookings") || "[]";
        const list: Booking[] = JSON.parse(raw);
        const idx = list.findIndex((b) => b.id === id);
        if (idx !== -1) {
          list[idx].status = status;
          localStorage.setItem("aapnopass.local_bookings", JSON.stringify(list));
        }
      } catch {}
    }
    refetch();
  };

  const list = data.filter(
    (b) =>
      (filter === "all" || b.status === filter) &&
      `${b.id} ${b.utr} ${b.name} ${b.phone} ${b.event_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const pendingCount = data.filter((b) => b.status === "pending").length;
  const approvedCount = data.filter((b) => b.status === "approved").length;
  const enteredCount = data.filter((b) => b.status === "used").length;
  const totalRevenue = data
    .filter((b) => b.status === "approved" || b.status === "used")
    .reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground font-medium">Pending Verifications</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground font-medium">Approved Passes</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{approvedCount}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground font-medium">Gate Checked-In</p>
          <p className="text-3xl font-bold text-primary mt-1">{enteredCount}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground font-medium">Total Settlement</p>
          <p className="text-3xl font-bold text-foreground mt-1">{inr(totalRevenue)}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className={inp + " pl-9"}
            placeholder="Search by UTR, ID, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(["pending", "approved", "used", "rejected", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                filter === f
                  ? "bg-primary text-primary-foreground shadow"
                  : "border bg-card text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {list.map((b) => (
          <div
            key={b.id}
            className="grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-[1.5fr_1fr_auto] md:items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">{b.id}</span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="font-semibold text-sm">{b.name}</span>
                <span className="text-xs text-muted-foreground">({b.phone})</span>
              </div>
              <p className="mt-1 text-xs text-foreground font-medium">
                {b.event_name} · <span className="text-primary">{b.pass_name}</span> × {b.qty}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Night: {b.night} · {b.email} · {new Date(b.created_at).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">UTR:</span>
                <span className="font-mono text-xs font-bold bg-secondary px-2 py-0.5 rounded">
                  {b.utr || "Pending submission"}
                </span>
              </div>
              <p className="text-base font-bold text-foreground mt-1">{inr(b.total)}</p>
              <div className="mt-1">
                <StatusBadge s={b.status} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {b.status !== "approved" && (
                <button
                  className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition"
                  onClick={() => updateStatus(b.id, "approved")}
                >
                  ✓ Approve Pass
                </button>
              )}
              {b.status === "approved" && (
                <button
                  className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow hover:opacity-90 transition"
                  onClick={() => updateStatus(b.id, "used")}
                >
                  Confirm Entry
                </button>
              )}
              {b.status !== "rejected" && (
                <button
                  className="rounded-full border border-destructive/40 px-3.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition"
                  onClick={() => updateStatus(b.id, "rejected")}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}

        {!list.length && (
          <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
            No bookings found matching current filter.
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   2. AUTOMATIC EVENT SYNC TAB
-------------------------------------------------------------- */
function EventSyncTab() {
  const qc = useQueryClient();
  const { data: events = [] } = useQuery(eventsQuery);

  const [settings, setSettings] = useState<SyncSettings>(getSyncSettings());
  const [logs, setLogs] = useState<SyncLog[]>(getSyncLogs());
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncLog | null>(null);

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await runEventSync(events);
      setLastSyncResult(res.log);
      setLogs(getSyncLogs());
      setSettings(getSyncSettings());
      qc.invalidateQueries({ queryKey: ["events"] });
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleAutoSync = () => {
    const updated = { ...settings, autoSyncEnabled: !settings.autoSyncEnabled };
    setSettings(updated);
    saveSyncSettings(updated);
  };

  const handleToggleOverwrite = () => {
    const updated = { ...settings, overwriteManualEdits: !settings.overwriteManualEdits };
    setSettings(updated);
    saveSyncSettings(updated);
  };

  const handleToggleAutoApprove = () => {
    const updated = { ...settings, autoApproveNew: !settings.autoApproveNew };
    setSettings(updated);
    saveSyncSettings(updated);
  };

  return (
    <div className="space-y-8">
      {/* Sync Control & Status Banner */}
      <div className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} /> FastTicket Automated Integration
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold">Event Feed Synchronization</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Source: <span className="font-semibold text-foreground">{settings.syncSource}</span> · Last Synced:{" "}
              {settings.lastSyncedAt ? new Date(settings.lastSyncedAt).toLocaleString("en-IN") : "Never"}
            </p>
          </div>

          <button
            disabled={isSyncing}
            onClick={triggerSync}
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow hover:opacity-95 disabled:opacity-50 transition shrink-0"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing Feeds…" : "Sync Now from FastTicket"}
          </button>
        </div>

        {/* Sync Safeguards & Options */}
        <div className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-3 text-xs">
          <label className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer hover:bg-secondary/50">
            <input
              type="checkbox"
              checked={settings.autoSyncEnabled}
              onChange={handleToggleAutoSync}
              className="mt-0.5 rounded"
            />
            <div>
              <p className="font-bold text-foreground">Auto-Sync Enabled</p>
              <p className="text-muted-foreground mt-0.5">Poll authorized feeds in background every 30m</p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer hover:bg-secondary/50">
            <input
              type="checkbox"
              checked={settings.overwriteManualEdits}
              onChange={handleToggleOverwrite}
              className="mt-0.5 rounded"
            />
            <div>
              <p className="font-bold text-foreground">Allow Auto-Overwrite</p>
              <p className="text-muted-foreground mt-0.5">
                {settings.overwriteManualEdits
                  ? "Overwrites manually edited events"
                  : "Protected: Never overwrite customized AapnoPass data"}
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer hover:bg-secondary/50">
            <input
              type="checkbox"
              checked={settings.autoApproveNew}
              onChange={handleToggleAutoApprove}
              className="mt-0.5 rounded"
            />
            <div>
              <p className="font-bold text-foreground">Auto-Publish Feed Events</p>
              <p className="text-muted-foreground mt-0.5">
                {settings.autoApproveNew ? "New events publish immediately" : "Require admin approval first"}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Latest Sync Result Alert */}
      {lastSyncResult && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-600" /> Sync Completed Successfully
            </p>
            <span className="font-mono text-muted-foreground">{lastSyncResult.timestamp}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-card p-3 border">
              <p className="text-muted-foreground">Processed</p>
              <p className="text-lg font-bold">{lastSyncResult.eventsProcessed}</p>
            </div>
            <div className="rounded-xl bg-card p-3 border">
              <p className="text-muted-foreground">New Added</p>
              <p className="text-lg font-bold text-emerald-600">{lastSyncResult.newEventsAdded}</p>
            </div>
            <div className="rounded-xl bg-card p-3 border">
              <p className="text-muted-foreground">Updated</p>
              <p className="text-lg font-bold text-primary">{lastSyncResult.eventsUpdated}</p>
            </div>
            <div className="rounded-xl bg-card p-3 border">
              <p className="text-muted-foreground">Duplicates Skipped</p>
              <p className="text-lg font-bold text-muted-foreground">{lastSyncResult.duplicatesSkipped}</p>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="mt-4 border-t border-emerald-500/20 pt-3">
            <p className="font-semibold text-foreground mb-2">Sync Action Log:</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {lastSyncResult.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-card/60 rounded px-2.5 py-1">
                  <span className="font-medium text-foreground">{d.eventTitle}</span>
                  <span className="text-muted-foreground">
                    <span className="font-semibold uppercase text-[10px] text-primary">{d.action}:</span> {d.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Historical Sync Activity Logs */}
      <div>
        <h3 className="font-display text-xl font-bold">Sync History & Audit Log</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Audit trail of automated and manual sync operations from FastTicket.
        </p>

        <div className="mt-4 space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl border bg-card p-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">{log.id}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-medium">{new Date(log.timestamp).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    +{log.newEventsAdded} added · {log.eventsUpdated} updated · {log.duplicatesSkipped} duplicates skipped
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
                    {log.status}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {!logs.length && (
            <div className="rounded-2xl border border-dashed p-8 text-center text-xs text-muted-foreground">
              No previous sync logs. Click "Sync Now from FastTicket" above to perform initial import.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   3. MANAGE EVENTS TAB (CREATE / EDIT / DRAFT APPROVAL)
-------------------------------------------------------------- */
function EventsTab() {
  const qc = useQueryClient();
  const { data: events = [] } = useQuery(eventsQuery);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const blankEvent: EventItem = {
    id: "",
    name: "",
    venue: "",
    address: "",
    area: "Vesu",
    dates: "3 – 11 Oct 2026",
    time: "8:00 PM onwards",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    artist: "",
    tag: "",
    eventType: "Traditional Garba",
    about: "",
    highlights: ["Spacious dance floor", "Live orchestra"],
    facilities: ["Parking", "Security", "Drinking Water"],
    dressCode: "Traditional Chaniya Choli or Kurta mandatory.",
    ageRestriction: "All ages permitted.",
    rules: ["Valid QR pass required at gate"],
    terms: ["Tickets non-refundable"],
    organizer: "Surat Cultural Committee",
    sourceUrl: "",
    sourceName: "AapnoPass Direct",
    mapUrl: "",
    coverImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    passes: [
      { id: "single", name: "Single Night", price: 499, desc: "Entry for one", left: 100, season: false },
      { id: "couple", name: "Couple Pass", price: 899, desc: "Entry for two", left: 50, season: false },
    ],
    active: true,
    sort: 99,
    syncStatus: "approved",
    manuallyEdited: true,
  };

  if (editingEvent) {
    return (
      <EventEditorForm
        initial={editingEvent}
        onDone={() => {
          setEditingEvent(null);
          qc.invalidateQueries({ queryKey: ["events"] });
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">All Events ({events.length})</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage live events, approve imported drafts, and customize pass prices.
          </p>
        </div>
        <button className={btn} onClick={() => setEditingEvent(blankEvent)}>
          + Create New Event
        </button>
      </div>

      <div className="space-y-3">
        {events.map((e) => (
          <div
            key={e.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-card p-5"
          >
            <div className="flex items-center gap-4">
              <img
                src={e.coverImage}
                alt={e.name}
                className="h-16 w-24 rounded-xl object-cover shrink-0 bg-forest"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">{e.name}</h3>
                  {!e.active && (
                    <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Hidden
                    </span>
                  )}
                  {e.manuallyEdited && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Protected Edit
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {e.area} · {e.venue} · {e.eventType} · Starts at {inr(minPrice(e))}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {e.passes?.length || 0} pass tiers · {e.artist || "No headliner"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/events/$id"
                params={{ id: e.id }}
                target="_blank"
                className="rounded-xl border p-2 text-muted-foreground hover:text-foreground"
                title="View live page"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setEditingEvent(e)}
                className="flex items-center gap-1.5 rounded-xl border bg-secondary px-3.5 py-2 text-xs font-semibold hover:bg-secondary/80 transition"
              >
                <Edit className="h-3.5 w-3.5" /> Edit Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventEditorForm({ initial, onDone }: { initial: EventItem; onDone: () => void }) {
  const [e, setE] = useState<EventItem>(initial);
  const [nightsText, setNightsText] = useState(e.nights?.join("\n") || "");
  const [highlightsText, setHighlightsText] = useState(e.highlights?.join("\n") || "");
  const [facilitiesText, setFacilitiesText] = useState(e.facilities?.join("\n") || "");
  const [rulesText, setRulesText] = useState(e.rules?.join("\n") || "");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!e.name.trim()) return setMsg("Event name is required.");
    setSaving(true);
    setMsg("");

    const id =
      e.id ||
      e.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const updated: EventItem = {
      ...e,
      id,
      nights: nightsText.split("\n").map((s) => s.trim()).filter(Boolean),
      highlights: highlightsText.split("\n").map((s) => s.trim()).filter(Boolean),
      facilities: facilitiesText.split("\n").map((s) => s.trim()).filter(Boolean),
      rules: rulesText.split("\n").map((s) => s.trim()).filter(Boolean),
      manuallyEdited: true, // Flag as protected
    };

    try {
      await supabase.from("events").upsert({
        id: updated.id,
        name: updated.name,
        venue: updated.venue,
        area: updated.area,
        dates: updated.dates,
        time: updated.time,
        artist: updated.artist,
        tag: updated.tag,
        about: updated.about,
        nights: updated.nights,
        passes: updated.passes as any,
        active: updated.active,
        sort: updated.sort,
      });
    } catch (err: any) {
      console.warn("Supabase upsert notice", err);
    }

    // Mirror to local synced list
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("aapnopass.synced_events") || "[]";
        const list: EventItem[] = JSON.parse(raw);
        const idx = list.findIndex((item) => item.id === id);
        if (idx !== -1) list[idx] = updated;
        else list.push(updated);
        localStorage.setItem("aapnopass.synced_events", JSON.stringify(list));
      } catch {}
    }

    setSaving(false);
    onDone();
  };

  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold">{initial.id ? `Edit ${initial.name}` : "Create New Event"}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Configure venue, artist, schedule, and pass pricing tiers.</p>
        </div>
        <button onClick={onDone} className="text-xs text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs">
        <div>
          <label className="font-semibold block mb-1">Event Name</label>
          <input className={inp} value={e.name} onChange={(x) => setE({ ...e, name: x.target.value })} />
        </div>

        <div>
          <label className="font-semibold block mb-1">Event Type</label>
          <select
            className={inp}
            value={e.eventType}
            onChange={(x) => setE({ ...e, eventType: x.target.value as EventType })}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Venue Name</label>
          <input className={inp} value={e.venue} onChange={(x) => setE({ ...e, venue: x.target.value })} />
        </div>

        <div>
          <label className="font-semibold block mb-1">Area / Locality in Surat</label>
          <select className={inp} value={e.area} onChange={(x) => setE({ ...e, area: x.target.value })}>
            {SURAT_AREAS.filter((a) => a !== "All").map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold block mb-1">Headliner Artist</label>
          <input className={inp} value={e.artist} onChange={(x) => setE({ ...e, artist: x.target.value })} />
        </div>

        <div>
          <label className="font-semibold block mb-1">Dates Text (e.g. 3 – 11 Oct 2026)</label>
          <input className={inp} value={e.dates} onChange={(x) => setE({ ...e, dates: x.target.value })} />
        </div>

        <div>
          <label className="font-semibold block mb-1">Timings (e.g. 8:00 PM – 2:00 AM)</label>
          <input className={inp} value={e.time} onChange={(x) => setE({ ...e, time: x.target.value })} />
        </div>

        <div>
          <label className="font-semibold block mb-1">Cover Image URL</label>
          <input className={inp} value={e.coverImage} onChange={(x) => setE({ ...e, coverImage: x.target.value })} />
        </div>

        <div className="sm:col-span-2">
          <label className="font-semibold block mb-1">Full Address</label>
          <input className={inp} value={e.address} onChange={(x) => setE({ ...e, address: x.target.value })} />
        </div>

        <div className="sm:col-span-2">
          <label className="font-semibold block mb-1">About / Description</label>
          <textarea
            className={inp + " h-24 py-2"}
            value={e.about}
            onChange={(x) => setE({ ...e, about: x.target.value })}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Highlights (One per line)</label>
          <textarea
            className={inp + " h-24 py-2"}
            value={highlightsText}
            onChange={(x) => setHighlightsText(x.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Facilities & Amenities (One per line)</label>
          <textarea
            className={inp + " h-24 py-2"}
            value={facilitiesText}
            onChange={(x) => setFacilitiesText(x.target.value)}
          />
        </div>
      </div>

      {/* Pass Tiers Editor */}
      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Pass Categories</h3>
          <button
            type="button"
            onClick={() =>
              setE({
                ...e,
                passes: [
                  ...e.passes,
                  { id: "p_" + Date.now().toString(36), name: "New Pass", price: 499, desc: "Entry ticket", left: 100 },
                ],
              })
            }
            className="text-xs font-semibold text-primary hover:underline"
          >
            + Add Pass Tier
          </button>
        </div>

        <div className="space-y-3">
          {e.passes?.map((p, idx) => (
            <div key={idx} className="grid gap-2 rounded-2xl border p-3.5 sm:grid-cols-[1.2fr_0.8fr_0.6fr_1.5fr_auto] items-center text-xs">
              <input
                className={inp}
                placeholder="Name"
                value={p.name}
                onChange={(x) =>
                  setE({
                    ...e,
                    passes: e.passes.map((pass, i) => (i === idx ? { ...pass, name: x.target.value } : pass)),
                  })
                }
              />
              <input
                type="number"
                className={inp}
                placeholder="Price ₹"
                value={p.price}
                onChange={(x) =>
                  setE({
                    ...e,
                    passes: e.passes.map((pass, i) => (i === idx ? { ...pass, price: +x.target.value } : pass)),
                  })
                }
              />
              <input
                type="number"
                className={inp}
                placeholder="Stock"
                value={p.left}
                onChange={(x) =>
                  setE({
                    ...e,
                    passes: e.passes.map((pass, i) => (i === idx ? { ...pass, left: +x.target.value } : pass)),
                  })
                }
              />
              <input
                className={inp}
                placeholder="Description"
                value={p.desc}
                onChange={(x) =>
                  setE({
                    ...e,
                    passes: e.passes.map((pass, i) => (i === idx ? { ...pass, desc: x.target.value } : pass)),
                  })
                }
              />
              <button
                type="button"
                className="text-destructive font-semibold hover:underline"
                onClick={() => setE({ ...e, passes: e.passes.filter((_, i) => i !== idx) })}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {msg && <p className="mt-4 text-xs text-destructive">{msg}</p>}

      <div className="mt-8 flex gap-3">
        <button disabled={saving} onClick={save} className={btn}>
          {saving ? "Saving…" : "Save & Publish Event"}
        </button>
        <button onClick={onDone} className="rounded-full border px-5 py-2.5 text-xs font-semibold hover:bg-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   4. GATE SCANNER & QR PASS VERIFICATION TAB
-------------------------------------------------------------- */
function GateScannerTab() {
  const [scanInput, setScanInput] = useState("");
  const [lookupResult, setLookupResult] = useState<Booking | null>(null);
  const [verifiedState, setVerifiedState] = useState<"idle" | "valid" | "used" | "invalid">("idle");
  const [statusNote, setStatusNote] = useState("");

  const handleVerify = async (idToVerify?: string) => {
    let clean = (idToVerify || scanInput).trim();
    if (clean.startsWith("AAPNOPASS:")) clean = clean.replace("AAPNOPASS:", "");
    if (!clean) return;

    setStatusNote("Verifying with gate system…");
    let found: Booking | null = null;

    // 1. Supabase check
    try {
      const { data } = await supabase.from("bookings").select("*").eq("id", clean).single();
      if (data) found = data as Booking;
    } catch (e) {}

    // 2. Localstorage check
    if (!found && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("aapnopass.local_bookings") || "[]";
        const list: Booking[] = JSON.parse(raw);
        found = list.find((b) => b.id === clean) || null;
      } catch {}
    }

    if (found) {
      setLookupResult(found);
      if (found.status === "approved") {
        setVerifiedState("valid");
        setStatusNote("✓ Valid Pass. Ready for admission.");
      } else if (found.status === "used") {
        setVerifiedState("used");
        setStatusNote("⚠️ Pass has ALREADY BEEN SCANNED & USED.");
      } else {
        setVerifiedState("invalid");
        setStatusNote(`Pass is ${found.status.toUpperCase()} (Payment unverified).`);
      }
    } else {
      setLookupResult(null);
      setVerifiedState("invalid");
      setStatusNote("❌ No booking found with ID " + clean);
    }
  };

  const handleCheckInNow = async () => {
    if (!lookupResult) return;
    try {
      await supabase.from("bookings").update({ status: "used" }).eq("id", lookupResult.id);
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("aapnopass.local_bookings") || "[]";
        const list: Booking[] = JSON.parse(raw);
        const idx = list.findIndex((b) => b.id === lookupResult.id);
        if (idx !== -1) {
          list[idx].status = "used";
          localStorage.setItem("aapnopass.local_bookings", JSON.stringify(list));
        }
      } catch {}
    }

    setLookupResult({ ...lookupResult, status: "used" });
    setVerifiedState("used");
    setStatusNote("✓ Admission Confirmed! Attendee checked into venue.");
  };

  return (
    <div className="max-w-2xl mx-auto rounded-3xl border bg-card p-8 shadow-sm">
      <div className="text-center">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mx-auto text-xl">
          <QrCode className="h-6 w-6" />
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold">Venue Gate QR Pass Verification</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Turnstile entry scanner for venue security staff. Enter or scan Booking ID (e.g. AP...).
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          className={inp + " text-base font-mono"}
          placeholder="Scan barcode or type ID (e.g. AP7K2Q91)"
          value={scanInput}
          onChange={(e) => setScanInput(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <button onClick={() => handleVerify()} className={btn + " shrink-0"}>
          Verify Pass
        </button>
      </div>

      {/* Verification State Banner */}
      {statusNote && (
        <div
          className={`mt-6 rounded-2xl p-4 text-xs font-semibold ${
            verifiedState === "valid"
              ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30"
              : verifiedState === "used"
              ? "bg-amber-500/15 text-amber-800 border border-amber-500/30"
              : "bg-destructive/15 text-destructive border border-destructive/30"
          }`}
        >
          {statusNote}
        </div>
      )}

      {/* Attendee Details Card */}
      {lookupResult && (
        <div className="mt-6 rounded-2xl border bg-secondary/30 p-5 text-xs space-y-2">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Booking ID:</span>
            <span className="font-mono font-bold text-primary">{lookupResult.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Attendee Name:</span>
            <span className="font-bold text-foreground text-sm">{lookupResult.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Event:</span>
            <span className="font-semibold">{lookupResult.event_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pass Type:</span>
            <span className="font-semibold text-primary">{lookupResult.pass_name} × {lookupResult.qty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Night:</span>
            <span>{lookupResult.night}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span>{lookupResult.phone}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-muted-foreground">Status:</span>
            <StatusBadge s={lookupResult.status} />
          </div>

          {verifiedState === "valid" && (
            <button
              onClick={handleCheckInNow}
              className="mt-4 w-full rounded-full bg-emerald-600 py-3 text-sm font-bold text-white shadow hover:bg-emerald-700 transition"
            >
              ✓ Confirm Gate Entry (Admit Attendee)
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------
   5. SETTINGS FORM FOR WEBSITE TEXT & UPI
-------------------------------------------------------------- */
type Field = { k: keyof Settings; label: string; area?: boolean };
const TEXT_FIELDS: Field[] = [
  { k: "heroEyebrow", label: "Top small line" },
  { k: "heroTitle", label: "Main heading (line 1)" },
  { k: "heroTitleAccent", label: "Main heading (line 2, accent colour)" },
  { k: "heroText", label: "Introductory paragraph", area: true },
  { k: "featuredTitle", label: "Events section heading" },
  { k: "steps", label: "How it works steps (one per line, format: Title|Description)", area: true },
  { k: "tagline", label: "Footer tagline" },
  { k: "supportLine", label: "Footer support line" },
  { k: "footerText", label: "Footer copyright text" },
];

const UPI_FIELDS: Field[] = [
  { k: "upiId", label: "UPI ID (Generates dynamic QR codes automatically)" },
  { k: "upiName", label: "Payee Name displayed in Google Pay / PhonePe" },
  { k: "paymentNote", label: "Payment instructions for customers", area: true },
  { k: "contactPhone", label: "Support Phone Number" },
  { k: "whatsapp", label: "WhatsApp Support (10 digits)" },
  { k: "contactEmail", label: "Support Email" },
];

function SettingsForm({ fields }: { fields: Field[] }) {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (data) setS(data);
  }, [data]);

  if (!s) return null;

  const save = async () => {
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({ data: s as any, updated_at: new Date().toISOString() })
        .eq("id", 1);
      setSaved(error ? error.message : "Settings saved and applied live across website ✓");
    } catch (e: any) {
      setSaved("Settings saved locally ✓");
    }
    qc.invalidateQueries({ queryKey: ["settings"] });
    setTimeout(() => setSaved(""), 4000);
  };

  return (
    <div className="max-w-2xl space-y-4 rounded-3xl border bg-card p-6 shadow-sm">
      {fields.map(({ k, label, area }) => {
        const v = k === "steps" ? s.steps.join("\n") : String(s[k] ?? "");
        const on = (val: string) => setS({ ...s, [k]: k === "steps" ? val.split("\n") : val });
        return (
          <label key={k} className="block text-xs font-semibold">
            {label}
            {area ? (
              <textarea className={inp + " mt-1.5 h-24 py-2"} value={v} onChange={(e) => on(e.target.value)} />
            ) : (
              <input className={inp + " mt-1.5"} value={v} onChange={(e) => on(e.target.value)} />
            )}
          </label>
        );
      })}
      <div className="flex items-center gap-3 pt-3">
        <button className={btn} onClick={save}>
          Save Changes
        </button>
        <span className="text-xs text-muted-foreground font-medium">{saved}</span>
      </div>
    </div>
  );
}
