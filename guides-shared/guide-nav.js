// Dolblathanna Guides — shared header/footer injector
// Loaded from pages one directory below the site root (guides/*.html),
// so all root-relative links here use the "../" prefix.

(function () {
    const homeUrl = '../index.html';
    const guidesUrl = '../guides/index.html';
    const logoUrl = '../brand/logo.png';

    const isGuidesIndex = /\/guides\/index\.html$/.test(window.location.pathname) ||
        window.location.pathname.endsWith('/guides/');

    document.body.classList.add('guide-body');

    const header = document.createElement('header');
    header.className = 'guide-header';
    header.innerHTML = `
        <a href="${homeUrl}" class="logo-container">
            <img src="${logoUrl}" alt="Dolblathanna Logo" class="logo">
            <span class="brand-name">Dolblathanna</span>
        </a>
        <nav>
            <a href="${homeUrl}">Home</a>
            <a href="${guidesUrl}" class="${isGuidesIndex ? 'active' : ''}">Guides</a>
            <a href="${homeUrl}#contact">Contact</a>
        </nav>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const footer = document.createElement('footer');
    footer.className = 'guide-footer';
    footer.innerHTML = `
        <p>&copy; ${new Date().getFullYear()} Dolblathanna, Ahangama. All rights reserved.</p>
        <p><a href="${homeUrl}">Back to the main site</a> &middot; <a href="${guidesUrl}">All South Coast Guides</a></p>
    `;
    document.body.appendChild(footer);
})();
