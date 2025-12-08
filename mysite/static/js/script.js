// Function to dynamically insert the reusable navigation menu
function loadNavigation() {
    // Check if navigation already exists (to prevent duplication)
    if (document.querySelector('nav')) {
        return;
    }

    // NOTE: Links use hardcoded paths (/, /about, /journal, /projects)
    const navHTML = `
        <header>
            <nav aria-label="Main Navigation">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/journal">Journal</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/projects">Projects</a></li>
                </ul>
            </nav>
        </header>
    `;

    const navPlaceholder = document.getElementById('nav-placeholder');
    const themeToggle = document.getElementById('theme-toggle');

    if (navPlaceholder) {
        // Insert the navigation structure into the placeholder
        navPlaceholder.innerHTML = navHTML;

        // Move the existing theme toggle button *after* the new header
        if (themeToggle) {
             navPlaceholder.parentNode.insertBefore(themeToggle, navPlaceholder.nextSibling);
        }

        // Highlight the active page
        highlightActivePage();
    }
}

// Function to handle the active class highlighting
function highlightActivePage() {
    let currentPath = window.location.pathname.replace(/\/$/, '');
    if (currentPath === '' || currentPath.endsWith('index.html')) {
        currentPath = '/';
    }

    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.classList.add('active');
        }
    });
}

// Theme Switcher Functionality
function setupThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.querySelector('body');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                themeToggle.textContent = 'Switch to Light Mode';
            } else {
                themeToggle.textContent = 'Switch to Dark Mode';
            }
        });
    }
}

// --- LAB 7: PWA FEATURES (Service Worker & Install Button) ---

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
    let deferredPrompt;

    // 1. Create the button dynamically (Purple Theme)
    const installBtn = document.createElement('button');
    installBtn.id = 'install-btn';
    installBtn.textContent = '📲 Install App';

    // Apply Purple Styling (#8e44ad)
    installBtn.style.cssText = `
        display: none;
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #8e44ad;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        cursor: pointer;
        transition: transform 0.2s;
        font-family: sans-serif;
    `;

    // Add hover effect
    installBtn.onmouseover = function() { this.style.transform = 'scale(1.05)'; };
    installBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };

    document.body.appendChild(installBtn);

    // 2. Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67+ from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Show the button
        installBtn.style.display = 'block';
        console.log("📲 Install prompt captured");
    });

    // 3. Handle click
    installBtn.addEventListener('click', (e) => {
        // Hide button
        installBtn.style.display = 'none';
        // Show prompt
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        }
    });
}

// Initialize all functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Logic
    loadNavigation();
    setupThemeSwitcher();

    // 2. Lab 7 PWA Logic
    registerServiceWorker();
    setupInstallButton();
});
