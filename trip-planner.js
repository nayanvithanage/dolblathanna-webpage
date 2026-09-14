// Trip planner data: the 11 real needs a South Coast Sri Lanka trip creates, plus whatever real
// content/options exist for each one today. Sibling to config.js, same convention (plain object, no
// logic) with one exception: "where-to-stay" is a deliberate special case — its
// recommendations.source is 'rooms', which app-mode.js reads as a signal to render
// config.sections.rooms directly instead of a local groups array, to avoid duplicating that data in
// two places (see config.js's own comment on sections.rooms).
//
// Node shape (every one of the 11 nodes below follows this exactly):
//   {
//     id, label, icon, blurb, image,
//     general: { intro, readMore: [{label, href}] },   // Layer 1 — real narrative copy, always
//     map: null | { center:[lat,lng], zoom, places:[{name,lat,lng,note}] },  // optional, getting-around only for now
//     recommendations: { source: null|'rooms', groups: [{label, items:[{name,description,href,image}]}], radar: [] },  // Layer 2
//     platforms: [{name, description, offer, link, cta}],   // Layer 3 — link/cta null if not live yet, no "coming soon" styling
//     nextUp: [{id, label, icon, blurb}],   // Layer 4
//     ctaLabel?: string   // overrides the generic Layer-3 heading, e.g. "Book Your Transport"
//   }
//
// order is the single source of the 11 topics' identity/sequence — the timeline renders
// order.map(id => nodes[id]), so there is exactly one place (not two, like the old mockup's
// separate `nodes`/`allTopics` arrays) that can drift out of sync with itself.
export const tripPlanner = {
    title: "Plan Your Trip",
    subtitle: "Tap a topic — flights, transport, insurance, and more — to see real options for the South Coast.",
    order: [
        'flights', 'airport-transfer', 'staying-connected', 'where-to-stay', 'getting-around',
        'tours-activities', 'food', 'travel-insurance', 'money-currency', 'packing', 'safety'
    ],
    nodes: {
        flights: {
            id: 'flights', label: 'Flights', icon: '✈️', blurb: 'Getting to Sri Lanka in the first place.',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "Getting to Sri Lanka in the first place is its own small planning task, and it's worth doing right before anything else — a bad connection or an awkward arrival time can throw off the first day or two of a trip that took months to plan. This is the one piece of the puzzle that starts before you even land: where you fly into, when, and how that first day unfolds once you touch down.",
                readMore: []
            },
            map: null,
            recommendations: { source: null, groups: [], radar: [] },
            platforms: [],
            nextUp: [{ id: 'airport-transfer', label: 'Airport Transfer', icon: '🚐', blurb: "Landed — now get from Bandaranaike International to the coast." }]
        },
        'airport-transfer': {
            id: 'airport-transfer', label: 'Airport Transfer', icon: '🚐', blurb: 'From Bandaranaike International to the South Coast.',
            image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "Bandaranaike International sits well north of the South Coast, and the drive down — 2.5 to 3 hours depending on traffic — is most visitors' first real taste of Sri Lankan roads. It's not a leg to wing on arrival: sorting a transfer in advance means a driver is actually there waiting for you, not something you're negotiating for at 11pm after a long flight. Here's how to get that first stretch right.",
                readMore: []
            },
            map: null,
            recommendations: { source: null, groups: [], radar: [] },
            platforms: [
                { name: 'Klook', description: 'Compare Colombo airport transfer options and book a driver before you land instead of negotiating on arrival.', offer: null, link: 'https://klook.tpx.lv/jxCzf4uN', cta: 'Check Offers & Prices' }
            ],
            nextUp: [{ id: 'staying-connected', label: 'Staying Connected', icon: '📶', blurb: 'Sort your SIM or eSIM before you need to look something up.' }],
            ctaLabel: 'Book Your Transfer'
        },
        'staying-connected': {
            id: 'staying-connected', label: 'Staying Connected', icon: '📶', blurb: 'eSIM and mobile data for your trip.',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "A local SIM or eSIM is one of the first things worth sorting once you land — for maps, for translating a menu, for messaging home, and for just being able to look something up when a plan changes on the fly (which, on this coast, it often will). Here's what to know before you land.",
                readMore: []
            },
            map: null,
            recommendations: { source: null, groups: [], radar: [] },
            platforms: [],
            nextUp: [{ id: 'where-to-stay', label: 'Where to Stay', icon: '🏡', blurb: 'Connected and ready — now pick a base for your trip.' }]
        },
        'where-to-stay': {
            id: 'where-to-stay', label: 'Where to Stay', icon: '🏡', blurb: 'Real, verified places across the South Coast towns.',
            image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "The South Coast isn't one place — it's a string of towns with genuinely different personalities, from Ahangama's mellow surf-town pace to Galle Fort's cobbled colonial lanes to Tangalle's quieter, wilder beaches further east. Where you base yourself shapes the whole trip more than almost any other decision, so it's worth choosing on purpose rather than by default.",
                readMore: [{ label: 'Ahangama vs. Weligama: Where to Stay', href: '../guides/ahangama-vs-weligama.html' }]
            },
            map: null,
            recommendations: { source: 'rooms', groups: [], radar: [] },
            platforms: [
                { name: 'Booking.com', description: 'The widest selection of verified guesthouses and hotels across the South Coast.', offer: null, link: null, cta: null }
            ],
            nextUp: [{ id: 'getting-around', label: 'Getting Around', icon: '🛺', blurb: 'Once you’ve picked a base, work out how to move between towns.' }],
            ctaLabel: 'Book Your Stay'
        },
        'getting-around': {
            id: 'getting-around', label: 'Getting Around', icon: '🛺', blurb: 'Tuk-tuks, scooters, vans, and trains between towns.',
            image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
            // Layer 1 — General Guide: intriguing, "dig deeper" tone, teases what's below rather than
            // front-loading platform/price detail. Written like the existing 13 guides.
            general: {
                intro: "The South Coast looks small on a map — a string of beach towns you could trace with a finger in under a minute. On the ground it moves at its own pace entirely. Some visitors get around on the back of a tuk-tuk with the wind in their face; others catch the coastal train with the doors wide open and the ocean close enough to touch; others still hand the whole thing to a driver and watch it go by from the back seat. There's no one right way to move through this coast — only the way that fits the trip you're actually having. Here's how to figure out which one that is, what it costs, and a couple of real promotions worth knowing about before you book anything.",
                readMore: []
            },
            // Map — real, verified coordinates (OpenStreetMap Nominatim lookups, 2026-09-14), one pin
            // per place already named in this topic's guide content below. Locked (no drag/scroll/
            // zoom) — reads as a fixed graphic, not an interactive widget.
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
            // Layer 2 — Go Deeper: entry-point cards into this topic's own sub-guides, grouped under
            // labeled sub-categories rather than one flat row.
            recommendations: {
                source: null,
                groups: [
                    {
                        label: 'Daily Transport',
                        items: [
                            { name: 'Getting Around Ahangama', description: 'Tuk-tuks, scooters, and private vans — the full breakdown of costs, what to rent, and our honest recommendation.', href: '../guides/getting-around-ahangama.html', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=600' }
                        ]
                    },
                    {
                        label: 'Scenic Journeys',
                        items: [
                            { name: 'The Galle–Matara Coastal Train', description: 'One of the great budget travel experiences on this coast — open doors, ocean views, and how to actually ride it.', href: '../guides/coastal-train-galle-matara.html', image: 'https://images.unsplash.com/photo-1781749809764-b8f3e740dbe5?auto=format&fit=crop&q=80&w=600' }
                        ]
                    },
                    {
                        label: 'Day Trips & Excursions',
                        items: [
                            { name: 'Ahangama Day Trip Guide', description: "Galle Fort, Koggala Lake, Yala safari — what's realistic as a day trip and how to get there.", href: '../guides/ahangama-day-trip-guide.html', image: 'https://images.unsplash.com/photo-1778563623975-582b7723d026?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Yala Safari Guide', description: 'Leopard density, best season, drive time, and entry fees — everything to plan a Yala day from Ahangama.', href: '../guides/yala-safari-guide.html', image: 'https://images.unsplash.com/photo-1566708627877-859df13ae63e?auto=format&fit=crop&q=80&w=600' }
                        ]
                    }
                ],
                radar: []
            },
            // Layer 3 — Compare Platforms: scrollable comparison cards. Kiwitaxi/Welcome Pickups have
            // no link yet (not verified) — rendered as ordinary-looking cards, no "coming soon" badge.
            // IMPORTANT — no discount/offer copy unless it's a verified CUSTOMER-facing promo. The
            // 9-11% / 8-9% / 10% numbers in the platform-rules docs are OUR affiliate commission, not
            // something a traveler is offered — never surface those as a customer discount.
            platforms: [
                { name: 'Klook', description: 'Compare Colombo airport transfer options and book a driver before you land instead of negotiating on arrival.', offer: null, link: 'https://klook.tpx.lv/jxCzf4uN', cta: 'Check Offers & Prices' },
                { name: 'Kiwitaxi', description: 'A dedicated airport-transfer service covering pickups across Sri Lanka, including the South Coast route from Colombo.', offer: null, link: null, cta: null },
                { name: 'Welcome Pickups', description: 'Pre-booked, English-speaking drivers who track your flight and meet you at arrivals.', offer: null, link: null, cta: null }
            ],
            nextUp: [
                { id: 'tours-activities', label: 'Tours & Activities', icon: '🎟️', blurb: 'Now that you can get there — whale watching, Galle Fort, and surf lessons.' },
                { id: 'where-to-stay', label: 'Where to Stay', icon: '🏡', blurb: 'Pick a base that puts you close to the transport options you just compared.' }
            ],
            ctaLabel: 'Book Your Transport'
        },
        'tours-activities': {
            id: 'tours-activities', label: 'Tours & Activities', icon: '🎟️', blurb: 'Whale watching, Galle Fort, surf lessons, and more.',
            image: 'https://images.unsplash.com/photo-1566393009478-ef02c54530a7?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "This is where the South Coast actually shows off — whale watching out of Mirissa's harbour, the ramparts and old streets of Galle Fort, a first surf lesson on Weligama's famously forgiving break. None of it needs to be rushed or overplanned, but the good operators do fill up, especially in season, so it's worth knowing what's actually on offer before you're standing on a beach trying to decide.",
                readMore: []
            },
            map: null,
            recommendations: {
                source: null,
                groups: [
                    {
                        label: 'Real Experiences',
                        items: [
                            { name: 'Mirissa Whale Watching Guide', description: 'Season, boat choice, seasickness, and what you’ll actually see on a whale watching trip out of Mirissa harbour.', href: '../guides/mirissa-whale-watching-guide.html', image: 'https://images.unsplash.com/photo-1566393009478-ef02c54530a7?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Galle Fort Travel Guide', description: 'History, what to see, and how to plan a half-day or full-day trip to Sri Lanka’s best-preserved colonial fort.', href: '../guides/galle-fort-travel-guide.html', image: 'https://images.unsplash.com/photo-1748491829000-a88e5028e209?auto=format&fit=crop&q=80&w=600' },
                            { name: 'Yala Safari Guide', description: 'Leopard density, best season, drive time, and what a Yala day actually looks like — plan it right before you book.', href: '../guides/yala-safari-guide.html', image: 'https://images.unsplash.com/photo-1621847473222-d85c022cbf07?auto=format&fit=crop&q=80&w=600' }
                        ]
                    }
                ],
                radar: []
            },
            platforms: [
                { name: 'Klook', description: 'Whale watching, Galle Fort tours, and surf lessons — compare real options and book ahead.', offer: null, link: 'https://klook.tpx.lv/AxDn8kVD', cta: 'Check Offers & Prices' }
            ],
            nextUp: [{ id: 'food', label: 'Food', icon: '🍛', blurb: 'Refuel after a full day out.' }],
            ctaLabel: 'Book Your Experience'
        },
        food: {
            id: 'food', label: 'Food', icon: '🍛', blurb: 'Where we actually eat around Ahangama.',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "Ahangama's food scene runs the full range — beachfront rice-and-curry shacks that have fed the same regulars for years, and the flat-white cafes that have grown up around the surf crowd. You won't go hungry or broke either way; the only real decision is which kind of meal fits which kind of day.",
                readMore: []
            },
            map: null,
            recommendations: {
                source: null,
                groups: [
                    {
                        label: 'Where We Eat',
                        items: [
                            { name: 'Best Cafes & Restaurants in Ahangama', description: 'Every price range covered — updated by the Dolblathanna team.', href: '../guides/best-cafes-restaurants-ahangama.html', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600' }
                        ]
                    }
                ],
                radar: []
            },
            platforms: [],
            nextUp: [{ id: 'travel-insurance', label: 'Travel Insurance', icon: '🩹', blurb: 'Check the fine print before something goes wrong.' }]
        },
        'travel-insurance': {
            id: 'travel-insurance', label: 'Travel Insurance', icon: '🩹', blurb: 'What to check before you fly.',
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "Sri Lanka is generally an easy, safe place to travel, but surf, scooters, and the odd stomach bug all make travel insurance worth actually reading the fine print on rather than ticking a box. What matters most is whether a policy genuinely covers the things you're likely to be doing here, not just the standard baseline.",
                readMore: []
            },
            map: null,
            recommendations: {
                source: null,
                groups: [
                    {
                        label: 'Get Covered',
                        items: [
                            { name: 'Sri Lanka Travel Insurance Guide', description: 'Surf, scooter, and medical cover explained — what to check before you buy a policy.', href: '../guides/sri-lanka-travel-insurance-guide.html', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600' }
                        ]
                    }
                ],
                radar: []
            },
            platforms: [],
            nextUp: [{ id: 'money-currency', label: 'Money & Currency', icon: '💱', blurb: 'Sort cash and cards before you need either.' }]
        },
        'money-currency': {
            id: 'money-currency', label: 'Money & Currency', icon: '💱', blurb: 'ATMs, cards, and currency tips for Sri Lanka.',
            image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "Cash and cards both have their place here — some guesthouses and tuk-tuk drivers are cash-only, while bigger hotels and shops take cards without issue. ATMs are common enough in the bigger towns but sparser the further you get into quieter stretches of coast, so a little planning around when and where you'll need cash goes a long way.",
                readMore: []
            },
            map: null,
            recommendations: { source: null, groups: [], radar: [] },
            platforms: [],
            nextUp: [{ id: 'packing', label: 'Packing', icon: '🎒', blurb: 'What to actually bring for a South Coast beach trip.' }]
        },
        packing: {
            id: 'packing', label: 'Packing', icon: '🎒', blurb: 'What to actually bring for a South Coast beach trip.',
            image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "The South Coast's climate does most of the work deciding what's in your bag — hot, humid, and sun-heavy most of the year, with a few things (reef-safe sunscreen, modest cover-ups for temple visits) that are easy to forget until you actually need them. Pack light; you can buy almost anything you forget once you're here.",
                readMore: []
            },
            map: null,
            recommendations: {
                source: null,
                groups: [
                    {
                        label: 'What to Bring',
                        items: [
                            { name: 'Sri Lanka Beach Packing Guide', description: 'Climate, reef-safe sunscreen, plug types, and modest-dress essentials for temples.', href: '../guides/sri-lanka-beach-packing-guide.html', image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=600' }
                        ]
                    }
                ],
                radar: []
            },
            platforms: [],
            nextUp: [{ id: 'safety', label: 'Safety & Emergencies', icon: '🚑', blurb: 'What to know before something goes wrong.' }]
        },
        safety: {
            id: 'safety', label: 'Safety & Emergencies', icon: '🚑', blurb: 'What to know before something goes wrong.',
            image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=800',
            general: {
                intro: "Sri Lanka's South Coast is, on the whole, a relaxed and safe place to travel — but a little awareness goes a long way, whether that's water safety in unfamiliar surf, road sense around scooters and tuk-tuks, or just knowing who to call if something does go wrong. Here's what's actually worth knowing, not a list of things to be anxious about.",
                readMore: []
            },
            map: null,
            recommendations: { source: null, groups: [], radar: [] },
            platforms: [],
            nextUp: [{ id: 'flights', label: 'Flights', icon: '✈️', blurb: 'Start planning your trip from the top.' }]
        }
    }
};
