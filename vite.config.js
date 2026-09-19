import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Set the base to '/' for custom domains,
  // or '/repo-name/' for github.io domains.
  // Use relative base for asset paths to support subpaths
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        guidesIndex: resolve(__dirname, 'guides/index.html'),
        guideSurf: resolve(__dirname, 'guides/best-time-to-surf-ahangama.html'),
        guideGettingAround: resolve(__dirname, 'guides/getting-around-ahangama.html'),
        guideBeaches: resolve(__dirname, 'guides/top-beaches-near-ahangama.html'),
        guideDayTrips: resolve(__dirname, 'guides/ahangama-day-trip-guide.html'),
        guidePacking: resolve(__dirname, 'guides/sri-lanka-beach-packing-guide.html'),
        guideVsWeligama: resolve(__dirname, 'guides/ahangama-vs-weligama.html'),
        guideCafes: resolve(__dirname, 'guides/best-cafes-restaurants-ahangama.html'),
        guideInsurance: resolve(__dirname, 'guides/sri-lanka-travel-insurance-guide.html'),
        guideGalleFort: resolve(__dirname, 'guides/galle-fort-travel-guide.html'),
        guideMirissaWhales: resolve(__dirname, 'guides/mirissa-whale-watching-guide.html'),
        guideWeligamaNomad: resolve(__dirname, 'guides/weligama-surf-digital-nomad-guide.html'),
        guideCoastalTrain: resolve(__dirname, 'guides/coastal-train-galle-matara.html'),
        guideYalaSafari: resolve(__dirname, 'guides/yala-safari-guide.html'),
        // Where to Stay: 7 type pages (guide + category collapsed into one DB-driven page each —
        // see stay-data-loader.js/stay-page.js), replacing the old 5 town-first static pages
        // (2026-09-19 restructure, tools/supabase/seed-18-where-to-stay-type-restructure.sql).
        stayGuestHouse: resolve(__dirname, 'stay/guest-house.html'),
        stayHostel: resolve(__dirname, 'stay/hostel.html'),
        staySurfCamp: resolve(__dirname, 'stay/surf-camp.html'),
        stayHeritageStay: resolve(__dirname, 'stay/heritage-stay.html'),
        stayBoutiqueHotel: resolve(__dirname, 'stay/boutique-hotel.html'),
        stayVilla: resolve(__dirname, 'stay/villa.html'),
        stayResort: resolve(__dirname, 'stay/resort.html'),
        productYalaSafari: resolve(__dirname, 'products/yala-safari.html'),
        productMirissaWhales: resolve(__dirname, 'products/mirissa-whale-watching.html'),
        productGalleFort: resolve(__dirname, 'products/galle-fort-tours.html'),
        productWeligamaSurf: resolve(__dirname, 'products/weligama-surf-lessons.html'),
        productAirportTransfer: resolve(__dirname, 'products/colombo-airport-transfer.html'),
        // Stub pages — see tools/supabase/seed-13-stub-site-paths.sql (paypal-poc repo) for the DB
        // rows these fill in; generated as "coming soon" placeholders so site structure matches the
        // Supabase DB in full. Real content for these lands later, one at a time.
        guideGuestHouse: resolve(__dirname, 'guides/guest-house.html'),
        guideHostel: resolve(__dirname, 'guides/hostel.html'),
        guideSurfCamp: resolve(__dirname, 'guides/surf-camp.html'),
        guideHeritageStay: resolve(__dirname, 'guides/heritage-stay.html'),
        guideBoutiqueHotel: resolve(__dirname, 'guides/boutique-hotel.html'),
        guideVilla: resolve(__dirname, 'guides/villa.html'),
        guideResort: resolve(__dirname, 'guides/resort.html'),
        guideFlightBooking: resolve(__dirname, 'guides/flight-booking.html'),
        guideFlightCompensation: resolve(__dirname, 'guides/flight-compensation.html'),
        guideAirportTransferGuide: resolve(__dirname, 'guides/airport-transfer-guide.html'),
        guideEsimMobileData: resolve(__dirname, 'guides/esim-mobile-data.html'),
        guideRemoteWorkConnectivity: resolve(__dirname, 'guides/remote-work-connectivity.html'),
        guideMoneyCurrency: resolve(__dirname, 'guides/money-currency-guide.html'),
        guideSafetyEmergencies: resolve(__dirname, 'guides/safety-emergencies-guide.html'),
        productFlightBookingCat: resolve(__dirname, 'products/flight-booking-cat.html'),
        productFlightCompensationCat: resolve(__dirname, 'products/flight-compensation-cat.html'),
        productEsimMobileDataCat: resolve(__dirname, 'products/esim-mobile-data-cat.html'),
        productWifiVpn: resolve(__dirname, 'products/wifi-vpn.html'),
        productDailyTransport: resolve(__dirname, 'products/daily-transport.html'),
        productCoastalTrainTickets: resolve(__dirname, 'products/coastal-train-tickets.html'),
        productDayTripOptions: resolve(__dirname, 'products/day-trip-options.html'),
        productVillageLocalFoodSpots: resolve(__dirname, 'products/village-local-food-spots.html'),
        productTravelInsuranceCat: resolve(__dirname, 'products/travel-insurance-cat.html'),
        productCurrencyExchangeAtm: resolve(__dirname, 'products/currency-exchange-atm.html'),
        productEssentialTravelGear: resolve(__dirname, 'products/essential-travel-gear.html'),
        productMedicalEmergencyContacts: resolve(__dirname, 'products/medical-emergency-contacts.html'),
      },
    },
  },
});
