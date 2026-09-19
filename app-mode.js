// App mode — the full-screen "native app" trip-planner takeover, and the ENTIRE homepage now (not an
// optional overlay entered via a FAB — index.html's #app-mode loads with `.is-open` already present,
// so a visitor lands directly on the timeline, no tap required). A vertical timeline of the 11 real
// South Coast trip topics, drilling into each one's 4-layer content (General Guide / Go Deeper /
// Compare Platforms / Visitors Also Checked). Ported from the validated mockup at
// _preview/preview-timeline.html, wired to the real site's data (data-loader.js's live Supabase
// fetch, config.js) instead of the mockup's self-contained fake nodes/sampleRooms.
//
// Navigation model: real app-style FIXED LEVELS, not browser-history-based (matching content pages'
// DOLB_PARENT mechanism — see guides-shared/guide-nav.js). Every screen has exactly one parent,
// always the same regardless of how it was reached: Product -> Guide -> Topic -> Home. Inside app
// mode specifically, 'detail' and 'about' both have a fixed parent of 'timeline' — backInApp() and
// the popstate handler both just go straight there, they never try to reconstruct "whatever screen
// came before" from history. This was a deliberate fix: using history.back() here caused a real
// navigation loop, because a topic screen can be reached via several different paths (a timeline
// tap, a deep link from a content page, a Visitors-Also-Checked card) and back must go to the SAME
// place every time, not replay whichever path the browser's history stack happened to record.
//
// The URL hash (`#app=topic:<id>` / `#app=timeline` / `#app=about`) still updates on every screen
// change — purely for shareable/bookmarkable deep links (see initFromHash) and so a guide/product
// page's back-arrow can land straight on the right topic — but it no longer drives back-navigation
// decisions; pushHashState's `replace` vs. push distinction is now just "does this count as a new
// shareable URL," not "should Back be able to step through this."
import { config } from './config.js';
import { loadTripPlanner } from './data-loader.js';
import { mountQuickLauncher } from './guides-shared/quick-launcher.js';

// tripPlanner is fetched once from Supabase (data-loader.js) — the old static trip-planner.js file
// this used to import has been deleted (see .claude/memory/project_affiliate_db_schema_and_design_first.md
// in paypal-poc). Populated below, before renderTimeline()/initFromHash() run.
let tripPlanner = null;

// ---- Hash state read/write (deep-linking only — see navigation-model note above) ----------------

function readHashState() {
    const m = /^#app=(timeline|about|topic:([a-z0-9-]+))$/.exec(location.hash);
    if (!m) return null;
    if (m[1] === 'timeline') return { screen: 'timeline' };
    if (m[1] === 'about') return { screen: 'about' };
    return { screen: 'detail', topicId: m[2] };
}

function pushHashState(state, { replace = false } = {}) {
    const value = state.screen === 'detail' ? `topic:${state.topicId}` : state.screen;
    const method = replace ? 'replaceState' : 'pushState';
    history[method]({ appScreen: value }, '', `#app=${value}`);
}

// ---- Timeline (home screen) ----------------------------------------------------------------

function renderTimeline() {
    const c = document.getElementById('timeline-items');
    c.innerHTML = '';
    tripPlanner.order.forEach(id => {
        const t = tripPlanner.nodes[id];
        const el = document.createElement('div');
        el.className = 'timeline-item';
        el.innerHTML = `
            <div class="timeline-rail"><div class="timeline-node">${t.icon}</div></div>
            <div class="timeline-tile" style="background-image: url('${t.image}');">
                <div class="timeline-tile-content">
                    <div class="timeline-tile-text">
                        <span class="label">${t.label}</span>
                        <span class="blurb">${t.blurb}</span>
                    </div>
                    <span class="timeline-tile-arrow">›</span>
                </div>
            </div>
        `;
        // Every topic in tripPlanner.order is guaranteed a real (possibly sparse) entry in
        // tripPlanner.nodes — no silent fallback-to-another-topic here, unlike the original mockup.
        el.onclick = () => showTopic(t.id);
        c.appendChild(el);
    });
}

// ---- Topic map (locked Leaflet embed) ------------------------------------------------------

// Locked (no drag/scroll/zoom — reads as a fixed graphic) Leaflet embed shown right after Layer 1
// when a topic has `map.places`. Pins stay tappable for their popup note.
let activeMap = null;
function renderMap(node) {
    const section = document.getElementById('topic-map-section');
    if (!node.map || !node.map.places || node.map.places.length === 0) {
        section.style.display = 'none';
        return;
    }
    section.style.display = 'block';
    // Leaflet needs its container visible+sized before init, and re-init on an already-used div
    // throws — tear down any previous instance first.
    if (activeMap) { activeMap.remove(); activeMap = null; }
    const map = L.map('topic-map', {
        center: node.map.center, zoom: node.map.zoom,
        dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
        boxZoom: false, keyboard: false, zoomControl: false, touchZoom: false, tap: false
    });
    // MapTiler "darkmatter" style, real API key with origins locked to dolblathanna.com/localhost/
    // null (file://) in the MapTiler dashboard. Kept as a literal deliberately (not a Vite env var):
    // for a static site the key ships in the built JS bundle either way, so an env var buys no real
    // secrecy here — the origin-lock is the actual protection, and it's identical whichever way the
    // key reaches this file. Earlier attempts: OSM's main {s}.tile.openstreetmap.org server hard-403'd
    // (reserved for osm.org); CartoDB's free anonymous tiles got a watermarked "API KEY REQUIRED"
    // overlay once past their unregistered-usage threshold.
    const MAPTILER_KEY = 'w57vwKCetfXIZiPyMGu2';
    L.tileLayer(`https://api.maptiler.com/maps/darkmatter/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, {
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; OpenStreetMap contributors',
        maxZoom: 14
    }).addTo(map);
    const pinIcon = L.divIcon({ className: '', html: '<div class="leaflet-marker-pin"><span>📍</span></div>', iconSize: [26, 26], iconAnchor: [13, 26] });
    node.map.places.forEach(p => {
        L.marker([p.lat, p.lng], { icon: pinIcon }).addTo(map)
            .bindPopup(`<strong>${p.name}</strong><br>${p.note}`);
    });
    activeMap = map;
    // Force a resize pass once the container's real layout settles (it was display:none a moment
    // ago while hidden behind the timeline screen) — otherwise Leaflet renders the tile grid using a
    // stale 0-height measurement.
    setTimeout(() => map.invalidateSize(), 50);
}

// ---- Layer 1 — General Guide -----------------------------------------------------------------

function renderGeneral(node) {
    const c = document.getElementById('planner-general');
    c.innerHTML = node.general.intro ? `<p>${node.general.intro}</p>` : '';
    if (node.general.readMore.length > 0) {
        const list = document.createElement('ul');
        list.className = 'planner-readmore';
        node.general.readMore.forEach(r => { list.innerHTML += `<li><a href="${r.href}">📖 ${r.label}</a></li>`; });
        c.appendChild(list);
    }
}

// ---- Layer 2 — Go Deeper ------------------------------------------------------------------

// Entry-point cards into this topic's own full sub-guides, grouped under labeled sub-categories.
// Where to Stay's 7 type-guides (guest-house/hostel/surf-camp/heritage-stay/boutique-hotel/villa/
// resort) render through the same `groups` path as every other sector now — see
// data-loader.js's comment on `recommendations` and
// tools/supabase/seed-18-where-to-stay-type-restructure.sql. The old config.sections.rooms special
// case (5 hand-picked, town-first cards) is gone; config.js's `rooms` array is unused dead data as
// of this change and can be deleted.
// Deeper-card filter state (Individual/Package chips) — module-scoped like stay-page.js's
// activeTown, reset to 'all' each time a new topic renders (see showTopic -> renderRecommendations)
// so re-entering a topic always starts unfiltered rather than remembering a prior selection.
let activeDeeperFilter = 'all';

const DEEPER_FILTER_LABELS = { individual: 'Individual', package: 'Package' };

function renderDeeperFilterBar(groups) {
    const bar = document.getElementById('planner-filter-bar');
    // Only guides.type values actually present in this node drive the chip set — most sectors never
    // set `type` at all (null on every card), so this renders nothing for them, same as before.
    const typesPresent = new Set();
    groups.forEach(g => g.items.forEach(item => { if (item.type) typesPresent.add(item.type); }));
    if (typesPresent.size < 2) { bar.innerHTML = ''; return; } // nothing to filter with only 0-1 types
    const chips = ['all', ...Array.from(typesPresent)];
    bar.innerHTML = chips.map(t => {
        const label = t === 'all' ? 'All' : (DEEPER_FILTER_LABELS[t] || t);
        return `<button class="stay-filter-chip${t === activeDeeperFilter ? ' is-active' : ''}" data-filter="${t}">${label}</button>`;
    }).join('');
    bar.querySelectorAll('.stay-filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            activeDeeperFilter = btn.dataset.filter;
            renderDeeperFilterBar(groups);
            renderDeeperCards(groups);
        });
    });
}

function renderDeeperCards(groups) {
    const c = document.getElementById('planner-recommendations');
    c.innerHTML = '';
    groups.forEach(group => {
        const items = activeDeeperFilter === 'all'
            ? group.items
            : group.items.filter(r => r.type === activeDeeperFilter);
        if (items.length === 0) return; // whole group filtered out — skip its label too
        const groupEl = document.createElement('div');
        groupEl.className = 'deeper-group';
        let cardsHtml = '';
        items.forEach(r => {
            const bg = r.image ? ` style="background-image:url('${r.image}');"` : '';
            cardsHtml += `<a class="deeper-card"${bg} href="${r.href}">
                <div class="deeper-card-content">
                    <h3>${r.name}</h3>
                    <p>${r.description}</p>
                </div>
            </a>`;
        });
        groupEl.innerHTML = `<div class="deeper-group-label">${group.label}</div><div class="deeper-cards">${cardsHtml}</div>`;
        c.appendChild(groupEl);
    });
    if (c.innerHTML === '') {
        c.innerHTML = `<p class="no-recs-note">No ${DEEPER_FILTER_LABELS[activeDeeperFilter] || ''} experiences in this list yet.</p>`;
    }
}

function renderRecommendations(node) {
    const c = document.getElementById('planner-recommendations');
    const bar = document.getElementById('planner-filter-bar');
    activeDeeperFilter = 'all'; // reset on every topic entry, not just the first render
    if (node.recommendations.groups && node.recommendations.groups.length > 0) {
        renderDeeperFilterBar(node.recommendations.groups);
        renderDeeperCards(node.recommendations.groups);
        return;
    }
    bar.innerHTML = '';
    c.innerHTML = '';
    if (node.recommendations.radar.length > 0) {
        node.recommendations.radar.forEach(r => {
            c.innerHTML += `<div class="planner-radar-item"><span class="tag">On Our Radar</span><h4>${r.name}</h4><p>${r.description}</p></div>`;
        });
        return;
    }
    c.innerHTML = `<p class="no-recs-note">We don't have specific recommendations for this yet.</p>`;
}

// ---- Layer 3 — Compare Platforms ------------------------------------------------------------

// Scrollable comparison cards, each with a name banner. Every platform listed here renders as a
// normal, finished-looking card regardless of whether its link is live yet — no "Coming Soon" /
// status badge signaling the site is under construction. A platform with no `link` yet simply isn't
// clickable (no href, no CTA button) rather than a dead link or a visibly "pending" state. `offer`
// only ever holds a verified CUSTOMER-facing promo — never our own affiliate commission rate.
//
// `features` (an array of short fact strings) is the preferred way to fill a card's body — renders
// as a checkmarked list, scannable at a glance rather than a paragraph to read. `description` (a
// plain string) is kept as a fallback for any platform that hasn't been given real bulleted facts
// yet, so nothing regresses to an empty card while facts are still being written per platform.
// `highlight: true` marks the one genuinely-best option among the cards shown for a given node (not
// every node needs one) — a subtle accent treatment, never a loud color change, and only ever set
// when there's a real, defensible reason (see PLATFORM_COPY in data-loader.js for the reasoning
// behind each one used).
function renderPlatforms(node) {
    const c = document.getElementById('planner-cards');
    c.innerHTML = '';
    if (node.platforms.length === 0) {
        c.innerHTML = `<div class="platform-card"><div class="platform-card-banner"><h3>More Options</h3></div><div class="platform-card-body"><p>Browse the rest of our South Coast guides for what's covered so far.</p><a href="./guides/index.html" class="btn">Browse All Guides</a></div></div>`;
        return;
    }
    node.platforms.forEach(p => {
        const tag = p.link ? 'a' : 'div';
        const hrefAttr = p.link ? ` href="${p.link}" target="_blank" rel="noopener sponsored"` : '';
        const cardClass = p.highlight ? 'platform-card platform-card-highlight' : 'platform-card';
        const featuresHtml = (p.features && p.features.length)
            ? `<ul class="platform-card-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>`
            : (p.description ? `<p>${p.description}</p>` : '');
        c.innerHTML += `<${tag} class="${cardClass}"${hrefAttr}>
            <div class="platform-card-banner">
                <h3>${p.name}</h3>
                ${p.highlight ? '<span class="platform-card-tag">Best Pick</span>' : ''}
            </div>
            <div class="platform-card-body">
                ${p.offer ? `<span class="offer-badge">${p.offer}</span>` : ''}
                ${featuresHtml}
                ${p.link ? `<span class="btn">${p.cta}</span>` : ''}
            </div>
        </${tag}>`;
    });
}

// ---- Layer 4 — Visitors Also Checked ----------------------------------------------------------

function renderNextUp(node) {
    const c = document.getElementById('planner-nextup');
    c.innerHTML = '';
    (node.nextUp || []).forEach(t => {
        const card = document.createElement('div');
        card.className = 'planner-card';
        card.style.cursor = 'pointer';
        card.innerHTML = `
            <h3>${t.icon} ${t.label}</h3>
            <p class="fact">${t.blurb}</p>
            <span class="btn secondary">Explore</span>
        `;
        card.addEventListener('click', () => showTopic(t.id));
        c.appendChild(card);
    });
}

// ---- About Us screen ----------------------------------------------------------------------

// Real bio (matching the old #about homepage section's copy) + real social links from
// config.contact.social, replacing the mockup's placeholder text and dead `#` links.
function renderAbout() {
    const bio = document.getElementById('about-bio');
    if (bio) {
        bio.textContent = "Dolblathanna is a registered hospitality and tourism business rooted in Panchaliya, Ahangama, on Sri Lanka's South Coast. We're not currently taking bookings as a stay or running a rental fleet — but the local knowledge behind this site is real, built from years on the ground here. Consider this our way of sharing it: honest guides and recommendations for the towns we know best, from Hikkaduwa to Tangalle, while we figure out what's next.";
    }
    const social = document.getElementById('about-social');
    if (social) {
        social.innerHTML = '';
        const links = config.contact.social;
        if (links.facebook) social.innerHTML += `<a href="${links.facebook}" target="_blank" rel="noopener" class="planner-card">Facebook</a>`;
        if (links.instagram) social.innerHTML += `<a href="${links.instagram}" target="_blank" rel="noopener" class="planner-card">Instagram</a>`;
        if (links.tiktok) social.innerHTML += `<a href="${links.tiktok}" target="_blank" rel="noopener" class="planner-card">TikTok</a>`;
    }
}

// ---- Screen state machine ------------------------------------------------------------------

// Three screens live inside app mode: 'timeline' (home), 'detail' (one topic's 4 layers), 'about'.
// setAppState only ever paints the DOM for a given screen; it never itself writes history — callers
// (showTopic/showAbout/the popstate handler) own that.
//
// Back-arrow visibility: app mode IS the homepage now (loads open by default, no FAB/hero to return
// to — see index.html's #app-mode.is-homepage), so on the TIMELINE screen specifically, "back" has
// nowhere real to go and the arrow is hidden — same as the very first version of this design, before
// a since-superseded fix that showed it everywhere assuming a FAB-driven "closed" state existed to
// return to. Everywhere else (detail/about) the arrow works normally, on the homepage and on content
// pages alike, since there's always a real "back" target there (the timeline, or the browser's real
// history stack once pushState is involved).
let appState = 'timeline';

// In-page navigation (no page load — we're already inside app mode), unlike content pages' drawer
// which must link cross-document (see guide-nav.js). Hidden on the timeline screen itself, since
// that screen already IS the full 11-topic list this drawer duplicates (see quick-launcher.js).
const quickLauncher = mountQuickLauncher({
    navigate: (id) => showTopic(id),
    isTimelineHome: () => appState === 'timeline',
});

function setAppState(next) {
    appState = next;
    document.getElementById('timeline-screen').style.display = next === 'timeline' ? 'block' : 'none';
    document.getElementById('topic-detail').classList.toggle('is-active', next === 'detail');
    document.getElementById('about-screen').classList.toggle('is-active', next === 'about');
    const backBtn = document.getElementById('app-back-btn');
    const isHomepageTimeline = next === 'timeline' && document.getElementById('app-mode').classList.contains('is-homepage');
    backBtn.classList.toggle('is-visible', !isHomepageTimeline);
    backBtn.setAttribute('aria-label', 'Back');
    document.getElementById('app-scroll').scrollTop = 0;
    quickLauncher.refresh();
}

function showTopic(id, { replace = false } = {}) {
    const node = tripPlanner.nodes[id];
    if (!node) return; // unrecognized topic id (e.g. a stale/malformed deep link) — ignore silently
    document.getElementById('focus-icon').textContent = node.icon;
    document.getElementById('focus-title').textContent = node.label;
    document.getElementById('focus-blurb').textContent = node.blurb;
    // "Compare Platforms" is the layer that actually converts (real affiliate link), so it gets a
    // topic-specific action heading ("Book Your Transport", "Book Your Stay", etc.) rather than the
    // generic layer label — set per-node via `ctaLabel`, falling back to a neutral default.
    document.getElementById('cta-label').textContent = node.ctaLabel || 'Compare Your Options';
    renderGeneral(node);
    renderRecommendations(node);
    renderPlatforms(node);
    renderNextUp(node);
    setAppState('detail');
    pushHashState({ screen: 'detail', topicId: id }, { replace });
    renderMap(node); // after setAppState so the container is visible before Leaflet measures it
}

function showAbout({ replace = false } = {}) {
    renderAbout();
    setAppState('about');
    pushHashState({ screen: 'about' }, { replace });
}

// Real app-style LEVEL navigation, not browser-history-dependent — same fixed-parent model as
// content pages' DOLB_PARENT (see guide-nav.js). Both 'detail' and 'about' have exactly one parent:
// the timeline. This is intentional and NOT the same thing as "go back one page in history": a
// visitor can reach a topic detail screen by several different paths (tapping a timeline tile,
// landing via a content page's deep link with `replace`, a Visitors-Also-Checked card from another
// topic) and back must go to the SAME place — home — regardless of which path got them there. Using
// history.back() here was the bug: it replayed whatever the browser's history stack happened to
// contain (e.g. a content page's back-link that had just landed on this exact topic screen),
// producing a loop instead of reaching home. The back arrow is hidden entirely on the timeline
// screen (see setAppState) since it's the top of the hierarchy — this function only ever runs from
// 'detail'/'about', both of whose fixed parent is 'timeline'.
function backInApp() {
    setAppState('timeline');
    pushHashState({ screen: 'timeline' });
}

// ---- Wiring ----------------------------------------------------------------------------------

document.getElementById('app-back-btn').addEventListener('click', backInApp);
document.getElementById('app-about-btn').addEventListener('click', () => showAbout());

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && appState !== 'timeline') backInApp();
});

// Browser Back/Forward matches the in-app back arrow exactly: same fixed hierarchy, not raw browser
// history. Forward re-entering a topic/about screen would need reconstructing that screen's full
// state from the hash — deliberately not done, since Back always lands on 'timeline' the same way
// the arrow does, and Forward from there re-enters app mode already open (nothing to reconstruct);
// only a genuine Forward INTO a specific topic while already on this page needs it, an edge case
// thin enough that landing on the timeline instead (still inside app mode, one tap from anywhere) is
// an acceptable simplification over reintroducing the browser-history-dependent logic that caused
// the original loop bug.
window.addEventListener('popstate', () => {
    setAppState('timeline');
});

// Runs once on load: if the page was opened with an app-mode hash already in the URL (e.g. a guide
// page's back-arrow linked to ../index.html#app=topic:getting-around), open straight into that
// screen. `replace: true` so landing on a deep link doesn't retroactively create a fake "came from
// timeline" history entry that never really happened. With no recognized hash present, the page just
// starts on the timeline screen (app mode's default rest state — it's always "open," never a closed
// state to open into) — setAppState('timeline') still needs to run once to set the back-arrow's
// initial (hidden) visibility correctly.
function initFromHash() {
    const state = readHashState();
    if (state && state.screen === 'detail' && tripPlanner.nodes[state.topicId]) {
        showTopic(state.topicId, { replace: true });
    } else if (state && state.screen === 'about') {
        showAbout({ replace: true });
    } else {
        // No hash, or an unrecognized/stale one (e.g. a topic id that no longer exists) — start on
        // the timeline rather than hard-failing on a malformed link.
        setAppState('timeline');
    }
}

// Bootstrap: fetch the Supabase-backed tripPlanner tree once, then render exactly as before. A
// loading note is fine here since app-mode IS the homepage (loads open by default, per this file's
// header comment) — there's no prior screen to flash before this resolves.
document.getElementById('timeline-items').innerHTML = '<p class="no-recs-note">Loading…</p>';
loadTripPlanner().then((tree) => {
    tripPlanner = tree;
    renderTimeline();
    initFromHash();
}).catch((err) => {
    console.error('Failed to load trip planner data from Supabase:', err);
    document.getElementById('timeline-items').innerHTML = '<p class="no-recs-note">Couldn’t load trip data right now — please refresh.</p>';
});
