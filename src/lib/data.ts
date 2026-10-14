import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FASTTICKET_SURAT_EVENTS,
  FASTTICKET_ARTISTS,
  FASTTICKET_ORGANIZERS,
  FASTTICKET_TOP_CITIES,
  FASTTICKET_SPORTS,
  type FastTicketArtist,
  type FastTicketOrganizer,
} from "./fastticket-catalog";

export {
  FASTTICKET_SURAT_EVENTS,
  FASTTICKET_ARTISTS,
  FASTTICKET_ORGANIZERS,
  FASTTICKET_TOP_CITIES,
  FASTTICKET_SPORTS,
  type FastTicketArtist,
  type FastTicketOrganizer,
};

export const INDIAN_CITIES = [
  "Surat",
  "Ahmedabad",
  "Mumbai",
  "Pune",
  "Delhi-NCR",
  "Bengaluru",
  "Hyderabad",
  "Vadodara",
  "Jaipur",
  "Rajkot",
  "Gandhinagar",
  "Indore",
  "Daman",
  "Kolkata",
  "Chennai",
  "Kochi",
] as const;

export type IndianCity = (typeof INDIAN_CITIES)[number];

export const CATEGORIES = [
  { id: "all", label: "All Categories", icon: "✨" },
  { id: "navratri", label: "Navratri 2026", icon: "💃" },
  { id: "sports", label: "Sports & Turfs", icon: "🏏" },
  { id: "concerts", label: "Live Concerts", icon: "🎤" },
  { id: "comedy", label: "Stand-up Comedy", icon: "😂" },
  { id: "parties", label: "DJ Parties & Nightlife", icon: "🎧" },
  { id: "kids", label: "Kids & Family", icon: "🎡" },
  { id: "workshops", label: "Workshops & Masterclasses", icon: "🎨" },
  { id: "spirituality", label: "Spirituality & Bhajan", icon: "🪔" },
  { id: "business", label: "Business & Expos", icon: "💼" },
] as const;

export type EventCategory = (typeof CATEGORIES)[number]["id"];

export type EventType =
  | "Traditional Garba"
  | "Premium Garba"
  | "Techno Garba"
  | "Dandiya"
  | "Live Music"
  | "Family Events"
  | "Celebrity Events"
  | "Other Navratri Events";

export type PassType = {
  id: string;
  name: string;
  price: number;
  desc: string;
  left: number;
  season?: boolean;
  vip?: boolean;
};

export type EventItem = {
  id: string;
  slug?: string;
  name: string;
  city: string;
  category: string;
  venue: string;
  address: string;
  area: string;
  dates: string;
  time: string;
  startTime: string;
  endTime: string;
  artist: string;
  artists?: { name: string; role?: string; image?: string }[];
  tag: string;
  eventType: EventType;
  about: string;
  highlights: string[];
  facilities: string[];
  dressCode: string;
  ageRestriction: string;
  rules: string[];
  terms: string[];
  organizer: string;
  sourceUrl?: string;
  sourceName?: string;
  mapUrl?: string;
  coverImage: string;
  galleryImages?: string[];
  nights: string[];
  passes: PassType[];
  active: boolean;
  sort: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isPopular?: boolean;
  isPromoted?: boolean;
  offerBadge?: string;
  isPreNavratri?: boolean;
  isSoldOut?: boolean;
  rating?: number;
  syncStatus?: "approved" | "pending_review" | "draft";
  manuallyEdited?: boolean;
  lastSyncedAt?: string;
  created_at?: string;
};

export type SportActivity = {
  id: string;
  name: string;
  sportType: string;
  venue: string;
  area: string;
  city: string;
  pricePerHour: number;
  duration: string;
  rating: number;
  image: string;
  tag?: string;
  slots: string[];
  amenities: string[];
  address: string;
  about: string;
};

export type Coupon = {
  code: string;
  discountType: "percentage" | "flat";
  value: number;
  maxDiscount?: number;
  minOrder: number;
  desc: string;
};

export type Settings = {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroText: string;
  featuredTitle: string;
  tagline: string;
  supportLine: string;
  steps: string[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsapp: string;
  contactText: string;
  upiId: string;
  upiName: string;
  paymentNote: string;
  footerText: string;
};

export type Booking = {
  id: string;
  event_id: string;
  event_name: string;
  pass_id: string;
  pass_name: string;
  qty: number;
  name: string;
  phone: string;
  email: string;
  night: string;
  total: number;
  coupon_code?: string | null;
  discount_amount?: number;
  convenience_fee?: number;
  utr: string | null;
  status: "pending" | "approved" | "rejected" | "used";
  created_at: string;
};

export const SURAT_AREAS = [
  "All",
  "Vesu",
  "Adajan",
  "Piplod",
  "Althan",
  "Dumas Road",
  "Pal",
  "Citylight",
  "Katargam",
  "Sarsana",
] as const;

export const EVENT_TYPES: EventType[] = [
  "Traditional Garba",
  "Premium Garba",
  "Techno Garba",
  "Dandiya",
  "Live Music",
  "Family Events",
  "Celebrity Events",
  "Other Navratri Events",
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: "SURAT15",
    discountType: "percentage",
    value: 15,
    maxDiscount: 500,
    minOrder: 800,
    desc: "15% off up to ₹500 on passes",
  },
  {
    code: "NAVRATRI100",
    discountType: "flat",
    value: 100,
    minOrder: 500,
    desc: "Flat ₹100 off on any pass",
  },
  {
    code: "EARLYBIRD",
    discountType: "percentage",
    value: 10,
    maxDiscount: 300,
    minOrder: 400,
    desc: "Early Bird 10% off",
  },
];

export const SPORTS_ACTIVITIES: SportActivity[] = [
  ...FASTTICKET_SPORTS,
  {
    id: "pickle-fusion-dumas",
    name: "Pickle Fusion Arena",
    sportType: "Pickleball",
    venue: "Dumas Sports Hub",
    area: "Dumas Road",
    city: "Surat",
    pricePerHour: 400,
    duration: "1 Hour",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&auto=format&fit=crop&q=80",
    tag: "Trending Sport",
    slots: [
      "06:00 AM - 07:00 AM",
      "07:00 AM - 08:00 AM",
      "05:00 PM - 06:00 PM",
      "06:00 PM - 07:00 PM",
      "07:00 PM - 08:00 PM",
      "08:00 PM - 09:00 PM",
      "09:00 PM - 10:00 PM",
    ],
    amenities: [
      "Official USAPA Court",
      "Paddle & Balls Included",
      "LED Floodlights",
      "Chilled Mineral Water",
      "Air-conditioned Dugout",
    ],
    address: "Near Sultanabad Gate, Dumas Road, Surat, Gujarat 395007",
    about:
      "Surat's premier dedicated 6-court pickleball club. High-traction cushioned acrylic surfaces with pro-grade Selkirk paddles provided for free.",
  },
  {
    id: "baseline-padel-vesu",
    name: "The Baseline Padel Club",
    sportType: "Padel",
    venue: "Vesu Sports Complex",
    area: "Vesu",
    city: "Surat",
    pricePerHour: 800,
    duration: "1 Hour",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80",
    tag: "Premium",
    slots: [
      "06:00 AM - 07:00 AM",
      "07:00 AM - 08:00 AM",
      "06:00 PM - 07:00 PM",
      "07:00 PM - 08:00 PM",
      "08:00 PM - 09:00 PM",
      "09:00 PM - 10:00 PM",
    ],
    amenities: [
      "Panoramic Glass Walls",
      "Imported Monofilament Turf",
      "Locker & Shower",
      "Cafe & Energy Bar",
      "Rackets Rental",
    ],
    address: "VIP Road, Near Shantiniketan School, Vesu, Surat, Gujarat 395007",
    about:
      "World-class panoramic glass padel courts built to International Padel Federation standards. Great for doubles games and group workouts.",
  },
  {
    id: "97-esports-piplod",
    name: "97 Esports & Gaming Lounge",
    sportType: "PlayStation & Sim",
    venue: "Piplod High Street Mall",
    area: "Piplod",
    city: "Surat",
    pricePerHour: 250,
    duration: "1 Hour",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
    tag: "Popular",
    slots: [
      "11:00 AM - 12:00 PM",
      "02:00 PM - 03:00 PM",
      "04:00 PM - 05:00 PM",
      "06:00 PM - 07:00 PM",
      "08:00 PM - 09:00 PM",
      "10:00 PM - 11:00 PM",
    ],
    amenities: [
      "PlayStation 5 Consoles",
      "Fanatec F1 Sim Rig",
      "4K 120Hz Displays",
      "DualSense Wireless",
      "High-speed Fiber LAN",
    ],
    address: "2nd Floor, High Street Mall, Piplod Main Road, Surat 395007",
    about:
      "Surat's highest-spec competitive console & simulation hub. Featuring PS5 lounges for FIFA/FC25, Mortal Kombat, and full force-feedback racing simulators.",
  },
  {
    id: "surat-box-cricket-adajan",
    name: "Surat Super Box Cricket Turf",
    sportType: "Box Cricket",
    venue: "Tapi Riverview Arena",
    area: "Adajan",
    city: "Surat",
    pricePerHour: 600,
    duration: "1 Hour",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
    tag: "Most Booked",
    slots: [
      "06:00 AM - 07:00 AM",
      "07:00 AM - 08:00 AM",
      "06:00 PM - 07:00 PM",
      "08:00 PM - 09:00 PM",
      "09:00 PM - 10:00 PM",
      "10:00 PM - 11:00 PM",
      "11:00 PM - 12:00 AM",
    ],
    amenities: [
      "55mm FIFA-Grade Turf",
      "Heavy-Duty Safety Netting",
      "Night Match Floodlights",
      "SS/Kookaburra Bats Included",
      "Pavilion Seating",
    ],
    address: "Opp. Adajan Fire Station, Riverfront Road, Adajan, Surat 395009",
    about:
      "Spacious 120ft x 60ft covered cricket turf with seamless top nets. Ideal for 7v7 and 8v8 gully-cricket battles under dazzling night lighting.",
  },
  {
    id: "snooker-championship-citylight",
    name: "Cue Masters Snooker & Pool",
    sportType: "Snooker",
    venue: "Citylight Indoor Club",
    area: "Citylight",
    city: "Surat",
    pricePerHour: 200,
    duration: "1 Hour",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=800&auto=format&fit=crop&q=80",
    tag: "Classic",
    slots: [
      "11:00 AM - 12:00 PM",
      "02:00 PM - 03:00 PM",
      "04:00 PM - 05:00 PM",
      "06:00 PM - 07:00 PM",
      "08:00 PM - 09:00 PM",
      "10:00 PM - 11:00 PM",
    ],
    amenities: [
      "Wiraka English Slate Tables",
      "Aramith Tournament Balls",
      "Ash Wood Cues",
      "Air Conditioned",
      "Snack Bar",
    ],
    address: "Near Science Centre, Citylight Main Road, Surat 395007",
    about:
      "Full-size English billiard and snooker tables with tournament green cloth and premium cue rentals.",
  },
  {
    id: "althan-cricket-net-practice",
    name: "Althan Pro Net Practice Turf",
    sportType: "Net Practice",
    venue: "Althan Sports Park",
    area: "Althan",
    city: "Surat",
    pricePerHour: 500,
    duration: "1 Hour",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
    tag: "Athlete Choice",
    slots: [
      "06:00 AM - 07:00 AM",
      "07:00 AM - 08:00 AM",
      "04:00 PM - 05:00 PM",
      "05:00 PM - 06:00 PM",
      "06:00 PM - 07:00 PM",
      "07:00 PM - 08:00 PM",
    ],
    amenities: [
      "Automatic Bowling Machine",
      "Dual Astro-Turf Pitches",
      "Leather Ball Permitted",
      "Coaching Aids Available",
    ],
    address: "VIP Road, Opp. Shyam Mandir, Althan, Surat 395017",
    about:
      "Equipped with Lever RoboArm and automated bowling machines capable of 70 to 140 km/h seam and spin simulations.",
  },
];

const LEGACY_EVENTS: EventItem[] = [
  {
    id: "suvarn-navratri-dome",
    name: "Suvarn Navratri – Premium Dome",
    city: "Surat",
    category: "navratri",
    venue: "Suvarn Central Dome Arena",
    address: "Dumas Road, Opp. International Airport, Surat, Gujarat 395007",
    area: "Dumas Road",
    dates: "3 – 11 Oct 2026",
    time: "8:30 PM – 2:30 AM",
    startTime: "08:30 PM",
    endTime: "02:30 AM",
    artist: "Aishwarya Majmudar & The Royal Symphony",
    artists: [
      {
        name: "Aishwarya Majmudar",
        role: "Queen of Garba",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
      },
      { name: "Symphony Raas Band", role: "24-piece Traditional Orchestra" },
    ],
    tag: "High Demand",
    eventType: "Premium Garba",
    about:
      "Surat's most luxurious fully air-conditioned geodesic dome Navratri. Experience uninterrupted royal garba rounds with German engineered acoustic insulation, VIP revolving cabanas, and unmatched festive elegance.",
    highlights: [
      "Fully Central Air-Conditioned Geodesic Dome",
      "50,000 sq ft Shock-Absorbent Wooden Dance Deck",
      "Royal VIP Hospitality with multi-course Surati banquet",
      "Celebrity Fashion Judges with Daily Diamond Ring Awards",
    ],
    facilities: [
      "Complimentary Valet Parking (3,000 cars)",
      "Air-conditioned Luxury Restrooms",
      "Gourmet Food Village with Live Surati Locho & Farsan",
      "VIP Private Lounge & Fast-Track Gate Access",
      "24/7 Paramedic Center & Ambulance",
    ],
    dressCode: "Traditional Glamour Mandatory: Mirrorwork Chaniya Choli or Kedia/Kurta Pajama.",
    ageRestriction: "All age groups welcome. Children below 5 free.",
    rules: [
      "Digital pass QR verified at speed turnstiles",
      "Wooden dandiya only (complimentary at entrance)",
      "Strict zero-tolerance on intoxication",
    ],
    terms: ["Pass non-transferable once issued", "No refunds on personal cancellations"],
    organizer: "Suvarn Heritage Trust",
    sourceUrl: "https://fastticket.in/events/surat/suvarn-navratri",
    sourceName: "FastTicket Verified Partner",
    mapUrl: "https://maps.google.com/?q=Dumas+Road+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: [
      "3 Oct 2026",
      "4 Oct 2026",
      "5 Oct 2026",
      "6 Oct 2026",
      "7 Oct 2026",
      "8 Oct 2026",
      "9 Oct 2026",
      "10 Oct 2026",
      "11 Oct 2026",
    ],
    passes: [
      {
        id: "single",
        name: "Single Night Pass",
        price: 999,
        desc: "Single entry for any 1 night",
        left: 120,
        season: false,
      },
      {
        id: "couple",
        name: "Couple Pass",
        price: 1799,
        desc: "Entry for two dancers, 1 night",
        left: 75,
        season: false,
      },
      {
        id: "season",
        name: "9-Nights Season Pass",
        price: 6999,
        desc: "All 9 nights all-access pass",
        left: 35,
        season: true,
      },
      {
        id: "vip",
        name: "Royal Dome VIP Season",
        price: 14999,
        desc: "Reserved sofa seating, valet & dinner included",
        left: 10,
        season: true,
        vip: true,
      },
    ],
    active: true,
    sort: 1,
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isPromoted: true,
    offerBadge: "🔥 Flat 15% OFF",
    rating: 4.9,
    syncStatus: "approved",
  },
  {
    id: "kesariya-navratri-vesu",
    name: "Kesariya Navratri 4.0",
    city: "Surat",
    category: "navratri",
    venue: "VR Festive Grounds",
    address: "Dumas Road, Magdalla, Vesu, Surat, Gujarat 395007",
    area: "Vesu",
    dates: "3 – 11 Oct 2026",
    time: "8:00 PM onwards",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    artist: "Kinjal Dave & Folk Troopers",
    artists: [
      {
        name: "Kinjal Dave",
        role: "Lead Vocalist",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      },
    ],
    tag: "Surat's Pride",
    eventType: "Traditional Garba",
    about:
      "Kesariya is back in its grandest 4th edition! 40,000 square feet of festive energy, traditional dhol players from Rajkot, and thunderous Charan folk raas with Kinjal Dave.",
    highlights: [
      "Surat's Largest Open-Air Garba Deck",
      "Authentic Kathiyawadi & Surati Raas Mandlis",
      "Huge 4K LED Screen Walls & Drone Broadcast",
      "Massive Daily Grand Maha Aarti with 108 Deepaks",
    ],
    facilities: [
      "Spacious Mall Basement Parking",
      "Traditional Refreshment Stalls",
      "High Security & Bouncers",
      "Medical Tent",
    ],
    dressCode: "Traditional Gujarati Attire strictly enforced.",
    ageRestriction: "All ages permitted.",
    rules: ["QR code pass scanned at entry gates", "No outside food allowed"],
    terms: ["Wristbands required for re-entry on same night"],
    organizer: "Vesu Cultural Forum",
    sourceUrl: "https://fastticket.in/events/surat/kesariya-navratri",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=VR+Mall+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: [
      "3 Oct 2026",
      "4 Oct 2026",
      "5 Oct 2026",
      "6 Oct 2026",
      "7 Oct 2026",
      "8 Oct 2026",
      "9 Oct 2026",
      "10 Oct 2026",
      "11 Oct 2026",
    ],
    passes: [
      {
        id: "single",
        name: "Single Night Entry",
        price: 699,
        desc: "Single entry for chosen date",
        left: 160,
        season: false,
      },
      {
        id: "couple",
        name: "Couple Entry",
        price: 1299,
        desc: "Couple pass for 1 night",
        left: 85,
        season: false,
      },
      {
        id: "season",
        name: "Full Season Pass",
        price: 4999,
        desc: "All 9 nights unlimited garba",
        left: 40,
        season: true,
      },
      {
        id: "vip",
        name: "VIP Front Circle Season",
        price: 9999,
        desc: "Stage-side access and beverage vouchers",
        left: 12,
        season: true,
        vip: true,
      },
    ],
    active: true,
    sort: 2,
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isPromoted: true,
    offerBadge: "Best Seller",
    rating: 4.8,
    syncStatus: "approved",
  },
  {
    id: "yashvi-purva-mantri",
    name: "Yashvi Navratri 3.0 With Purva Mantri",
    city: "Surat",
    category: "navratri",
    venue: "Sarsana Exhibition Grounds",
    address: "SIECC Complex, Khajod Road, Sarsana, Surat, Gujarat 395007",
    area: "Sarsana",
    dates: "3 – 11 Oct 2026",
    time: "8:00 PM onwards",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    artist: "Purva Mantri (The Kala Chashma Singer)",
    artists: [
      { name: "Purva Mantri", role: "Bollywood Folk Diva" },
      { name: "Live Fusion Dholaks", role: "Percussion Team" },
    ],
    tag: "High Energy",
    eventType: "Celebrity Events",
    about:
      "Purva Mantri brings her viral high-tempo energy to Surat! Blending iconic Gujarati folk numbers with explosive modern festival beats. Non-stop Dodhiya, Hinch, and Sanedo rounds.",
    highlights: [
      "Dynamic 360-degree festival lighting truss",
      "High-energy choreography with dance masters",
      "Grand food court with 50+ local and street stalls",
      "Complimentary photo booths for festive selfies",
    ],
    facilities: [
      "Reserved Parking for 2,500 vehicles",
      "VIP Sofas and elevated seating",
      "Water stations throughout the arena",
      "First aid and emergency services",
    ],
    dressCode: "Festive Indian wear mandatory.",
    ageRestriction: "All age groups welcome.",
    rules: ["QR code on mobile valid for gate scanner"],
    terms: ["Event will strictly follow local sound rules"],
    organizer: "Yashvi Events & Media",
    sourceUrl: "https://fastticket.in/events/surat/yashvi-navratri",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=SIECC+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: [
      "3 Oct 2026",
      "4 Oct 2026",
      "5 Oct 2026",
      "6 Oct 2026",
      "7 Oct 2026",
      "8 Oct 2026",
      "9 Oct 2026",
      "10 Oct 2026",
      "11 Oct 2026",
    ],
    passes: [
      {
        id: "single",
        name: "Youth Night Pass",
        price: 549,
        desc: "Single entry for 1 person",
        left: 210,
        season: false,
      },
      {
        id: "couple",
        name: "Couple Pass",
        price: 999,
        desc: "Couple ticket for 1 night",
        left: 110,
        season: false,
      },
      {
        id: "season",
        name: "All 9 Nights Pass",
        price: 3999,
        desc: "Full season festival access",
        left: 50,
        season: true,
      },
      {
        id: "vip",
        name: "VIP Lounge Pass",
        price: 7999,
        desc: "Front row circle and dinner voucher",
        left: 15,
        season: true,
        vip: true,
      },
    ],
    active: true,
    sort: 3,
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isPromoted: false,
    offerBadge: "💸 ₹200 OFF",
    rating: 4.9,
    syncStatus: "approved",
  },
  {
    id: "pre-navratri-geeta-rabari",
    name: "Pre-Navratri with Geeta Rabari",
    city: "Surat",
    category: "navratri",
    venue: "Tapi Riverfront Lawns",
    address: "Near Swami Vivekananda Bridge, Adajan, Surat, Gujarat 395009",
    area: "Adajan",
    dates: "28 – 30 Sep 2026",
    time: "7:30 PM – 1:30 AM",
    startTime: "07:30 PM",
    endTime: "01:30 AM",
    artist: "Geeta Rabari",
    artists: [{ name: "Geeta Rabari", role: "Kutch Folk Queen" }],
    tag: "Pre-Navratri Special",
    eventType: "Dandiya",
    about:
      "Warm up for Navratri 2026 before the official 9 nights begin! A 3-night mega pre-garba extravaganza on the cool lawns of the Tapi riverfront.",
    highlights: [
      "Exclusive 3-night Pre-Navratri warm-up festival",
      "Traditional Charan raas and classic dandiya rounds",
      "Live dhol workshops for beginners from 6:30 PM",
    ],
    facilities: ["Free Riverfront Parking", "Food Court", "Drinking Water", "First Aid"],
    dressCode: "Ethnic Kurta or Chaniya Choli.",
    ageRestriction: "All ages permitted.",
    rules: ["QR ticket verification at turnstiles"],
    terms: ["Pass valid for designated date"],
    organizer: "Tapi Riverfront Cultural Society",
    sourceUrl: "https://fastticket.in/events/surat/pre-navratri-geeta-rabari",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Adajan+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: ["28 Sep 2026", "29 Sep 2026", "30 Sep 2026"],
    passes: [
      {
        id: "single",
        name: "Pre-Navratri Night Pass",
        price: 449,
        desc: "Single entry for chosen night",
        left: 140,
        season: false,
      },
      {
        id: "season",
        name: "All 3-Nights Pass",
        price: 1199,
        desc: "Complete 3-night warm-up festival",
        left: 60,
        season: true,
      },
    ],
    active: true,
    sort: 4,
    isFeatured: true,
    isTrending: true,
    isPopular: false,
    isPromoted: true,
    offerBadge: "Early Bird",
    isPreNavratri: true,
    rating: 4.7,
    syncStatus: "approved",
  },
  {
    id: "o-rang-rasiya-adajan",
    name: "O Rang Rasiya 2.0",
    city: "Surat",
    category: "navratri",
    venue: "Riverfront Promenade Plot",
    address: "Swami Vivekananda Bridge Road, Adajan, Surat, Gujarat 395009",
    area: "Adajan",
    dates: "3 – 11 Oct 2026",
    time: "8:00 PM onwards",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    artist: "Osman Mir & Troupe",
    artists: [{ name: "Osman Mir", role: "Sufi-Folk Legend" }],
    tag: "Crowd Favourite",
    eventType: "Traditional Garba",
    about:
      "O Rang Rasiya returns bigger and bolder in version 2.0. Celebrated for its energetic crowd, authentic 2-taali and 3-taali raas, and Osman Mir's iconic voice echoing along the river.",
    highlights: [
      "40,000 sq ft dance arena on natural riverfront turf",
      "Authentic Kathiyawadi Folk & Sufi Fusion",
      "Dedicated senior citizen seated enclosure",
    ],
    facilities: ["Riverfront Parking", "Farsan Stalls", "Security", "Restrooms"],
    dressCode: "Authentic Gujarati traditional dress.",
    ageRestriction: "All ages welcome.",
    rules: ["QR pass required at turnstiles"],
    terms: ["Subject to festival regulatory rules"],
    organizer: "Rang Rasiya Events Surat",
    sourceUrl: "https://fastticket.in/events/surat/o-rang-rasiya",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Adajan+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: [
      "3 Oct 2026",
      "4 Oct 2026",
      "5 Oct 2026",
      "6 Oct 2026",
      "7 Oct 2026",
      "8 Oct 2026",
      "9 Oct 2026",
      "10 Oct 2026",
      "11 Oct 2026",
    ],
    passes: [
      {
        id: "single",
        name: "Single Night Entry",
        price: 549,
        desc: "Single entry for chosen date",
        left: 190,
        season: false,
      },
      {
        id: "couple",
        name: "Couple Pass",
        price: 999,
        desc: "Entry for two",
        left: 95,
        season: false,
      },
      {
        id: "season",
        name: "Full Season Pass",
        price: 3899,
        desc: "All 9 nights entry",
        left: 45,
        season: true,
      },
      {
        id: "vip",
        name: "VIP Deck Pass",
        price: 7499,
        desc: "Riverside sofa seating & snacks",
        left: 12,
        season: true,
        vip: true,
      },
    ],
    active: true,
    sort: 5,
    isFeatured: true,
    isTrending: false,
    isPopular: true,
    isPromoted: true,
    offerBadge: "🔥 Flat 15% OFF",
    rating: 4.8,
    syncStatus: "approved",
  },
  {
    id: "mandli-garba-althan",
    name: "Mandli Garba 2026",
    city: "Surat",
    category: "navratri",
    venue: "Shyam Mandir Grounds",
    address: "VIP Road, Opp. Althan Community Hall, Althan, Surat 395017",
    area: "Althan",
    dates: "3 – 11 Oct 2026",
    time: "8:00 PM – 2:00 AM",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    artist: "Kirtidan Gadhvi & Folk Ensemble",
    artists: [{ name: "Kirtidan Gadhvi", role: "Dandiya King" }],
    tag: "Celebrity Raas",
    eventType: "Celebrity Events",
    about:
      "Traditional Mandli garba in its purest spiritual form. Centered around traditional clay garbi with dayro singing and authentic Kathiyawadi percussion.",
    highlights: [
      "Palace themed royal illumination",
      "Midnight Dayro session with Kirtidan Gadhvi",
      "Family friendly peaceful garba rounds",
    ],
    facilities: ["Free 4-Wheeler Parking", "Kathiyawadi Prasadam Stalls", "Medical Desk"],
    dressCode: "Chaniya Choli / Kurta Pajama.",
    ageRestriction: "All age groups.",
    rules: ["Dress code strictly checked at entry"],
    terms: ["Pass valid for one person"],
    organizer: "Heritage Raas Trust Surat",
    sourceUrl: "https://fastticket.in/events/surat/mandli-garba",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Althan+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: [
      "3 Oct 2026",
      "4 Oct 2026",
      "5 Oct 2026",
      "6 Oct 2026",
      "7 Oct 2026",
      "8 Oct 2026",
      "9 Oct 2026",
      "10 Oct 2026",
      "11 Oct 2026",
    ],
    passes: [
      {
        id: "single",
        name: "General Pass",
        price: 499,
        desc: "Entry for 1 night",
        left: 160,
        season: false,
      },
      {
        id: "couple",
        name: "Couple Entry",
        price: 899,
        desc: "Two tickets for 1 night",
        left: 80,
        season: false,
      },
      {
        id: "season",
        name: "Full 9-Day Pass",
        price: 3499,
        desc: "Full season festival access",
        left: 40,
        season: true,
      },
      {
        id: "vip",
        name: "Royal VIP Deck",
        price: 6999,
        desc: "Sofa seating with complimentary dinner buffet",
        left: 8,
        season: true,
        vip: true,
      },
    ],
    active: true,
    sort: 6,
    isFeatured: true,
    isTrending: false,
    isPopular: true,
    isPromoted: false,
    offerBadge: "Limited Seats",
    rating: 4.9,
    syncStatus: "approved",
  },
  {
    id: "comedy-amit-tandon-surat",
    name: "Amit Tandon Live – Stand-up Comedy",
    city: "Surat",
    category: "comedy",
    venue: "Sanjeev Kumar Auditorium",
    address: "Pal-Hazira Road, near Pal RTO, Pal, Surat 395009",
    area: "Pal",
    dates: "18 Oct 2026",
    time: "7:00 PM – 9:00 PM",
    startTime: "07:00 PM",
    endTime: "09:00 PM",
    artist: "Amit Tandon",
    artists: [{ name: "Amit Tandon", role: "Standup Comedian" }],
    tag: "Comedy Special",
    eventType: "Family Events",
    about:
      "India's favourite clean family comedian Amit Tandon brings his brand new hour 'Masala Sandwich' to Surat! Relatable observational jokes about marriage, parenting, and Indian middle-class quirks.",
    highlights: [
      "100% Clean Family Comedy (Safe for kids and parents)",
      "Fully Air Conditioned Tiered Theater Seating",
      "90 Minutes of Non-Stop Laughter",
    ],
    facilities: ["Auditorium Covered Parking", "Cafeteria", "Wheelchair Ramps"],
    dressCode: "Smart Casual.",
    ageRestriction: "12 years and above.",
    rules: ["Gates close at 7:15 PM sharp", "No video recording allowed during show"],
    terms: ["Tickets non-refundable"],
    organizer: "Laughter Therapy India",
    sourceUrl: "https://fastticket.in/events/surat/amit-tandon-live",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Sanjeev+Kumar+Auditorium+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: ["18 Oct 2026"],
    passes: [
      {
        id: "silver",
        name: "Silver Balcony",
        price: 499,
        desc: "Balcony tier seating",
        left: 90,
        season: false,
      },
      {
        id: "gold",
        name: "Gold Middle Rows",
        price: 999,
        desc: "Middle orchestra seating",
        left: 60,
        season: false,
      },
      {
        id: "platinum",
        name: "Platinum Front Rows",
        price: 1499,
        desc: "Front row celebrity seating",
        left: 25,
        season: false,
        vip: true,
      },
    ],
    active: true,
    sort: 7,
    isFeatured: true,
    isTrending: true,
    isPopular: false,
    isPromoted: true,
    offerBadge: "🔥 Selling Fast",
    rating: 4.9,
    syncStatus: "approved",
  },
  {
    id: "sunburn-reload-surat",
    name: "Sunburn Reload Surat – EDM Carnival",
    city: "Surat",
    category: "concerts",
    venue: "Dumas Ocean Beach Lawns",
    address: "Near Sultanabad, Dumas Road, Surat 395007",
    area: "Dumas Road",
    dates: "24 Oct 2026",
    time: "5:00 PM – 11:30 PM",
    startTime: "05:00 PM",
    endTime: "11:30 PM",
    artist: "International Headliner & Lost Stories",
    artists: [
      { name: "Lost Stories", role: "EDM Duo" },
      { name: "DJ Zaeden", role: "Electronic Producer" },
    ],
    tag: "EDM Festival",
    eventType: "Live Music",
    about:
      "Asia's largest dance music brand hits Surat for Sunburn Reload! International stage design, massive CO2 cannons, SFX pyrotechnics, and the biggest bass drops of the year.",
    highlights: [
      "Massive Sunburn Festival Stage Production",
      "Special Sunset Beachfront Music Session",
      "Food Trucks and Mocktail Bars",
    ],
    facilities: ["Valet Parking", "VIP Lounge", "Medical Desk", "Strict Security"],
    dressCode: "Festival Chic / Casuals.",
    ageRestriction: "16+ strictly enforced. Govt ID required.",
    rules: ["Baggage frisking at gate", "Re-entry not permitted"],
    terms: ["Tickets non-transferable"],
    organizer: "Sunburn Festival & Percept Live",
    sourceUrl: "https://fastticket.in/events/surat/sunburn-reload-surat",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Dumas+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: ["24 Oct 2026"],
    passes: [
      {
        id: "ga",
        name: "General Admission",
        price: 899,
        desc: "Arena entry",
        left: 180,
        season: false,
      },
      {
        id: "vip",
        name: "VIP Deck Access",
        price: 1799,
        desc: "Elevated platform and dedicated bar",
        left: 50,
        season: false,
        vip: true,
      },
      {
        id: "fanpit",
        name: "Fan Pit Stage Front",
        price: 2999,
        desc: "Right in front of DJ console",
        left: 20,
        season: false,
        vip: true,
      },
    ],
    active: true,
    sort: 8,
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isPromoted: true,
    offerBadge: "🔥 Flat 15% OFF",
    rating: 4.8,
    syncStatus: "approved",
  },
  {
    id: "techno-garba-fusion-sarsana",
    name: "Techno Raas – Neon Garba Night",
    city: "Surat",
    category: "navratri",
    venue: "Sarsana Dome 2",
    address: "SIECC Complex, Khajod Road, Sarsana, Surat, Gujarat 395007",
    area: "Sarsana",
    dates: "5 – 11 Oct 2026",
    time: "9:00 PM – 3:00 AM",
    startTime: "09:00 PM",
    endTime: "03:00 AM",
    artist: "DJ Chetas & Folk Trance Collective",
    artists: [
      { name: "DJ Chetas", role: "Bollywood / Electronic Headliner" },
      { name: "Swar Trance Band", role: "Folk Percussionists" },
    ],
    tag: "Youth Sensation",
    eventType: "Techno Garba",
    about:
      "The viral sensation comes to Surat! A seamless blend of Gujarati folk dhol beats with modern electronic synths, UV neon body paints, laser mappings, and hypnotic basslines for Surat's youth.",
    highlights: [
      "Ultra-Modern UV Glow in the Dark Dance Deck",
      "Live Folk Instruments meets Electronic Modular Synths",
      "Synchronized Wireless LED Wristbands for Every Dancer",
      "Zero-Alcohol Mocktail & Energy Drink Pavilions",
    ],
    facilities: [
      "Covered SIECC Parking",
      "Neon Face Art Counters",
      "Air Conditioned Chill Zones",
      "High Security Gates",
    ],
    dressCode: "Neon / Fluorescent Traditional or Fusion Attire.",
    ageRestriction: "16 years and above.",
    rules: ["QR code scanning at entrance", "Strict bag checking at turnstiles"],
    terms: ["Passes non-transferable", "No re-entry without UV stamp"],
    organizer: "Pulse Entertainment Surat",
    sourceUrl: "https://fastticket.in/events/surat/techno-raas-neon-garba",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Sarsana+Dome+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: [
      "5 Oct 2026",
      "6 Oct 2026",
      "7 Oct 2026",
      "8 Oct 2026",
      "9 Oct 2026",
      "10 Oct 2026",
      "11 Oct 2026",
    ],
    passes: [
      {
        id: "single",
        name: "Single Night Entry",
        price: 799,
        desc: "Entry + 1 Free Glow Stick Pack",
        left: 150,
        season: false,
      },
      {
        id: "stag",
        name: "Stag / Solo Pass",
        price: 899,
        desc: "Individual fast-track access",
        left: 80,
        season: false,
      },
      {
        id: "couple",
        name: "Couple Pass",
        price: 1499,
        desc: "Entry for two with neon kit",
        left: 90,
        season: false,
      },
      {
        id: "season",
        name: "Techno Season Pass",
        price: 4499,
        desc: "Full 7 nights access",
        left: 30,
        season: true,
      },
    ],
    active: true,
    sort: 9,
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    isPromoted: true,
    offerBadge: "⚡ High Energy",
    rating: 4.9,
    syncStatus: "approved",
  },
  {
    id: "united-heritage-dandiya",
    name: "Surat Heritage Dandiya Utsav",
    city: "Surat",
    category: "navratri",
    venue: "Dumas Seafront Pavilion",
    address: "Near Sultanabad Checkpost, Dumas Road, Surat, Gujarat 395007",
    area: "Dumas Road",
    dates: "3 – 11 Oct 2026",
    time: "8:00 PM – 2:00 AM",
    startTime: "08:00 PM",
    endTime: "02:00 AM",
    artist: "Heritage Folk Symphony & Falguni Pathak Troupe",
    artists: [{ name: "Falguni Pathak Troupe", role: "Legendary Dandiya Ensemble" }],
    tag: "Traditional Heritage",
    eventType: "Other Navratri Events",
    about:
      "A pure celebration of traditional heritage Dandiya Raas by the Arabian sea breeze. Over 30,000 dancers in synchronized concentric circles celebrating Gujarati culture and devotional folk songs.",
    highlights: [
      "Breezy Open-Air Seafront Arena",
      "Traditional Shehnai, Nagara, and Dhol Troupe",
      "Special Senior Citizen Seating & Family Pavilions",
      "Daily Maha Aarti with over 500 oil lamps",
    ],
    facilities: [
      "Free 4-Wheeler Seafront Parking",
      "Authentic Surati Khaja & Sweets",
      "First Aid",
      "CCTV Monitoring",
    ],
    dressCode: "Pure Gujarati Traditional Attire mandatory.",
    ageRestriction: "All age groups welcome.",
    rules: ["QR code verified at turnstile", "Wooden dandiya sticks only"],
    terms: ["Pass valid for specified date or full season"],
    organizer: "Surat Heritage Culture Guild",
    sourceUrl: "https://fastticket.in/events/surat/heritage-dandiya-utsav",
    sourceName: "FastTicket Authorized Feed",
    mapUrl: "https://maps.google.com/?q=Dumas+Road+Surat",
    coverImage:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=80",
    ],
    nights: [
      "3 Oct 2026",
      "4 Oct 2026",
      "5 Oct 2026",
      "6 Oct 2026",
      "7 Oct 2026",
      "8 Oct 2026",
      "9 Oct 2026",
      "10 Oct 2026",
      "11 Oct 2026",
    ],
    passes: [
      {
        id: "single",
        name: "Single Night Pass",
        price: 449,
        desc: "Single entry for any 1 night",
        left: 160,
        season: false,
      },
      {
        id: "couple",
        name: "Couple Pass",
        price: 849,
        desc: "Entry for 1 couple",
        left: 80,
        season: false,
      },
      {
        id: "season",
        name: "9-Nights Season Pass",
        price: 3299,
        desc: "Full season festival access",
        left: 50,
        season: true,
      },
      {
        id: "vip",
        name: "VIP Heritage Cabana",
        price: 7499,
        desc: "Elevated sea-view deck with snacks",
        left: 15,
        season: true,
        vip: true,
      },
    ],
    active: true,
    sort: 10,
    isFeatured: true,
    isTrending: false,
    isPopular: true,
    isPromoted: false,
    offerBadge: "Family Special",
    rating: 4.8,
    syncStatus: "approved",
  },
];

export const DEFAULT_EVENTS: EventItem[] = [
  ...FASTTICKET_SURAT_EVENTS,
  ...LEGACY_EVENTS.filter((e) => !FASTTICKET_SURAT_EVENTS.some((f) => f.id === e.id)),
];

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("data")
        .eq("id", 1)
        .single();
      if (!error && data?.data) {
        return data.data as unknown as Settings;
      }
    } catch (e) {
      console.warn("Using local settings fallback", e);
    }
    return {
      heroEyebrow: "Surat Entertainment & Ticketing",
      heroTitle: "Discover exciting events",
      heroTitleAccent: "near you.",
      heroText:
        "Book tickets for the best events, sports turfs, garba nights and experiences across Surat.",
      featuredTitle: "Featured & Trending Events",
      tagline: "Discover. Book. Experience.",
      supportLine: "24/7 Ticketing Desk · Surat, Gujarat",
      steps: [
        "Discover|Browse verified events, live concerts and sports venues in Surat.",
        "Book|Select passes, apply discount coupons and pay securely via UPI.",
        "Experience|Instant confirmation with digital QR pass for turnstile entry.",
      ],
      contactPhone: "+91 98765 43210",
      contactEmail: "hello@aapnopass.in",
      contactAddress: "Ring Road, Surat, Gujarat 395002",
      whatsapp: "919876543210",
      contactText:
        "Questions about a booking or want to list your Surat event or sports turf? Reach out to our 24/7 desk.",
      upiId: "aapnopass@upi",
      upiName: "AapnoPass Gujarat",
      paymentNote:
        "Scan QR with any UPI app (Google Pay, PhonePe, Paytm, BHIM), pay exact amount, then enter the 12-digit UTR.",
      footerText:
        "© 2026 AapnoPass. All Rights Reserved. Surat's Premier Entertainment & Ticket Booking Platform.",
    } as Settings;
  },
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: async () => {
    try {
      const { data, error } = await supabase.from("events").select("*").order("sort");
      if (!error && data && data.length > 0) {
        const defaultMap = new Map<string, EventItem>(DEFAULT_EVENTS.map((d) => [d.id, d]));
        const mergedFromDb = (data as any[]).map((row) => {
          const matchDefault =
            defaultMap.get(row.id) || DEFAULT_EVENTS.find((d) => d.name === row.name);
          return {
            ...(matchDefault || {}),
            ...row,
            city: row.city || matchDefault?.city || "Surat",
            category: row.category || matchDefault?.category || "navratri",
            startTime: row.startTime || matchDefault?.startTime || "08:00 PM",
            endTime: row.endTime || matchDefault?.endTime || "02:00 AM",
            address: row.address || matchDefault?.address || `${row.venue}, ${row.area}, Surat`,
            mapUrl:
              row.mapUrl ||
              matchDefault?.mapUrl ||
              `https://maps.google.com/?q=${encodeURIComponent(row.venue + " " + row.area + " Surat")}`,
            coverImage:
              row.coverImage ||
              matchDefault?.coverImage ||
              "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
            galleryImages: row.galleryImages ||
              matchDefault?.galleryImages || [
                matchDefault?.coverImage ||
                  "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&auto=format&fit=crop&q=80",
              ],
            highlights: row.highlights ||
              matchDefault?.highlights || ["Live Orchestra", "Safe Family Venue", "Spacious Arena"],
            facilities: row.facilities ||
              matchDefault?.facilities || ["Free Parking", "Food Stalls", "First Aid", "Security"],
            dressCode:
              row.dressCode || matchDefault?.dressCode || "Traditional Festive Attire mandatory.",
            ageRestriction:
              row.ageRestriction || matchDefault?.ageRestriction || "All age groups welcome.",
            rules: row.rules ||
              matchDefault?.rules || ["Valid QR pass required", "No re-entry without wristband"],
            terms: row.terms || matchDefault?.terms || ["Passes are non-refundable"],
            organizer: row.organizer || matchDefault?.organizer || "Surat Festival Organizers",
            sourceUrl:
              row.sourceUrl || matchDefault?.sourceUrl || "https://fastticket.in/events/surat",
            sourceName: row.sourceName || matchDefault?.sourceName || "FastTicket Verified Partner",
            eventType: row.eventType || matchDefault?.eventType || "Traditional Garba",
            isFeatured:
              row.isFeatured !== undefined ? row.isFeatured : (matchDefault?.isFeatured ?? true),
            isTrending:
              row.isTrending !== undefined ? row.isTrending : (matchDefault?.isTrending ?? false),
            isPopular:
              row.isPopular !== undefined ? row.isPopular : (matchDefault?.isPopular ?? true),
            isPromoted:
              row.isPromoted !== undefined ? row.isPromoted : (matchDefault?.isPromoted ?? false),
            offerBadge: row.offerBadge || matchDefault?.offerBadge,
            rating: row.rating || matchDefault?.rating || 4.8,
            passes: row.passes && row.passes.length > 0 ? row.passes : matchDefault?.passes || [],
          } as EventItem;
        });

        // Ensure all DEFAULT_EVENTS are always included
        const existingIds = new Set(mergedFromDb.map((e) => e.id));
        const combined = [...mergedFromDb];
        for (const def of DEFAULT_EVENTS) {
          if (!existingIds.has(def.id)) {
            combined.push(def);
          }
        }
        return combined.sort((a, b) => (a.sort || 99) - (b.sort || 99));
      }
    } catch (e) {
      console.warn("Using default rich events array", e);
    }

    return DEFAULT_EVENTS;
  },
});

export const minPrice = (e: EventItem) =>
  e.passes && e.passes.length > 0 ? Math.min(...e.passes.map((p) => p.price)) : 499;

export const maxPrice = (e: EventItem) =>
  e.passes && e.passes.length > 0 ? Math.max(...e.passes.map((p) => p.price)) : 499;

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const newId = () =>
  "AP" + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 900 + 100);

export const upiLink = (s: Settings, amount: number, note: string, ref = "", base = "upi://pay") =>
  `${base}?pa=${encodeURIComponent(s.upiId)}&pn=${encodeURIComponent(s.upiName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}${ref ? `&tr=${ref}` : ""}`;

export const UPI_APPS = [
  { name: "Google Pay", base: "tez://upi/pay" },
  { name: "PhonePe", base: "phonepe://pay" },
  { name: "Paytm", base: "paytmmp://pay" },
  { name: "BHIM", base: "upi://pay" },
  { name: "Other UPI apps", base: "upi://pay" },
];

const KEY = "aapnopass.myids";
export const myIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const rememberId = (id: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify([id, ...myIds().filter((x) => x !== id)]));
  }
};

export const getSelectedCity = (): string => {
  if (typeof window === "undefined") return "Surat";
  try {
    return localStorage.getItem("aapnopass.city") || "Surat";
  } catch {
    return "Surat";
  }
};

export const setSelectedCity = (city: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("aapnopass.city", city);
    window.dispatchEvent(new CustomEvent("city_changed", { detail: city }));
  }
};

// Wishlist / Saved Events
const SAVED_KEY = "aapnopass.saved_events";
export const getSavedEventIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
};

export const toggleSaveEventId = (id: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const ids = getSavedEventIds();
    let updated: string[];
    let isSavedNow: boolean;
    if (ids.includes(id)) {
      updated = ids.filter((x) => x !== id);
      isSavedNow = false;
    } else {
      updated = [...ids, id];
      isSavedNow = true;
    }
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("saved_changed", { detail: updated }));
    return isSavedNow;
  } catch {
    return false;
  }
};

export async function fetchBookings(ids: string[]): Promise<Booking[]> {
  if (!ids.length) return [] as Booking[];
  try {
    const { data, error } = await supabase.rpc("get_bookings", { _ids: ids });
    if (!error && data) return data as Booking[];
  } catch (e) {
    console.warn("fetchBookings fallback", e);
  }

  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("aapnopass.local_bookings");
      if (local) {
        const parsed = JSON.parse(local) as Booking[];
        return parsed.filter((b) => ids.includes(b.id));
      }
    } catch {}
  }
  return [];
}
