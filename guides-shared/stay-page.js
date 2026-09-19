// Shared renderer for all 7 stay/*.html type pages (guest-house, hostel, surf-camp, heritage-stay,
// boutique-hotel, villa, resort). Reads window.DOLB_STAY_GUIDE (set inline before this module's own
// <script> tag, same pattern as window.DOLB_TOPIC in guide-nav.js) so one file serves every type
// page — no per-page copy of this logic. See stay-data-loader.js for the fetch.
//
// NOTE: document.currentScript is unreliable inside type="module" scripts (null in this context in
// practice), so a data-* attribute on the <script> tag can't be read the normal way — a window
// global set just before the tag is the pattern this site already uses elsewhere for the same
// reason (see guide-nav.js's own comment on window.DOLB_TOPIC/DOLB_PARENT).
import { loadStayCategory, townsPresent } from './stay-data-loader.js';

const guideSlug = window.DOLB_STAY_GUIDE;

let allProperties = [];
let activeTown = 'all';

function renderFilterBar(towns) {
    const bar = document.getElementById('stay-filter-bar');
    if (towns.length <= 1) { bar.innerHTML = ''; return; } // no point filtering a single-town list
    const chips = [{ id: 'all', label: 'All' }, ...towns];
    bar.innerHTML = chips.map(t =>
        `<button class="stay-filter-chip${t.id === activeTown ? ' is-active' : ''}" data-town="${t.id}">${t.label}</button>`
    ).join('');
    bar.querySelectorAll('.stay-filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTown = btn.dataset.town;
            renderFilterBar(towns);
            renderGrid();
        });
    });
}

function renderGrid() {
    const grid = document.getElementById('stay-grid');
    const visible = activeTown === 'all' ? allProperties : allProperties.filter(p => p.location === activeTown);

    if (visible.length === 0) {
        grid.innerHTML = '<p class="stay-empty-note">No stays found for this filter yet.</p>';
        return;
    }

    grid.innerHTML = visible.map(p => {
        // A rating based on very few reviews isn't statistically meaningful (e.g. a single 10/10
        // review reads as equally trustworthy as one with 100+ at a glance) — suppress the badge
        // below a small review-count floor rather than presenting it with equal visual weight.
        const MIN_REVIEWS_TO_SHOW_RATING = 5;
        const ratingHtml = (p.rating && (!p.reviewCount || p.reviewCount >= MIN_REVIEWS_TO_SHOW_RATING))
            ? `<span class="stay-card-rating"><span class="stay-card-rating-score">${p.rating}</span>${p.reviewCount ? `<span class="stay-card-rating-count">${p.reviewCount} reviews</span>` : ''}</span>`
            : '';
        const summaryHtml = p.summary
            ? `<ul class="stay-card-summary">${p.summary.split(';').map(item => `<li>${item.trim()}</li>`).join('')}</ul>`
            : '';
        const linksHtml = p.links.length
            ? `<div class="stay-card-links">${p.links.map(l =>
                `<a href="${l.url}" target="_blank" rel="noopener sponsored" class="btn secondary">${l.label}</a>`
            ).join('')}</div>`
            : '<p class="stay-card-no-links">Booking link coming soon.</p>';
        // Real property photo, self-hosted (never an external hotlinked URL — see
        // stay-data-loader.js). A property with no photo sourced yet renders no image block,
        // same "no fake placeholder" convention as everywhere else on this site.
        const imageHtml = p.image
            ? `<div class="stay-card-image"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>`
            : '';

        return `<div class="stay-card">
            ${imageHtml}
            <div class="stay-card-body">
                <div class="stay-card-top-row">
                    <span class="stay-card-location">${p.location ? p.location.replace('-', ' ') : ''}</span>
                    ${ratingHtml}
                </div>
                <h3>${p.name}</h3>
                ${summaryHtml}
                ${linksHtml}
            </div>
        </div>`;
    }).join('');
}

(async function init() {
    try {
        const { guideTitle, properties } = await loadStayCategory(guideSlug);
        allProperties = properties;
        document.title = document.title.replace('Loading…', guideTitle);
        renderFilterBar(townsPresent(properties));
        renderGrid();
    } catch (err) {
        console.error('Failed to load stay category', guideSlug, err);
        document.getElementById('stay-grid').innerHTML =
            '<p class="stay-empty-note">Couldn\'t load stays right now — please try again shortly.</p>';
    }
})();
