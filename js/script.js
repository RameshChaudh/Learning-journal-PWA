// Function to dynamically insert the reusable navigation menu
function insertNavigation() {
    // 1. Define the HTML structure as a template string
    const navHTML = `
        <header>
            <nav aria-label="Main Navigation">
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="journal.html">Journal</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="projects.html">Projects</a></li>
                </ul>
            </nav>
        </header>
    `;
    
    // DOM Selection Method 1: getElementById()
    const navPlaceholder = document.getElementById('nav-placeholder');

    if (navPlaceholder) {
        // Insert the navigation structure into the placeholder
        navPlaceholder.innerHTML = navHTML;
        
        // Highlight the correct link
        highlightActivePage();
    }
}

// Function to handle the active class highlighting
function highlightActivePage() {
    // Determine the current page file name. 
    // This reliably returns 'index.html' for the homepage, or the file name for other pages.
    const pathSegments = window.location.pathname.split('/');
    let currentPage = pathSegments.pop() || 'index.html'; // Fix: Use 'index.html' if the path is empty

    // DOM Selection Method 2: querySelectorAll()
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Compare link href to the determined current page
        if (linkHref === currentPage) {
            link.classList.add('active'); // Change CSS style
        }
    });
}

// Theme Switcher Functionality (Interactive Feature)
function setupThemeSwitcher() {
    // DOM Selection Method 3: getElementById()
    const themeToggle = document.getElementById('theme-toggle');
    // Using querySelector to get the body is efficient
    const body = document.querySelector('body'); 

    if (themeToggle) {
        // Event Handling: Respond to user click
        themeToggle.addEventListener('click', () => {
            
            // Change CSS Styles: Toggle the 'dark-mode' class on the body
            body.classList.toggle('dark-mode');

            // Change Text Content: Update the button text
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
    insertNavigation(); 
    setupThemeSwitcher(); 
});
