// Loads the 11 trip-planner topics from the Supabase affiliate DB (sectors -> guides -> categories
// -> products), reshaping rows into the exact node shape app-mode.js and quick-launcher.js already
// render ({id, label, icon, blurb, image, general, recommendations, platforms, nextUp, ctaLabel}) —
// see .claude/memory/project_affiliate_db_schema_and_design_first.md (paypal-poc repo) for the
// schema, and 3-milestones/2-milestone-1-sprint-2/3-affiliate-db-design.md for what each sector is
// meant to contain.
//
// The DB only models affiliate inventory (guides/categories/products) — it has no columns for
// editorial copy (hero image, blurb, Layer-1 narrative intro, "next up" ordering/blurbs). That copy
// stays here as a small static map, keyed by the same sector slug the DB uses, and gets merged with
// live DB rows at load time. This is deliberately NOT a duplicate of trip-planner.js's old shape:
// only the fields the DB can never hold live here; everything the DB owns is fetched fresh.
import { supabase } from './supabase-client.js';

const SECTOR_ORDER = [
    'flights', 'airport-transfer', 'staying-connected', 'where-to-stay', 'getting-around',
    'tours-activities', 'food', 'travel-insurance', 'money-currency', 'packing', 'safety'
];

// Editorial copy the DB doesn't model — icon/blurb/image/general intro/readMore/nextUp per sector.
// nextUp targets are just ids into this same map; app-mode.js resolves id -> label/icon at render
// time (see renderNextUp), so only id/blurb are needed here, but we keep label/icon too since
// nextUp cards render independently of whichever node is "current."
const SECTOR_COPY = {
    flights: {
        icon: '✈️', blurb: 'Getting to Sri Lanka in the first place.',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
        intro: "Getting to Sri Lanka in the first place is its own small planning task, and it's worth doing right before anything else — a bad connection or an awkward arrival time can throw off the first day or two of a trip that took months to plan. This is the one piece of the puzzle that starts before you even land: where you fly into, when, and how that first day unfolds once you touch down.",
        readMore: [],
        nextUp: [{ id: 'airport-transfer', blurb: 'Landed — now get from Bandaranaike International to the coast.' }]
    },
    'airport-transfer': {
        icon: '🚐', blurb: 'From Bandaranaike International to the South Coast.',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
        intro: "Bandaranaike International sits well north of the South Coast, and the drive down — 2.5 to 3 hours depending on traffic — is most visitors' first real taste of Sri Lankan roads. It's not a leg to wing on arrival: sorting a transfer in advance means a driver is actually there waiting for you, not something you're negotiating for at 11pm after a long flight. Here's how to get that first stretch right.",
        readMore: [],
        nextUp: [{ id: 'staying-connected', blurb: 'Sort your SIM or eSIM before you need to look something up.' }],
        ctaLabel: 'Book Your Transfer'
    },
    'staying-connected': {
        icon: '📶', blurb: 'eSIM and mobile data for your trip.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
        intro: "A local SIM or eSIM is one of the first things worth sorting once you land — for maps, for translating a menu, for messaging home, and for just being able to look something up when a plan changes on the fly (which, on this coast, it often will). Here's what to know before you land.",
        readMore: [],
        nextUp: [{ id: 'where-to-stay', blurb: 'Connected and ready — now pick a base for your trip.' }]
    },
    'where-to-stay': {
        icon: '🏡', blurb: 'Real, verified places across the South Coast towns.',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800',
        intro: "The South Coast isn't one place — it's a string of towns with genuinely different personalities, from Ahangama's mellow surf-town pace to Galle Fort's cobbled colonial lanes to Tangalle's quieter, wilder beaches further east. Where you base yourself shapes the whole trip more than almost any other decision, so it's worth choosing on purpose rather than by default.",
        readMore: [{ label: 'Ahangama vs. Weligama: Where to Stay', href: '../guides/ahangama-vs-weligama.html' }],
        nextUp: [{ id: 'getting-around', blurb: 'Once you’ve picked a base, work out how to move between towns.' }],
        ctaLabel: 'Book Your Stay'
    },
    'getting-around': {
        icon: '🛺', blurb: 'Tuk-tuks, scooters, vans, and trains between towns.',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
        intro: "The South Coast looks small on a map — a string of beach towns you could trace with a finger in under a minute. On the ground it moves at its own pace entirely. Some visitors get around on the back of a tuk-tuk with the wind in their face; others catch the coastal train with the doors wide open and the ocean close enough to touch; others still hand the whole thing to a driver and watch it go by from the back seat. There's no one right way to move through this coast — only the way that fits the trip you're actually having. Here's how to figure out which one that is, what it costs, and a couple of real promotions worth knowing about before you book anything.",
        readMore: [],
        map: {
            center: [5.975, 80.40], zoom: 10,
            places: [
                { name: 'Ahangama', lat: 5.9735163, lng: 80.3622999, note: 'Home base — tuk-tuks, scooters, and the coastal train station.' },
                { name: 'Weligama', lat: 5.9751305, lng: 80.4291390, note: "Beginner-friendly surf, a short hop by tuk-tuk or train." },
                { name: 'Mirissa', lat: 5.9493634, lng: 80.4558128, note: 'Whale watching harbour — see the Tours & Activities topic.' },
                { name: 'Galle Fort', lat: 6.0304681, lng: 80.2169190, note: '30–40 min by tuk-tuk, car, or the coastal train.' },
                { name: 'Matara', lat: 5.9478220, lng: 80.5482919, note: 'Southern terminus of the coastal railway line.' },
                { name: 'Koggala Lake', lat: 6.0023673, lng: 80.3319389, note: 'Boat trips and stilt fishermen — a popular day-trip stop.' }
            ]
        },
        nextUp: [
            { id: 'tours-activities', blurb: 'Now that you can get there — whale watching, Galle Fort, and surf lessons.' },
            { id: 'where-to-stay', blurb: 'Pick a base that puts you close to the transport options you just compared.' }
        ],
        ctaLabel: 'Book Your Transport'
    },
    'tours-activities': {
        icon: '🎟️', blurb: 'Whale watching, Galle Fort, surf lessons, and more.',
        image: 'https://images.unsplash.com/photo-1566393009478-ef02c54530a7?auto=format&fit=crop&q=80&w=800',
        intro: "This is where the South Coast actually shows off — whale watching out of Mirissa's harbour, the ramparts and old streets of Galle Fort, a first surf lesson on Weligama's famously forgiving break. None of it needs to be rushed or overplanned, but the good operators do fill up, especially in season, so it's worth knowing what's actually on offer before you're standing on a beach trying to decide.",
        readMore: [],
        nextUp: [{ id: 'food', blurb: 'Refuel after a full day out.' }],
        ctaLabel: 'Book Your Experience'
    },
    food: {
        icon: '🍛', blurb: 'Where we actually eat around Ahangama.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
        intro: "Ahangama's food scene runs the full range — beachfront rice-and-curry shacks that have fed the same regulars for years, and the flat-white cafes that have grown up around the surf crowd. You won't go hungry or broke either way; the only real decision is which kind of meal fits which kind of day.",
        readMore: [],
        nextUp: [{ id: 'travel-insurance', blurb: 'Check the fine print before something goes wrong.' }]
    },
    'travel-insurance': {
        icon: '🩹', blurb: 'What to check before you fly.',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800',
        intro: "Sri Lanka is generally an easy, safe place to travel, but surf, scooters, and the odd stomach bug all make travel insurance worth actually reading the fine print on rather than ticking a box. What matters most is whether a policy genuinely covers the things you're likely to be doing here, not just the standard baseline.",
        readMore: [],
        nextUp: [{ id: 'money-currency', blurb: 'Sort cash and cards before you need either.' }]
    },
    'money-currency': {
        icon: '💱', blurb: 'ATMs, cards, and currency tips for Sri Lanka.',
        image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800',
        intro: "Cash and cards both have their place here — some guesthouses and tuk-tuk drivers are cash-only, while bigger hotels and shops take cards without issue. ATMs are common enough in the bigger towns but sparser the further you get into quieter stretches of coast, so a little planning around when and where you'll need cash goes a long way.",
        readMore: [],
        nextUp: [{ id: 'packing', blurb: 'What to actually bring for a South Coast beach trip.' }]
    },
    packing: {
        icon: '🎒', blurb: 'What to actually bring for a South Coast beach trip.',
        image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=800',
        intro: "The South Coast's climate does most of the work deciding what's in your bag — hot, humid, and sun-heavy most of the year, with a few things (reef-safe sunscreen, modest cover-ups for temple visits) that are easy to forget until you actually need them. Pack light; you can buy almost anything you forget once you're here.",
        readMore: [],
        nextUp: [{ id: 'safety', blurb: 'What to know before something goes wrong.' }]
    },
    safety: {
        icon: '🚑', blurb: 'What to know before something goes wrong.',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=800',
        intro: "Sri Lanka's South Coast is, on the whole, a relaxed and safe place to travel — but a little awareness goes a long way, whether that's water safety in unfamiliar surf, road sense around scooters and tuk-tuks, or just knowing who to call if something does go wrong. Here's what's actually worth knowing, not a list of things to be anxious about.",
        readMore: [],
        nextUp: [{ id: 'flights', blurb: 'Start planning your trip from the top.' }]
    }
};

const SECTOR_LABELS = {
    flights: 'Flights', 'airport-transfer': 'Airport Transfer', 'staying-connected': 'Staying Connected',
    'where-to-stay': 'Where to Stay', 'getting-around': 'Getting Around', 'tours-activities': 'Tours & Activities',
    food: 'Food', 'travel-insurance': 'Travel Insurance', 'money-currency': 'Money & Currency',
    packing: 'Packing', safety: 'Safety & Emergencies'
};

let cachedTree = null;

// One query per table, joined client-side — simpler to reason about and cache than one deep nested
// select, and all 4 tables are small (well under Supabase's default row limits).
async function fetchTree() {
    if (cachedTree) return cachedTree;

    const [{ data: sectors, error: e1 }, { data: guides, error: e2 },
        { data: categories, error: e3 }, { data: products, error: e4 }] = await Promise.all([
            supabase.from('sectors').select('*').order('sort_order'),
            supabase.from('guides').select('*'),
            supabase.from('categories').select('*'),
            supabase.from('products').select('*')
        ]);
    const error = e1 || e2 || e3 || e4;
    if (error) throw error;

    const categoriesByGuide = new Map();
    categories.forEach(cat => {
        if (!categoriesByGuide.has(cat.guide_id)) categoriesByGuide.set(cat.guide_id, []);
        categoriesByGuide.get(cat.guide_id).push(cat);
    });
    const productsByCategory = new Map();
    products.forEach(p => {
        if (!productsByCategory.has(p.category_id)) productsByCategory.set(p.category_id, []);
        productsByCategory.get(p.category_id).push(p);
    });
    const guidesBySector = new Map();
    guides.forEach(g => {
        if (!guidesBySector.has(g.sector_id)) guidesBySector.set(g.sector_id, []);
        guidesBySector.get(g.sector_id).push(g);
    });

    cachedTree = { sectors, guidesBySector, categoriesByGuide, productsByCategory };
    return cachedTree;
}

// Per-guide editorial copy the DB doesn't model (image, card description, which labeled sub-group
// it belongs to within its sector's "Go Deeper" section). Keyed by guide slug. A guide with no entry
// here (any of the 11 new stub guides) still renders — just without an image and under a plain
// "Go Deeper" label, since there's no real copy to show yet.
const GUIDE_COPY = {
    'whale-watching-mirissa': { group: 'Real Experiences', description: 'Season, boat choice, seasickness, and what you’ll actually see on a whale watching trip out of Mirissa harbour.', image: 'https://images.unsplash.com/photo-1566393009478-ef02c54530a7?auto=format&fit=crop&q=80&w=600' },
    'galle-fort-tours': { group: 'Real Experiences', description: 'History, what to see, and how to plan a half-day or full-day trip to Sri Lanka’s best-preserved colonial fort.', image: 'https://images.unsplash.com/photo-1748491829000-a88e5028e209?auto=format&fit=crop&q=80&w=600' },
    'yala-safari': { group: 'Real Experiences', description: 'Leopard density, best season, drive time, and what a Yala day actually looks like — plan it right before you book.', image: 'https://images.unsplash.com/photo-1621847473222-d85c022cbf07?auto=format&fit=crop&q=80&w=600' },
    'surf-lessons-weligama': { group: 'Real Experiences', description: 'Board choice, lesson length, and what to expect learning to surf on Weligama’s beginner-friendly bay.', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=600' },
    'airport-transfer-guide': { group: 'Get There', description: 'Private transfer vs. train vs. tuk-tuk, real drive times, and what to book before you fly.', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=600' },
    'getting-around-ahangama': { group: 'Daily Transport', description: 'Tuk-tuks, scooters, and private vans — the full breakdown of costs, what to rent, and our honest recommendation.', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=600' },
    'coastal-train-galle-matara': { group: 'Scenic Journeys', description: 'One of the great budget travel experiences on this coast — open doors, ocean views, and how to actually ride it.', image: 'https://images.unsplash.com/photo-1781749809764-b8f3e740dbe5?auto=format&fit=crop&q=80&w=600' },
    'ahangama-day-trip': { group: 'Day Trips & Excursions', description: 'Galle Fort, Koggala Lake, Yala safari — what’s realistic as a day trip and how to get there.', image: 'https://images.unsplash.com/photo-1778563623975-582b7723d026?auto=format&fit=crop&q=80&w=600' },
    'best-cafes-restaurants-ahangama': { group: 'Where We Eat', description: 'Every price range covered — updated by the Dolblathanna team.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600' },
    'sri-lanka-travel-insurance-guide': { group: 'Get Covered', description: 'Surf, scooter, and medical cover explained — what to check before you buy a policy.', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600' },
    'sri-lanka-beach-packing-guide': { group: 'What to Bring', description: 'Climate, reef-safe sunscreen, plug types, and modest-dress essentials for temples.', image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=600' },
    'ahangama-vs-weligama': { group: 'Compare Towns', description: 'An honest comparison of Sri Lanka’s two neighbouring south coast surf towns to help you decide where to base your trip.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=600' },
    'flight-booking': { group: 'Get There', description: 'Routing, timing, and what actually affects the fare into Bandaranaike International.', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600' },
    'flight-compensation': { group: 'Get There', description: 'What to do if your flight is delayed, cancelled, or overbooked — and whether you’re owed compensation.', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600' },
    'esim-mobile-data': { group: 'Get Connected', description: 'eSIM vs. a physical SIM on arrival, which network actually covers the South Coast, and how to pick a data plan before you fly.', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=600' },
    'remote-work-connectivity': { group: 'Get Connected', description: 'Wifi reliability, backup data, and what working remotely from the South Coast actually looks like day to day.', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600' }
};

// One Layer-2 "deeper card" per guide, pointing at that guide's own site_path (the guide article).
// Grouped by GUIDE_COPY's `group` label where known (matching today's site's labeled sub-sections,
// e.g. Getting Around's Daily Transport / Scenic Journeys / Day Trips & Excursions); guides with no
// GUIDE_COPY entry (the new stub guides) fall into a plain "Go Deeper" catch-all group.
function guidesToGroups(guides) {
    const groupsByLabel = new Map();
    guides.forEach(guide => {
        const copy = GUIDE_COPY[guide.slug] || {};
        const label = copy.group || 'Go Deeper';
        if (!groupsByLabel.has(label)) groupsByLabel.set(label, []);
        groupsByLabel.get(label).push({
            name: guide.title, description: copy.description || '', href: `../${guide.site_path}`,
            image: copy.image || null
        });
    });
    return Array.from(groupsByLabel, ([label, items]) => ({ label, items }));
}

// Per-platform editorial copy the DB doesn't model — `features` (2-4 short, concrete, independently
// verifiable facts) renders as a checkmarked list so a card reads at a glance rather than as a
// paragraph to parse; `description` is kept only as a fallback for a platform not yet given real
// facts. `highlight: true` is reserved for a platform that's a genuine, defensible best pick among
// real alternatives shown on the same node — deliberately NOT set on any entry below, since every
// live comparison right now is either a single platform (nothing to compare against) or a real,
// roughly-even tradeoff (e.g. AirHelp vs. Compensair: speed vs. potential payout size, see
// 6-compensair.md's comparison table in paypal-poc) — set it only when a future addition creates an
// honest, one-sided case, not by default. `offer` is deliberately NOT used here — see the comment
// above renderPlatforms() in app-mode.js: it must only ever hold a verified CUSTOMER-facing promo (a
// real discount/code), never our own affiliate commission rate, and none of the platforms below have
// a confirmed customer-facing promo on file yet. A platform with no entry here still renders — just
// with no features/description, same as before this map existed.
const PLATFORM_COPY = {
    'Klook': {
        features: [
            'Real-time availability, not a static listing',
            'Covers tours, activities, and stays across the South Coast',
            'Book straight from search results, no separate account needed'
        ]
    },
    'Kiwitaxi': {
        features: [
            'Fixed price agreed before you fly — no haggling on arrival',
            'Licensed driver meets you in arrivals, not a generic ride-hail',
            'Dedicated South Coast route, not a one-size quote'
        ],
        cta: 'See Fixed Prices'
    },
    'BikesBooking.com': {
        features: [
            'Compares 950+ rental companies at once',
            '50,000+ vehicles worldwide, not just local operators',
            'Hotel delivery available — not limited to what\'s parked outside'
        ],
        cta: 'Compare Rentals'
    },
    'Airalo': {
        features: [
            'Install before you fly, connected the moment you land',
            'Mobitel (unlimited data) or Hutch (data + calls) — real Sri Lanka networks',
            'No physical SIM, no airport counter queue'
        ],
        cta: 'Compare eSIM Plans'
    },
    'Aviasales': {
        features: [
            'Searches across agencies and airlines at once',
            'Price-drop alerts on routes you\'re watching',
            'No markup added on top of the fare shown'
        ],
        cta: 'Search Flights'
    },
    'AirHelp': {
        features: [
            'No win, no fee — free to file a claim',
            'Covers delays, cancellations, and overbooking',
            'Claims typically take 3–6 months to resolve'
        ],
        cta: 'Check Your Claim'
    },
    'Compensair': {
        features: [
            'No win, no fee — same claim basis as AirHelp',
            'Application accepted or declined within ~30 days',
            'Faster certainty, in exchange for a potentially smaller payout than AirHelp on a successful claim'
        ],
        cta: 'Check Your Claim'
    }
};

// Layer 3 "platform" cards come from products with a real link — missing/placeholder products are
// deliberately omitted (no fake "coming soon" card), matching the existing site convention. This
// section compares PLATFORMS, not individual products — a sector with several experiences all booked
// through the same platform (e.g. Tours & Activities: whale watching, Galle Fort, Yala, and surf
// lessons are all Klook today) must render that platform once, not once per experience, or it reads
// as duplicate cards. De-duped by platform name; the first live product found for a given platform
// wins the card's link (representing the platform generically for this sector, not any one specific
// booking) — this stays correct once a real second platform (Viator, GetYourGuide, etc.) is added
// for one of these experiences, since it'll then show as its own distinct card alongside Klook's.
function productsToPlatforms(categoryIds, tree) {
    const seen = new Map();
    categoryIds.forEach(catId => {
        (tree.productsByCategory.get(catId) || []).forEach(p => {
            if ((p.status === 'live_direct' || p.status === 'live_generic') && p.link_url) {
                const name = p.platform || p.name;
                if (!seen.has(name)) seen.set(name, p);
            }
        });
    });
    return Array.from(seen, ([name, p]) => {
        const copy = PLATFORM_COPY[name] || {};
        return {
            name, description: copy.description || '', features: copy.features || null,
            highlight: copy.highlight || false, offer: null, link: p.link_url,
            cta: copy.cta || 'Check Offers & Prices'
        };
    });
}

export async function loadTripPlanner() {
    const tree = await fetchTree();
    const bySlug = new Map(tree.sectors.map(s => [s.slug, s]));

    const nodes = {};
    SECTOR_ORDER.forEach(slug => {
        const sector = bySlug.get(slug);
        const copy = SECTOR_COPY[slug] || {};
        const sectorGuides = sector ? (tree.guidesBySector.get(sector.id) || []) : [];

        const groups = guidesToGroups(sectorGuides);

        const allCategoryIds = sectorGuides.flatMap(g => (tree.categoriesByGuide.get(g.id) || []).map(c => c.id));
        const platforms = productsToPlatforms(allCategoryIds, tree);

        nodes[slug] = {
            id: slug,
            label: SECTOR_LABELS[slug],
            icon: copy.icon,
            blurb: copy.blurb,
            image: copy.image,
            general: { intro: copy.intro || '', readMore: copy.readMore || [] },
            map: copy.map || null,
            recommendations: {
                // Where to Stay's 4 type-guides are real DB rows now, but their categories have no
                // seeded products yet (22 real properties still need re-sorting — see
                // .claude/memory/project_affiliate_db_schema_and_design_first.md). Keep this sector
                // rendering from config.sections.rooms (today's 5 real location pages) until that
                // sorting happens; switch it over to `groups` once Where to Stay's products are
                // seeded, matching every other sector.
                source: slug === 'where-to-stay' ? 'rooms' : null,
                groups,
                radar: []
            },
            platforms,
            nextUp: (copy.nextUp || []).map(n => ({
                id: n.id, label: SECTOR_LABELS[n.id], icon: (SECTOR_COPY[n.id] || {}).icon, blurb: n.blurb
            })),
            ctaLabel: copy.ctaLabel
        };
    });

    return { title: 'Plan Your Trip', subtitle: 'Tap a topic — flights, transport, insurance, and more — to see real options for the South Coast.', order: SECTOR_ORDER, nodes };
}

// Lightweight id/label/icon list for quick-launcher.js, which never needs guide/category/product
// detail — avoids that module paying for the full tree fetch just to render a drawer list.
export async function loadTopicList() {
    const tree = await fetchTree();
    return tree.sectors.map(s => ({ id: s.slug, label: SECTOR_LABELS[s.slug], icon: (SECTOR_COPY[s.slug] || {}).icon }));
}
