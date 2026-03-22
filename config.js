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
            title: "Welcome to Dolblathanna",
            subtitle: "Experience the magic of Ahangama in a valley of luxury."
        },
        rooms: [
            { id: 1, name: "Deluxe Suite", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200", description: "Coastal luxury with modern amenities." },
            { id: 2, name: "Garden Villa", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200", description: "Elegant comfort tailored for your stay." },
            { id: 3, name: "Ocean Breeze", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200", description: "Wake up to the sound of the waves." },
            { id: 4, name: "Sunset Loft", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200", description: "Perfect for long stays and digital nomads." },
            { id: 5, name: "Royal Hibiscus", image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&q=80&w=1200", description: "Our most exclusive experience." }
        ],
        rentals: {
            title: "Explore Ahangama",
            subtitle: "Seamless vehicle rentals for your local discoveries.",
            vehicles: [
                { type: "Luxury Scout", icon: "🛵", description: "High-end scooters for two." },
                { type: "Safari Tuk-Tuk", icon: "🛺", description: "The classic Sri Lankan way to travel." },
                { type: "Elite Van", icon: "🚐", description: "Spacious transport for groups." }
            ]
        }
    }
};
