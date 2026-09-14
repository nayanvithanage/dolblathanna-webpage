// Dolblathanna Guides — shared header/footer injector
// Loaded from pages one directory below the site root (guides/*.html, products/*.html,
// stay/*.html), so all root-relative links here use the "../" prefix.
//
// Injects the app-bar chrome (back arrow / logo / About Us) matching app-mode's own .app-bar exactly
// (same class names, same visual design — see app-mode.css and guide.css's .guide-app-bar block), so
// a visitor sees continuous, identical chrome whether they're inside the full-screen app-mode
// overlay on the homepage or reading a standalone guide/product/stay page.
//
// Real app-style LEVEL navigation, not browser-history-based: each page declares its own parent
// explicitly, and back always goes there — regardless of how the visitor actually arrived (a click
// path, a bookmark, a deep link). Browser history can't be relied on here: navigating between
// index.html and a content page is always a real cross-document page load, which the browser adds
// its own history entry for no matter what this script or app-mode.js's in-page pushState routing
// does — chaining plain <a href> back-links (page A's back → page B, page B's back → page A) would
// loop forever rather than ever reaching home, which is exactly the bug this explicit-parent model
// avoids.
//
// Each consuming page declares its place in the hierarchy via globals set BEFORE this script tag:
//   <script>window.DOLB_TOPIC = 'getting-around';</script>
//     — the default: this page's back-arrow returns to that topic's detail screen on the homepage.
//     Omit it (or leave it null) for a page with no single topic — currently only guides/index.html,
//     the flat hub listing all guides — whose back-arrow returns to the timeline home instead.
//   <script>window.DOLB_PARENT = '../guides/yala-safari-guide.html';</script>
//     — an explicit override for a page whose real parent is ANOTHER CONTENT PAGE, not a topic
//     directly. Currently only used by product pages, whose actual place in the hierarchy is
//     Topic → Guide → Product, not Topic → Product — e.g. products/yala-safari.html's parent is
//     guides/yala-safari-guide.html, not the tours-activities topic it's filed under. When set, this
//     takes priority over DOLB_TOPIC for the back-arrow target (DOLB_TOPIC may still be set
//     alongside it, purely for categorization elsewhere — it's just not used for back-navigation on
//     that page).
//
// Topic ids/parent paths are NOT derivable from filenames (e.g. ahangama-day-trip-guide.html maps to
// getting-around, not anything guessable from its own name) so this must stay explicit, page-authored
// data rather than something this script infers.
import { mountQuickLauncher } from './quick-launcher.js';

(function () {
    const homeUrl = '../index.html';
    const guidesUrl = '../guides/index.html';
    const logoUrl = '../brand/logo.png';

    const isGuidesIndex = /\/guides\/index\.html$/.test(window.location.pathname) ||
        window.location.pathname.endsWith('/guides/');

    const topicId = window.DOLB_TOPIC || null;
    const explicitParent = window.DOLB_PARENT || null;

    let backHref, backLabel;
    if (explicitParent) {
        backHref = explicitParent;
        backLabel = 'Back';
    } else if (topicId) {
        backHref = `${homeUrl}#app=topic:${topicId}`;
        backLabel = 'Back to Guide';
    } else {
        backHref = `${homeUrl}#app=timeline`;
        backLabel = 'All Topics';
    }

    document.body.classList.add('guide-body');

    const header = document.createElement('header');
    header.className = 'guide-app-bar';
    header.innerHTML = `
        <a href="${backHref}" class="app-back is-visible" aria-label="${backLabel}">&larr;</a>
        <a href="${homeUrl}" class="app-bar-logo"><img src="${logoUrl}" alt="Dolblathanna"></a>
        <a href="${homeUrl}#app=about" class="app-bar-about">About Us</a>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const footer = document.createElement('footer');
    footer.className = 'guide-footer';
    footer.innerHTML = `
        <p>&copy; ${new Date().getFullYear()} Dolblathanna, Ahangama. All rights reserved.</p>
        <p><a href="${backHref}">&larr; ${backLabel}</a> &middot; <a href="${guidesUrl}" class="${isGuidesIndex ? 'active' : ''}">All South Coast Guides</a></p>
    `;
    document.body.appendChild(footer);

    // Content pages have no timeline screen of their own to hide the launcher on (isTimelineHome
    // always false — every content page is, by definition, "away from home") and can't switch topics
    // in-page like app-mode.js does, so navigate is a real cross-document link, same target as this
    // page's own back-arrow-to-home would use for any topic.
    mountQuickLauncher({
        navigate: (id) => { window.location.href = `${homeUrl}#app=topic:${id}`; },
    });
})();
