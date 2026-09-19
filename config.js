export const config = {
    brand: {
        name: "Dolblathanna",
        tagline: "The Golden Valley of Flowers",
        logo: "./brand/logo.png",
        colors: {
            primary: "#C5A059",
            background: "#121212",
            accent: "#A0522D",
            secondary: "#1B3022"
        }
    },
    contact: {
        social: {
            facebook: "https://web.facebook.com/dolblathanna.srilanka/",
            instagram: "https://www.instagram.com/dolblathanna_srilanka",
            tiktok: "https://www.tiktok.com/@dolblathanna_srilanka"
        }
    },
    sections: {
        // Hero content is now driven by data-loader.js's loadTripPlanner() (the interactive
        // "Plan Your Trip" grid, fetched live from Supabase) — see title/subtitle there instead.
        // Where to Stay's homepage cards used to come from a hand-picked `rooms` array here (5
        // town-first cards); removed 2026-09-19 once the Supabase DB had all 7 real type-guides
        // seeded — see tools/supabase/seed-18-where-to-stay-type-restructure.sql. Where to Stay
        // now renders through `groups` (data-loader.js) same as every other sector.
        //
        // Recommended ways to get around the region — not an owned fleet. Affiliate placeholders
        // per entry, same rule as rooms above.
        rentals: {
            title: "Getting Around Down South",
            subtitle: "How to actually move between the beach towns — from tuk-tuks to the coastal train.",
            vehicles: [
                {
                    type: "Scooter Rental",
                    icon: "🛵",
                    description: "The most flexible way to hop between beaches and cafes on your own schedule — widely available for short or multi-day hire.",
                    link: "#" // AFFILIATE LINK PLACEHOLDER: scooter rental partner, South Coast
                },
                {
                    type: "Tuk-Tuk Hire",
                    icon: "🛺",
                    description: "The classic Sri Lankan way to travel — easy to flag down, or hire by the day with a driver who knows the back roads.",
                    link: "#" // AFFILIATE LINK PLACEHOLDER: tuk-tuk hire / driver partner, South Coast
                },
                {
                    type: "Private Driver / Van",
                    icon: "🚐",
                    description: "Best for groups, luggage, or longer trips like Galle Fort or Yala — door-to-door without the transfers.",
                    link: "#" // AFFILIATE LINK PLACEHOLDER: private driver / van booking partner
                },
                {
                    type: "Coastal Train (Galle–Matara)",
                    icon: "🚆",
                    description: "One of Sri Lanka's great budget experiences — open doorways, ocean views the whole way, and a fraction of the cost of a taxi.",
                    link: "./guides/coastal-train-galle-matara.html"
                }
            ]
        }
    }
};
