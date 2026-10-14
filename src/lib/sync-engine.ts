import { supabase } from "@/integrations/supabase/client";
import { type EventItem, DEFAULT_EVENTS } from "./data";

export interface SyncLog {
  id: string;
  timestamp: string;
  source: string;
  status: "success" | "warning" | "error";
  eventsProcessed: number;
  newEventsAdded: number;
  eventsUpdated: number;
  duplicatesSkipped: number;
  soldOutDetected: number;
  errors: string[];
  details: {
    eventTitle: string;
    action: "added" | "updated" | "skipped_duplicate" | "manual_protect" | "sold_out";
    note?: string;
  }[];
}

export interface SyncSettings {
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  autoApproveNew: boolean;
  overwriteManualEdits: boolean;
  lastSyncedAt: string | null;
  syncSource: string;
}

const STORAGE_SYNC_SETTINGS = "aapnopass.sync_settings";
const STORAGE_SYNC_LOGS = "aapnopass.sync_logs";
const STORAGE_SYNCED_EVENTS = "aapnopass.synced_events";

// Authorized Mock Public Feed from FastTicket Surat Navratri API
export const FASTTICKET_MOCK_FEED: Partial<EventItem>[] = [
  {
    name: "Rangilo Raas Utsav 2026",
    venue: "Sarsana Dome Grounds",
    address: "Surat International Exhibition and Convention Centre (SIECC), Sarsana, Surat, Gujarat 395007",
    area: "Sarsana",
    dates: "3 – 11 Oct",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    time: "8:00 PM – 2:00 AM",
    artist: "Kinjal Dave & The Folk Beats",
    tag: "Most booked",
    eventType: "Traditional Garba",
    organizer: "Surat Cultural & Heritage Foundation",
    sourceUrl: "https://fastticket.in/events/surat/rangilo-raas-2026",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=SIECC+Sarsana+Surat",
    coverImage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
    about: "Surat's flagship mega open-air Navratri festival spanning a 45,000 sq ft wooden-sprung dancing arena. Featuring Kinjal Dave singing authentic Charan folk raas with a 24-piece traditional dhol-tasha troupe.",
    highlights: ["45,000 sq ft shock-absorbent wooden garba arena", "Live 24-piece Gujarati folk orchestra", "Special VIP revolving lounge & drone live screening", "Safe family & senior citizen seating pavilions"],
    facilities: ["Free Valet Parking (2,000 cars)", "Curated Traditional Food Street", "AC Green Rooms", "Paramedic Ambulance on standby", "CCTV & 200+ trained female security staff"],
    dressCode: "Mandatory Gujarati Traditional: Chaniya Choli with mirrorwork for women / Kedia or Kurta Pajama for men.",
    ageRestriction: "All age groups welcome. Children below 5 enter free with parents.",
    rules: ["QR pass scanned once per night", "No metallic dandiya sticks (wooden only)", "Outside food/drinks prohibited", "Re-entry not permitted without wristband scan"],
    terms: ["Tickets non-refundable once approved", "Subject to Surat Police event guidelines", "Management reserves right of admission"],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    passes: [
      { id: "single", name: "Single Day Pass", price: 599, desc: "Entry for any 1 night of your choice", left: 180, season: false },
      { id: "couple", name: "Couple Pass", price: 1099, desc: "Entry for 1 couple on any single night", left: 95, season: false },
      { id: "season", name: "All 9 Nights Season Pass", price: 4299, desc: "Access to all 9 nights for one dancer", left: 40, season: true },
      { id: "vip", name: "VIP Season Lounge Pass", price: 8499, desc: "Front row circle access, AC lounge & food voucher", left: 8, season: true, vip: true },
    ],
  },
  {
    name: "Vesu Garba Mahotsav",
    venue: "VR Mall Festive Grounds",
    address: "Dumas Road, near Magdalla, Vesu, Surat, Gujarat 395007",
    area: "Vesu",
    dates: "3 – 11 Oct",
    startTime: "08:30 PM",
    endTime: "02:30 AM",
    time: "8:30 PM – 2:30 AM",
    artist: "Aishwarya Majmudar",
    tag: "Premium",
    eventType: "Premium Garba",
    organizer: "Vesu Elite Cultural Forum",
    sourceUrl: "https://fastticket.in/events/surat/vesu-garba-mahotsav",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=VR+Mall+Surat",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
    about: "A premier boutique Navratri experience held right in the heart of Vesu. World-class acoustics, high-density German hanger tenting, and mesmerising live performances by Gujarat's vocal sensation Aishwarya Majmudar.",
    highlights: ["State of the art JBL line-array sound system", "Air-conditioned royal dining enclosure", "Live multicam broadcast on giant 4K LED walls", "Celebrity judge rounds for Best Chaniya Choli & Best Steps"],
    facilities: ["VR Mall Basement Reserved Parking", "Gourmet Live Food Counters", "AC Restrooms", "Free High-speed Wi-Fi", "Locker facility for valuables"],
    dressCode: "Festive Glamour / Premium Traditional attire strictly enforced at turnstiles.",
    ageRestriction: "Family event. All age groups.",
    rules: ["Govt ID required for pass pickup if requested", "Alcohol and tobacco strictly prohibited", "Dandiya sticks available at stall inside"],
    terms: ["Pass valid only for selected night / season", "Event timings subject to local administration limits"],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    passes: [
      { id: "single", name: "Single Night Pass", price: 799, desc: "Single entry for chosen date", left: 140, season: false },
      { id: "couple", name: "Couple Pass", price: 1499, desc: "Couple entry for chosen date", left: 70, season: false },
      { id: "season", name: "Full Season Pass", price: 5699, desc: "9 nights unlimited garba rounds", left: 25, season: true },
      { id: "vip", name: "Royal VIP Season", price: 11999, desc: "Lounge seating, reserved parking & hospitality", left: 5, season: true, vip: true },
    ],
  },
  {
    name: "Tapi Riverfront Dandiya Dhoom",
    venue: "Riverfront Promenade Grounds",
    address: "Near Swami Vivekananda Bridge, Adajan, Surat, Gujarat 395009",
    area: "Adajan",
    dates: "3 – 11 Oct",
    startTime: "07:30 PM",
    endTime: "01:30 AM",
    time: "7:30 PM – 1:30 AM",
    artist: "Geeta Rabari & Folk Legends",
    tag: "Riverside",
    eventType: "Dandiya",
    organizer: "Tapi Riverfront Heritage Society",
    sourceUrl: "https://fastticket.in/events/surat/tapi-riverfront-dandiya",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Tapi+Riverfront+Adajan+Surat",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=80",
    about: "Celebrate Navratri by the breeze of river Tapi. Adajan's most beloved community dandiya with authentic Gujarati instruments like pawa, jhanjh, and daklu alongside Geeta Rabari's powerhouse vocals.",
    highlights: ["Scenic riverfront open dancing lawn", "Authentic Kathiyawadi & Surati folk raas", "Nightly grand maha aarti with 108 diyas", "Daily cash prizes for Best Kedia & Best Raas Mandli"],
    facilities: ["Free Riverfront Parking", "Surati Locho & Farsan Food Plaza", "Drinking Water Dispensers", "Lost & Found Booth"],
    dressCode: "Ethnic wear / Traditional Garba attire.",
    ageRestriction: "All ages permitted. Free entry for senior citizens (above 65) with ID.",
    rules: ["Dandiya provided at entry", "Entry closes at 10:30 PM", "Follow queue discipline"],
    terms: ["Wristband required for re-entry on the same night"],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: true,
    isTrending: false,
    isPopular: true,
    passes: [
      { id: "single", name: "Single Night Pass", price: 449, desc: "One night admission", left: 220, season: false },
      { id: "couple", name: "Couple Pass", price: 820, desc: "One night admission for two", left: 110, season: false },
      { id: "season", name: "Full 9 Nights Pass", price: 3199, desc: "All nine nights riverfront dandiya", left: 55, season: true },
      { id: "vip", name: "Riverside VIP Deck", price: 6499, desc: "Elevated deck overlooking dance floor", left: 12, season: true, vip: true },
    ],
  },
  {
    name: "SVNIT Beats: Techno Folk Garba",
    venue: "SVNIT Sports Complex Lawns",
    address: "Ichchhanath Circle, Piplod Main Road, Piplod, Surat, Gujarat 395007",
    area: "Piplod",
    dates: "4 – 11 Oct",
    startTime: "09:00 PM",
    endTime: "03:00 AM",
    time: "9:00 PM – 3:00 AM",
    artist: "Osman Mir & DJ Nucleon",
    tag: "Techno Garba",
    eventType: "Techno Garba",
    organizer: "Surat Youth Cultural Club",
    sourceUrl: "https://fastticket.in/events/surat/svnit-techno-garba-2026",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=SVNIT+Surat",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    about: "The ultimate youth sensation! Fusing thumping electronic sub-bass, synths, and laser light shows with timeless Gujarati folk compositions by Osman Mir. High-energy non-stop Dodhiya rounds for college youth and young professionals.",
    highlights: ["Laser mapping & 3D holographic festival stage", "Silent Garba headphone zone post-midnight", "Live Dhol vs DJ beat drops", "Electrifying 12-step Dodhiya competitions"],
    facilities: ["Multi-level Campus Parking", "Midnight Street Food Court", "Phone Charging Stations", "Energy Drink & Mocktail Bars"],
    dressCode: "Fusion Indo-Western / Neon Traditional wear encouraged.",
    ageRestriction: "16 years and above only.",
    rules: ["Valid Student or Govt ID required", "Intoxicated persons barred", "Wristbands non-transferable"],
    terms: ["Management holds no liability for lost belongings in crowd"],
    nights: ["4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    passes: [
      { id: "single", name: "Youth Night Pass", price: 499, desc: "Single night access for 1 person", left: 110, season: false },
      { id: "couple", name: "Couple Pass", price: 899, desc: "Single night access for 2", left: 60, season: false },
      { id: "season", name: "Youth Season Pass", price: 3499, desc: "Access to all 8 nights", left: 30, season: true },
      { id: "vip", name: "VIP Backstage Pass", price: 6999, desc: "Direct stage-side deck & artist meet-greet", left: 6, season: true, vip: true },
    ],
  },
  {
    name: "Althan Royal Raas Utsav",
    venue: "Shyam Mandir Festival Grounds",
    address: "Opp. Althan Community Hall, VIP Road, Althan, Surat, Gujarat 395017",
    area: "Althan",
    dates: "3 – 11 Oct",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    time: "8:00 PM – 2:00 AM",
    artist: "Kirtidan Gadhvi",
    tag: "Celebrity Raas",
    eventType: "Celebrity Events",
    organizer: "Shyam Utsav Committee",
    sourceUrl: "https://fastticket.in/events/surat/althan-royal-raas",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Althan+Surat",
    coverImage: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop&q=80",
    about: "Experience spiritual bliss and thunderous dayro-garba as Dandiya King Kirtidan Gadhvi leads 10,000 devotees in historic folk rounds under palace-themed illumination.",
    highlights: ["Palace façade set design with 50,000 fairy lights", "Special Dayro session every midnight", "Grand golden chariot darshan of Maa Ambe", "Dedicated photography booths for families"],
    facilities: ["Free 4-Wheeler Parking", "Traditional Kathiyawadi Prasadam Stalls", "Medical Aid Clinic", "Separate Senior Citizen Deck"],
    dressCode: "Traditional Chaniya Choli or Kurta Pajama.",
    ageRestriction: "All ages. Family-centric atmosphere.",
    rules: ["Traditional dress compulsory inside arena", "Please maintain sanctity near temple zone"],
    terms: ["Event will adhere to public noise guidelines"],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    passes: [
      { id: "single", name: "General Pass", price: 549, desc: "Entry for any single evening", left: 160, season: false },
      { id: "couple", name: "Couple Entry", price: 999, desc: "Two tickets for one evening", left: 80, season: false },
      { id: "season", name: "Full 9-Day Pass", price: 3899, desc: "Complete Navratri access", left: 45, season: true },
      { id: "vip", name: "Royal VIP Deck", price: 7999, desc: "Sofa seating with complimentary dinner buffet", left: 10, season: true, vip: true },
    ],
  },
  {
    name: "Dumas Beachfront Dandiya Carnival",
    venue: "Ocean Breeze Lawns, Dumas Road",
    address: "Near Sultanabad, Dumas Road, Surat, Gujarat 395007",
    area: "Dumas Road",
    dates: "5 – 11 Oct",
    startTime: "08:30 PM",
    endTime: "02:30 AM",
    time: "8:30 PM – 2:30 AM",
    artist: "Parthiv Gohil & Symphony Troupe",
    tag: "Live Music",
    eventType: "Live Music",
    organizer: "Coastal Celebrations Pvt Ltd",
    sourceUrl: "https://fastticket.in/events/surat/dumas-beach-garba-2026",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Dumas+Beach+Surat",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    about: "Feel the sea breeze under the stars while dancing to Bollywood-Gujarati playback sensation Parthiv Gohil accompanied by an acoustic symphony band.",
    highlights: ["Lush 3-acre natural turf lawn near the Arabian Sea", "Bollywood & classic Gujarati film songs Raas fusion", "Gourmet coastal seafood & vegetarian food pavilion", "Artisan dandiya craft workshop corner"],
    facilities: ["Designated Valet Parking", "Cocktail & Mocktail Cabanas", "Clean Luxury Washroom Trailers", "Baggage Counter"],
    dressCode: "Festive Glamour / Authentic Traditional.",
    ageRestriction: "All ages permitted.",
    rules: ["Beach access closed after 9 PM for security", "Only registered passes accepted"],
    terms: ["Event is held under permitted festival license"],
    nights: ["5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: false,
    isTrending: true,
    isPopular: false,
    passes: [
      { id: "single", name: "Single Night Entry", price: 699, desc: "One evening pass", left: 90, season: false },
      { id: "couple", name: "Couple Pass", price: 1299, desc: "Entry for two", left: 45, season: false },
      { id: "season", name: "7-Night Carnival Pass", price: 4499, desc: "Access to all 7 beachside nights", left: 20, season: true },
      { id: "vip", name: "Cabana VIP Table", price: 9999, desc: "Private cabana for 4 with personal steward", left: 4, season: true, vip: true },
    ],
  },
  {
    name: "Pal Celebrity Navratri Mahotsav",
    venue: "Sanjeev Kumar Auditorium Complex Grounds",
    address: "Pal-Hazira Road, near Pal RTO, Pal, Surat, Gujarat 395009",
    area: "Pal",
    dates: "3 – 11 Oct",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    time: "8:00 PM – 2:00 AM",
    artist: "Bhoomi Trivedi",
    tag: "High Energy",
    eventType: "Celebrity Events",
    organizer: "Pal Youth League & Rotary Club",
    sourceUrl: "https://fastticket.in/events/surat/pal-celebrity-garba",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Sanjeev+Kumar+Auditorium+Surat",
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
    about: "Bollywood powerhouse Bhoomi Trivedi brings 'Ram Chahe Leela' energy to Pal! Non-stop 3-taali, hinch, and sanedo rounds with Surat's most stylish youth crowd.",
    highlights: ["Bollywood celebrity guest appearances nightly", "Massive LED chandelier over central mataji mandir", "Professional slow-motion 360 photo booth", "Over ₹10 Lakh in seasonal competition prizes"],
    facilities: ["Surat Municipal Parking Facility", "Street Food Court", "Emergency Medical Care", "Air-cooled Rest Tents"],
    dressCode: "Full Gujarati Garba attire mandatory.",
    ageRestriction: "All age groups.",
    rules: ["No re-entry allowed", "Entry gates close strictly at 10:30 PM"],
    terms: ["Pass purchase is subject to organiser verification"],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    passes: [
      { id: "single", name: "Standard Entry", price: 649, desc: "Single day entry", left: 130, season: false },
      { id: "couple", name: "Couple Entry", price: 1199, desc: "Couple admission for 1 night", left: 65, season: false },
      { id: "season", name: "Full 9-Night Pass", price: 4699, desc: "Every night entry badge", left: 28, season: true },
      { id: "vip", name: "Celebrity Enclosure", price: 8999, desc: "Front circle reserved pass + selfie zone access", left: 7, season: true, vip: true },
    ],
  },
  {
    name: "Citylight Heritage Family Dandiya",
    venue: "Surat Indoor Stadium Festival Arena",
    address: "Athwa Gate, Citylight Main Road, Surat, Gujarat 395007",
    area: "Citylight",
    dates: "3 – 11 Oct",
    startTime: "07:30 PM",
    endTime: "01:30 AM",
    time: "7:30 PM – 1:30 AM",
    artist: "Hemant Chauhan & Folk Troupe",
    tag: "Family Special",
    eventType: "Family Events",
    organizer: "Citylight Mahajan Parishad",
    sourceUrl: "https://fastticket.in/events/surat/citylight-family-dandiya",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Indoor+Stadium+Surat",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
    about: "Surat's premier fully indoor air-conditioned Navratri celebration designed specially for families, toddlers, and senior citizens. Pure acoustic folk, zero chaos, and unmatched heritage decor.",
    highlights: ["100% Central Air-Conditioned Comfort", "Child-safe foam-padded play area for toddlers", "Dedicated seating tier for grandparents", "Pure Satvik food counters by legendary Surati caterers"],
    facilities: ["Stadium Basement Covered Parking", "Wheelchair Accessible Ramps & Elevators", "Baby Care / Nursing Room", "Strict Security Screening"],
    dressCode: "Graceful Traditional Indian attire.",
    ageRestriction: "All ages. Specially recommended for families with kids and seniors.",
    rules: ["Quiet zones maintained in upper tiers", "No loud whistles or noise toys"],
    terms: ["Group booking discounts available for 10+ passes"],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: false,
    isTrending: false,
    isPopular: true,
    passes: [
      { id: "single", name: "Adult Single Night", price: 499, desc: "Entry for 1 adult", left: 190, season: false },
      { id: "family", name: "Family Pack (4 Pax)", price: 1799, desc: "Entry for 2 adults + 2 children", left: 60, season: false },
      { id: "season", name: "Season Family Pass", price: 6999, desc: "All 9 nights for family of 4", left: 22, season: true },
      { id: "vip", name: "VIP Box Sofa", price: 11999, desc: "Private stadium box seating with dinner", left: 5, season: true, vip: true },
    ],
  },
  {
    name: "Diamond City Raas Mahotsav",
    venue: "Gopinathji Party Plot",
    address: "Opp. Diamond Bourse Road, Katargam, Surat, Gujarat 395004",
    area: "Katargam",
    dates: "3 – 11 Oct",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    time: "8:00 PM – 2:00 AM",
    artist: "Atul Purohit",
    tag: "Classic Folk",
    eventType: "Traditional Garba",
    organizer: "Katargam Diamond Association",
    sourceUrl: "https://fastticket.in/events/surat/diamond-city-garba-katargam",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Katargam+Surat",
    coverImage: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
    about: "The soul of Saurashtra in Surat. Padma Shri nominee Atul Purohit leads mesmerising Tara Vina Shyam and Prathama Shri Ganesh chants with pure traditional 2-clap and 3-clap Garbi.",
    highlights: ["Over 8,000 dancers in synchronised traditional circular raas", "100% Traditional Charan & Saurashtra sahitya", "Spectacular floral decoration changed daily", "Famous Surati Ghari distribution on Sharad Purnima"],
    facilities: ["Spacious 5-acre Plot Parking", "Farsan & Tea Stalls", "First Aid Desk", "Clean Washrooms"],
    dressCode: "Traditional Gujarati / Kathiyawadi attire.",
    ageRestriction: "All ages welcome.",
    rules: ["Shoes must be deposited at counter", "Maintain sanctity during Aarti"],
    terms: ["Pass valid for one person per entry"],
    nights: ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
    isFeatured: true,
    isTrending: false,
    isPopular: true,
    passes: [
      { id: "single", name: "Single Night", price: 399, desc: "Single night entry", left: 240, season: false },
      { id: "couple", name: "Couple Pass", price: 749, desc: "Entry for two", left: 120, season: false },
      { id: "season", name: "9-Night Season Pass", price: 2899, desc: "Full Navratri access", left: 65, season: true },
      { id: "vip", name: "VIP Stage Circle", price: 5999, desc: "Front stage enclosure & hospitality", left: 14, season: true, vip: true },
    ],
  },
];

// Helper to normalize strings for duplicate detection
function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Check for duplicate between an incoming event and existing events
export function isDuplicateEvent(incoming: Partial<EventItem>, existing: EventItem[]): EventItem | null {
  const normName = normalizeString(incoming.name || "");
  const normVenue = normalizeString(incoming.venue || "");
  const normArea = normalizeString(incoming.area || "");

  for (const item of existing) {
    const itemNormName = normalizeString(item.name);
    const itemNormVenue = normalizeString(item.venue);
    const itemNormArea = normalizeString(item.area);

    // Exact name match or close substring match with same venue/area
    if (
      (itemNormName === normName ||
        itemNormName.includes(normName) ||
        normName.includes(itemNormName)) &&
      (itemNormVenue === normVenue || itemNormArea === normArea)
    ) {
      return item;
    }
  }
  return null;
}

export function getSyncSettings(): SyncSettings {
  if (typeof window === "undefined") {
    return {
      autoSyncEnabled: true,
      syncIntervalMinutes: 30,
      autoApproveNew: true,
      overwriteManualEdits: false,
      lastSyncedAt: new Date().toISOString(),
      syncSource: "FastTicket Surat Navratri API",
    };
  }
  try {
    const saved = localStorage.getItem(STORAGE_SYNC_SETTINGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return {
    autoSyncEnabled: true,
    syncIntervalMinutes: 30,
    autoApproveNew: true,
    overwriteManualEdits: false,
    lastSyncedAt: null,
    syncSource: "FastTicket Surat Navratri API",
  };
}

export function saveSyncSettings(s: SyncSettings) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_SYNC_SETTINGS, JSON.stringify(s));
  }
}

export function getSyncLogs(): SyncLog[] {
  if (typeof window === "undefined") return [];
  try {
    const logs = localStorage.getItem(STORAGE_SYNC_LOGS);
    return logs ? JSON.parse(logs) : [];
  } catch (e) {
    return [];
  }
}

export function saveSyncLog(log: SyncLog) {
  if (typeof window === "undefined") return;
  try {
    const logs = getSyncLogs();
    const updated = [log, ...logs.slice(0, 19)]; // Keep last 20 logs
    localStorage.setItem(STORAGE_SYNC_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

// Master sync function: fetches from feed, diffs with database/local, updates or adds
export async function runEventSync(
  existingEvents: EventItem[],
  customFeed?: Partial<EventItem>[]
): Promise<{
  success: boolean;
  syncedEvents: EventItem[];
  log: SyncLog;
}> {
  const settings = getSyncSettings();
  const feed = customFeed || FASTTICKET_MOCK_FEED;
  const now = new Date().toISOString();

  const log: SyncLog = {
    id: "SYNC-" + Date.now().toString(36).toUpperCase(),
    timestamp: now,
    source: settings.syncSource,
    status: "success",
    eventsProcessed: feed.length,
    newEventsAdded: 0,
    eventsUpdated: 0,
    duplicatesSkipped: 0,
    soldOutDetected: 0,
    errors: [],
    details: [],
  };

  const updatedEventsList: EventItem[] = [...existingEvents];

  for (const feedItem of feed) {
    try {
      const match = isDuplicateEvent(feedItem, updatedEventsList);

      if (match) {
        // Check if event was manually customized and protected
        if (match.manuallyEdited && !settings.overwriteManualEdits) {
          log.duplicatesSkipped++;
          log.details.push({
            eventTitle: match.name,
            action: "manual_protect",
            note: "Skipped update because event has manual edits and overwrite is disabled.",
          });
          continue;
        }

        // Compare values to see what changed
        const priceChanged =
          feedItem.passes &&
          JSON.stringify(feedItem.passes.map((p) => p.price)) !==
            JSON.stringify(match.passes.map((p) => p.price));
        const datesChanged = feedItem.dates && feedItem.dates !== match.dates;
        const timeChanged = feedItem.time && feedItem.time !== match.time;
        const availabilityChanged =
          feedItem.passes &&
          feedItem.passes.some((p, i) => p.left !== match.passes[i]?.left);

        const isSoldOut = feedItem.passes?.every((p) => p.left <= 0);
        if (isSoldOut) log.soldOutDetected++;

        // Update existing record
        const index = updatedEventsList.findIndex((x) => x.id === match.id);
        if (index !== -1) {
          const updatedEvent: EventItem = {
            ...match,
            ...feedItem,
            id: match.id, // keep stable ID
            manuallyEdited: match.manuallyEdited || false,
            lastSyncedAt: now,
            isSoldOut: isSoldOut || false,
            passes: feedItem.passes || match.passes,
            sort: match.sort,
            active: match.active,
          } as EventItem;

          updatedEventsList[index] = updatedEvent;
          log.eventsUpdated++;
          log.details.push({
            eventTitle: match.name,
            action: "updated",
            note: [
              priceChanged ? "Prices updated" : null,
              datesChanged ? "Dates updated" : null,
              timeChanged ? "Timings updated" : null,
              availabilityChanged ? "Availability refreshed" : null,
              isSoldOut ? "Marked as sold out" : null,
            ]
              .filter(Boolean)
              .join(", ") || "Synchronized metadata with feed",
          });
        }
      } else {
        // Brand new event from feed!
        const generatedId =
          (feedItem.name || "event")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") +
          "-" +
          Math.floor(Math.random() * 900 + 100);

        const newEvent: EventItem = {
          id: generatedId,
          name: feedItem.name || "Untitled Navratri Event",
          venue: feedItem.venue || "Venue, Surat",
          address: feedItem.address || "Surat, Gujarat",
          area: feedItem.area || "Vesu",
          dates: feedItem.dates || "3 – 11 Oct 2026",
          time: feedItem.time || "8:00 PM onwards",
          startTime: feedItem.startTime || "08:00 PM",
          endTime: feedItem.endTime || "02:00 AM",
          artist: feedItem.artist || "Live Gujarati Orchestra",
          artists: feedItem.artists || [{ name: feedItem.artist || "Folk Artist", role: "Lead Vocalist" }],
          tag: feedItem.tag || "New",
          eventType: feedItem.eventType || "Traditional Garba",
          about: feedItem.about || "Exciting Navratri celebration in Surat.",
          highlights: feedItem.highlights || ["Traditional Garba rounds", "Live music", "Food court"],
          facilities: feedItem.facilities || ["Parking", "Drinking Water", "First Aid", "Security"],
          dressCode: feedItem.dressCode || "Traditional Garba Attire mandatory.",
          ageRestriction: feedItem.ageRestriction || "All age groups welcome.",
          rules: feedItem.rules || ["No re-entry without wristband", "Valid QR pass required"],
          terms: feedItem.terms || ["Tickets are non-refundable"],
          organizer: feedItem.organizer || "Surat Festival Organizers",
          sourceUrl: feedItem.sourceUrl || "https://fastticket.in/events/surat",
          sourceName: feedItem.sourceName || "FastTicket Authorized Feed",
          mapUrl: feedItem.mapUrl || "https://maps.google.com/?q=Surat",
          coverImage: feedItem.coverImage || "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
          galleryImages: feedItem.galleryImages || [
            feedItem.coverImage || "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=80",
          ],
          nights: feedItem.nights || ["3 Oct 2026", "4 Oct 2026", "5 Oct 2026", "6 Oct 2026", "7 Oct 2026", "8 Oct 2026", "9 Oct 2026", "10 Oct 2026", "11 Oct 2026"],
          passes: feedItem.passes || [
            { id: "single", name: "Single Night Pass", price: 499, desc: "Entry for one", left: 100, season: false },
          ],
          active: true,
          sort: updatedEventsList.length + 1,
          isFeatured: feedItem.isFeatured || false,
          isTrending: feedItem.isTrending || false,
          isPopular: feedItem.isPopular || false,
          isSoldOut: false,
          syncStatus: settings.autoApproveNew ? "approved" : "pending_review",
          manuallyEdited: false,
          lastSyncedAt: now,
          created_at: now,
        };

        updatedEventsList.push(newEvent);
        log.newEventsAdded++;
        log.details.push({
          eventTitle: newEvent.name,
          action: "added",
          note: `New event imported from ${settings.syncSource} (${newEvent.syncStatus})`,
        });
      }
    } catch (err: any) {
      log.errors.push(`Error processing ${feedItem.name}: ${err?.message || String(err)}`);
    }
  }

  // Update sync settings state
  settings.lastSyncedAt = now;
  saveSyncSettings(settings);
  saveSyncLog(log);

  // Save to local storage cache so client stays instant
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_SYNCED_EVENTS, JSON.stringify(updatedEventsList));
  }

  return {
    success: log.errors.length === 0,
    syncedEvents: updatedEventsList,
    log,
  };
}
