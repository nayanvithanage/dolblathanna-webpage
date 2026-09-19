// Loads one Where to Stay type-guide's properties from Supabase (7 guides: guest-house, hostel,
// surf-camp, heritage-stay, boutique-hotel, villa, resort — see
// 3-milestones/2-milestone-1-sprint-2/3-affiliate-db-design.md section 2, paypal-poc repo).
//
// Structure: one category per type-guide (created by seed-18), holding all of that type's real
// properties directly — no per-property product page (impractical at 23+ properties). Each product
// can have several real platform links (Klook/Booking.com/Agoda) in the product_links child table;
// this loader fetches both and merges them, so a page never needs its own Supabase query logic.
//
// Town (products.location_tag) is a client-side filter attribute here, not a separate page — a
// visitor picks a TYPE (this page) first, then narrows by town within it.
import { supabase } from '../supabase-client.js';

// PLATFORM_LABEL: what a CTA button says. Anything not listed falls back to `View on <platform>`.
const PLATFORM_LABEL = {
    'Klook': 'View on Klook',
    'Booking.com': 'View on Booking.com',
    'Agoda': 'View on Agoda'
};

/**
 * Fetches one stay guide's category + all its products + each product's platform links.
 * @param {string} guideSlug - e.g. 'guest-house', 'hostel', 'surf-camp', 'heritage-stay',
 *   'boutique-hotel', 'villa', 'resort'
 * @returns {Promise<{guideTitle: string, categoryTitle: string, properties: Array}>}
 */
export async function loadStayCategory(guideSlug) {
    const { data: guide, error: guideErr } = await supabase
        .from('guides').select('id, title').eq('slug', guideSlug).single();
    if (guideErr) throw guideErr;

    const { data: categories, error: catErr } = await supabase
        .from('categories').select('id, title').eq('guide_id', guide.id);
    if (catErr) throw catErr;
    const category = categories[0]; // one category per type-guide, by design (see seed-18)

    const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('id, name, rating, rating_source, review_count, summary, location_tag, image')
        .eq('category_id', category.id);
    if (prodErr) throw prodErr;

    const productIds = products.map(p => p.id);
    const { data: links, error: linksErr } = productIds.length
        ? await supabase.from('product_links').select('product_id, platform, link_url, status, sort_order')
            .in('product_id', productIds).order('sort_order')
        : { data: [], error: null };
    if (linksErr) throw linksErr;

    const linksByProduct = new Map();
    links.forEach(l => {
        if (!l.link_url) return; // a row with no real URL yet renders no button, same site convention as before
        if (!linksByProduct.has(l.product_id)) linksByProduct.set(l.product_id, []);
        linksByProduct.get(l.product_id).push({
            platform: l.platform, url: l.link_url, status: l.status,
            label: PLATFORM_LABEL[l.platform] || `View on ${l.platform}`
        });
    });

    const properties = products.map(p => ({
        id: p.id, name: p.name, location: p.location_tag,
        rating: p.rating, reviewCount: p.review_count, summary: p.summary,
        // image is a site-relative path (e.g. 'stays/guest-house/coco-bliss-ahangama.webp') served
        // from dolblathanna-webpage's own public/ folder — never an external hotlinked URL, see
        // products.image's column comment in tools/supabase/schema.sql (paypal-poc repo) for why.
        // '../' prefix because stay/*.html pages sit one directory below the site root.
        image: p.image ? `../${p.image}` : null,
        links: linksByProduct.get(p.id) || []
    })).sort((a, b) => a.name.localeCompare(b.name));

    return { guideTitle: guide.title, categoryTitle: category ? category.title : guide.title, properties };
}

// Distinct real towns present in a property list, in the site's standard South Coast order —
// drives the filter chips. A town with zero properties for this type never renders a chip.
const TOWN_ORDER = ['ahangama', 'mirissa', 'weligama', 'galle-fort', 'tangalle'];
const TOWN_LABEL = {
    'ahangama': 'Ahangama', 'mirissa': 'Mirissa', 'weligama': 'Weligama',
    'galle-fort': 'Galle Fort', 'tangalle': 'Tangalle'
};
export function townsPresent(properties) {
    const present = new Set(properties.map(p => p.location));
    return TOWN_ORDER.filter(t => present.has(t)).map(t => ({ id: t, label: TOWN_LABEL[t] }));
}
