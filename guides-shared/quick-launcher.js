// Quick Launcher — a slide-in drawer (from the left) listing all 11 trip-planner topics, reachable
// from a floating button on every screen EXCEPT the timeline home itself (where the same 11 topics
// are already the whole screen — the drawer exists specifically so a visitor doesn't have to walk
// back up the fixed hierarchy to Home just to jump sideways to a different topic, guide, or product
// page; on the timeline that need doesn't exist yet).
//
// SHARED between app-mode (index.html, in-page topic switch, no navigation) and every guide/product/
// stay content page (injected by guide-nav.js, real cross-document link to
// ../index.html#app=topic:<id>) — same pattern as guide-nav.js itself: one implementation, one visual
// design, each host wires up how a tap actually navigates via the `navigate` callback rather than
// this module guessing its environment.
//
// Data comes from data-loader.js's loadTopicList() (id/label/icon only, fetched from the Supabase
// affiliate DB — see .claude/memory/project_affiliate_db_schema_and_design_first.md in paypal-poc)
// — the same single source of truth index.html's timeline already renders from, so there is no
// second list of 11 topics anywhere that can drift out of sync.
import { loadTopicList } from '../data-loader.js';

// mount({ navigate, isTimelineHome }) — call once per page.
//   navigate(topicId): called when a drawer item is tapped; the host decides what that means
//     (index.html: an in-page showTopic() call; content pages: a real page link).
//   isTimelineHome(): returns true while the floating button should stay hidden (index.html's
//     timeline screen only — content pages always pass () => false, they have no timeline screen).
// Returns { refresh() } so app-mode.js can re-hide/show the button on every screen change.
export function mountQuickLauncher({ navigate, isTimelineHome = () => false }) {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'quick-launcher-fab';
    fab.setAttribute('aria-label', 'Quick jump to any topic');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = '<span aria-hidden="true">&#9776;</span>';

    const scrim = document.createElement('div');
    scrim.className = 'quick-launcher-scrim';

    const drawer = document.createElement('nav');
    drawer.className = 'quick-launcher-drawer';
    drawer.setAttribute('aria-label', 'All topics');
    drawer.innerHTML = `
        <div class="quick-launcher-header">
            <span>All Topics</span>
            <button type="button" class="quick-launcher-close" aria-label="Close">&times;</button>
        </div>
        <div class="quick-launcher-list"></div>
    `;

    document.body.append(fab, scrim, drawer);

    loadTopicList().then(topics => {
        const list = drawer.querySelector('.quick-launcher-list');
        list.innerHTML = topics.map(t => `
            <button type="button" class="quick-launcher-item" data-topic-id="${t.id}">
                <span class="quick-launcher-item-icon">${t.icon}</span>
                <span class="quick-launcher-item-label">${t.label}</span>
            </button>
        `).join('');
        list.querySelectorAll('.quick-launcher-item').forEach(btn => {
            btn.addEventListener('click', () => {
                close();
                navigate(btn.dataset.topicId);
            });
        });
    }).catch(err => console.error('Failed to load topic list from Supabase:', err));

    function open() {
        drawer.classList.add('is-open');
        scrim.classList.add('is-open');
        fab.setAttribute('aria-expanded', 'true');
    }
    function close() {
        drawer.classList.remove('is-open');
        scrim.classList.remove('is-open');
        fab.setAttribute('aria-expanded', 'false');
    }

    fab.addEventListener('click', open);
    scrim.addEventListener('click', close);
    drawer.querySelector('.quick-launcher-close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });

    // Dim the button while actively scrolling so it doesn't sit fully opaque over content passing
    // underneath it, back to full opacity once scrolling settles. The scroll container differs by
    // host — index.html scrolls its own #app-scroll div (app-mode.css), content pages scroll the
    // normal document/window — so both are listened for; whichever one doesn't apply on a given page
    // simply never fires, no harm either way.
    let scrollDimTimer = null;
    function onScroll() {
        fab.classList.add('is-scrolling');
        clearTimeout(scrollDimTimer);
        scrollDimTimer = setTimeout(() => fab.classList.remove('is-scrolling'), 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    document.getElementById('app-scroll')?.addEventListener('scroll', onScroll, { passive: true });

    function refresh() {
        fab.classList.toggle('is-hidden', isTimelineHome());
        if (isTimelineHome()) close();
    }
    refresh();
    return { refresh };
}
