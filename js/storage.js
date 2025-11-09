const JOURNAL_STORAGE_KEY = 'learningJournalEntries';

// Function to delete an entry from Local Storage
function deleteEntry(id) {
    const entryId = parseInt(id); 
    let existingEntries = JSON.parse(localStorage.getItem(JOURNAL_STORAGE_KEY)) || [];
    
    // Filter out the entry with the matching ID
    const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
    
    // Local Storage API: Save the new array back to storage
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
    
    // DOM Manipulation: Refresh the displayed list
    displaySavedEntries();
}

// Function to save a new entry to Local Storage
function saveEntry(title, content) {
    const existingEntries = JSON.parse(localStorage.getItem(JOURNAL_STORAGE_KEY)) || [];
    
    const newEntry = {
        id: Date.now(), // Unique ID based on timestamp
        title: title,
        content: content,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    
    existingEntries.unshift(newEntry);
    
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(existingEntries));
    
    displaySavedEntries();
}

// Function to load and display all saved entries
function displaySavedEntries() {
    const container = document.getElementById('saved-entries-container');
    if (!container) return; 

    const entries = JSON.parse(localStorage.getItem(JOURNAL_STORAGE_KEY)) || [];

    let html = '<h2>Previously Saved Entries</h2>';
    if (entries.length === 0) {
        html += '<p>No custom entries saved yet.</p>';
    } else {
        entries.forEach(entry => {
            // Note: The content ID is prefixed to prevent conflicts
            html += `
                <article class="journal-entry saved-custom-entry" data-entry-id="${entry.id}">
                    <h3>${entry.title}</h3>
                    <p class="entry-meta">Saved on: ${entry.date} at ${entry.time}</p>
                    <p id="content-for-${entry.id}">${entry.content}</p>
                    <button class="copy-button" data-target="content-for-${entry.id}">Copy Entry</button>
                    <button class="delete-button" data-entry-id="${entry.id}">Delete</button>
                </article>
            `;
        });
    }
    container.innerHTML = html;
}

// Function to set up form submission handler
function setupEntryForm() {
    const form = document.getElementById('entry-form');
    
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); 
            
            const titleInput = document.getElementById('entry-title').value;
            const contentInput = document.getElementById('entry-content').value;
            
            saveEntry(titleInput, contentInput);
            
            form.reset();
        });
    }
}

// Function to handle clicks on the Delete buttons using Event Delegation
function setupDeleteHandler() {
    // Listen for all clicks within the document body
    document.body.addEventListener('click', (event) => {
        // Check if the clicked element is one of our delete buttons
        if (event.target.classList.contains('delete-button')) {
            const entryId = event.target.dataset.entryId;
            
            if (confirm('Are you sure you want to delete this entry?')) {
                deleteEntry(entryId);
            }
        }
    });
}

// --- Initialization ---
// Note: We MUST call setupDeleteHandler and setupEntryForm 
// but the copy button handling is now entirely managed in browser.js 
// via event delegation on the document.body.

document.addEventListener('DOMContentLoaded', () => {
    // Only run this logic on the journal.html page
    if (document.getElementById('entry-form')) {
        setupEntryForm();
        displaySavedEntries(); 
        setupDeleteHandler(); 
    }
});
