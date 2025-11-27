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

    // This assumes your HTML still has the placeholder or that you clear it.
    // We'll use the original element and replace it.
    const navPlaceholder = document.getElementById('nav-placeholder');
    const themeToggle = document.getElementById('theme-toggle');

    if (navPlaceholder) {
        // Insert the navigation structure into the placeholder
        navPlaceholder.innerHTML = navHTML;

        // Move the existing theme toggle button *after* the new header
        // This keeps the structure consistent with your old PWA layout
        if (themeToggle) {
             navPlaceholder.parentNode.insertBefore(themeToggle, navPlaceholder.nextSibling);
        }

        // Highlight the active page
        highlightActivePage();
    }
}

// Function to handle the active class highlighting
function highlightActivePage() {
    // Get the current path (e.g., '/', '/journal', '/about')
    let currentPath = window.location.pathname.replace(/\/$/, '');
    if (currentPath === '' || currentPath.endsWith('index.html')) {
        currentPath = '/'; // Ensure homepage is correctly detected by both / and /index.html
    }

    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');

        // Check if the link href matches the current path exactly
        if (linkHref === currentPath) {
            link.classList.add('active'); // FIX: Use your CSS class from style.css
        }
    });
}

// Theme Switcher Functionality (Interactive Feature)
function setupThemeSwitcher() {
    // Uses your original ID
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

// Initialize all functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load navigation first
    loadNavigation();

    // Then initialize other features
    setupThemeSwitcher();
});
