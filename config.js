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
        whatsapp: "+94718109695",
        email: "shane@dolblathanna.com",
        phone: "+94912284033",
        address: "Dolblathanna, Panchaliya, Ahangama, Sri Lanka",
        social: {
            facebook: "https://web.facebook.com/dolblathanna.srilanka/",
            instagram: "https://www.instagram.com/dolblathanna_srilanka",
            tiktok: "https://www.tiktok.com/@dolblathanna_srilanka"
        }
    },
    map: {
        center: { lat: 6.0039846, lng: 80.3814394 },
        zoom: 17,
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.932665226036!2d80.37656847731081!3d6.00398457846212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae16b5f8507d28d%3A0x237ea669d62e9816!2sDolblathanna!5e0!3m2!1sen!2slk!4v1774159797376!5m2!1sen!2slk"
    },
    sections: {
        hero: {
            title: "Your Local Guide to the South Coast",
            subtitle: "Real recommendations for exploring Sri Lanka's South Coast — from Hikkaduwa to Tangalle."
        },
        // These are curated recommendations across the South Coast region, not Dolblathanna's own
        // inventory. Dolblathanna is not currently taking bookings (see About blurb on the homepage).
        // Each entry gets an affiliate placeholder comment next to it — wire in a real link/tracking
        // ID only once a specific affiliate program is approved.
        rooms: [
            {
                id: 1,
                name: "Boutique Beach Stay, Mirissa",
                location: "Mirissa",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
                description: "Small, design-led guesthouses a short walk from Mirissa's curved beach — good for couples who want boutique comfort near the harbour and whale-watching boats.",
                link: "#" // AFFILIATE LINK PLACEHOLDER: Booking.com property in Mirissa
            },
            {
                id: 2,
                name: "Surf Camp, Weligama",
                location: "Weligama",
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
                description: "Bunk or private-room surf camps right on Weligama Bay's beginner-friendly break — boards, lessons, and a built-in crowd of fellow travellers included.",
                link: "#" // AFFILIATE LINK PLACEHOLDER: surf camp booking partner in Weligama
            },
            {
                id: 3,
                name: "Heritage Stay, Galle Fort",
                location: "Galle Fort",
                image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200",
                description: "Restored Dutch-colonial townhouses inside the fort walls — cobbled lanes, rampart sunsets, and a completely different pace from the beach towns nearby.",
                link: "#" // AFFILIATE LINK PLACEHOLDER: Booking.com / Agoda property in Galle Fort
            },
            {
                id: 4,
                name: "Beachfront Escape, Tangalle",
                location: "Tangalle",
                image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
                description: "Quieter, wilder beaches an hour east of Ahangama — the pick for travellers who want space, fewer crowds, and long empty-sand walks.",
                link: "#" // AFFILIATE LINK PLACEHOLDER: Booking.com property in Tangalle
            },
            {
                id: 5,
                name: "Guesthouses in Ahangama",
                location: "Ahangama",
                image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1200",
                description: "Our own home base — a mellow surf town with a dense strip of cafes, board rentals, and guesthouses. See our guides for what we actually recommend here.",
                link: "./guides/index.html" // Internal link for now; AFFILIATE LINK PLACEHOLDER: Ahangama guesthouse booking partner (once approved, may replace internal link)
            }
        ],
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
