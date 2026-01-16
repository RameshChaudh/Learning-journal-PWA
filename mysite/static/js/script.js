// static/js/script.js

let globalDeferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    console.log("📲 Global Install prompt captured");
    const installBtn = document.getElementById('install-btn');
    if (installBtn) installBtn.style.display = 'block';
});

// --- 2. CORE UI LOGIC ---

function loadNavigation() {
    if (document.querySelector('nav')) return;
    const navHTML = `
        <header>
            <nav aria-label="Main Navigation">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/journal">Journal</a></li>
                    <li><a href="/resources">Study Tracker</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/projects">Projects</a></li>
                </ul>
            </nav>
        </header>
    `;
    const navPlaceholder = document.getElementById('nav-placeholder');
    const themeToggle = document.getElementById('theme-toggle');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navHTML;
        if (themeToggle) navPlaceholder.parentNode.insertBefore(themeToggle, navPlaceholder.nextSibling);
        highlightActivePage();
    }
}

function highlightActivePage() {
    let currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });
}

function setupThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.querySelector('body');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            themeToggle.textContent = body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        });
    }
}

// --- 3. LIVE DASHBOARD STATS (Sync with reflections.json) ---

async function updateHomeStats() {
    const journalEl = document.getElementById('total-entries');
    const sessionsEl = document.getElementById('total-sessions');

    try {
        // Fetch directly from the backend JSON file via API
        const response = await fetch('/api/reflections');
        if (response.ok) {
            const serverEntries = await response.json();
            if (journalEl) journalEl.textContent = serverEntries.length;
            // Update local cache for offline viewing
            localStorage.setItem('reflections', JSON.stringify(serverEntries));
        }
    } catch (error) {
        console.log("Offline: Falling back to local cache");
        const localEntries = JSON.parse(localStorage.getItem('reflections')) || [];
        if (journalEl) journalEl.textContent = localEntries.length;
    }

    // Study sessions currently remain local-only
    const sessions = JSON.parse(localStorage.getItem('studySessions')) || [];
    if (sessionsEl) sessionsEl.textContent = sessions.length;
}

// --- 4. PWA CORE FEATURES ---

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('✅ Service Worker Registered'))
                .catch(err => console.log('❌ SW Registration Failed:', err));
        });
    }
}

function setupInstallButton() {
    if (document.getElementById('install-btn')) return;
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.textContent = '📲 Install App';
    installBtn.style.cssText = `
        display: none; position: fixed; bottom: 20px; right: 20px;
        background: #8e44ad; color: white; border: none; padding: 12px 24px;
        border-radius: 50px; font-weight: bold; z-index: 999999; cursor: pointer;
    `;
    document.body.appendChild(installBtn);
    if (globalDeferredPrompt) installBtn.style.display = 'block';

    installBtn.addEventListener('click', () => {
        installBtn.style.display = 'none';
        if (globalDeferredPrompt) {
            globalDeferredPrompt.prompt();
            globalDeferredPrompt.userChoice.then(() => globalDeferredPrompt = null);
        }
    });
}

// --- 5. INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    loadNavigation();
    setupThemeSwitcher();
    updateHomeStats();
    registerServiceWorker();
    setupInstallButton();
});
