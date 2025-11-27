const JOURNAL_STORAGE_KEY = 'learningJournalEntries';
// UPDATE 1: Point to the new Flask API route
const FLASK_API_PATH = '/api/reflections';

// Enhanced Storage Manager Class
class JournalStorageManager {
    constructor() {
        this.localKey = JOURNAL_STORAGE_KEY;
    }

    // === EXISTING LOCALSTORAGE METHODS (modified for API interaction) ===
    async deleteEntry(id, source) {
        const entryId = parseInt(id);

        if (source === 'browser') {
            // Delete from LocalStorage
            let existingEntries = JSON.parse(localStorage.getItem(this.localKey)) || [];
            const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
            localStorage.setItem(this.localKey, JSON.stringify(updatedEntries));
            this.displayAllEntries();

        } else if (source === 'python') {
            // UPDATE 2: Delete via Flask DELETE API
            try {
                const response = await fetch(`${FLASK_API_PATH}/${entryId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    this.displayAllEntries(); // Refresh list on success
                } else {
                    alert('Error deleting Python entry via API.');
                }
            } catch (error) {
                console.error('API Delete Failed:', error);
                alert('Could not connect to Flask API to delete entry.');
            }
        }
    }

    // UPDATE 3: saveEntry now sends data to Flask
    async saveEntry(title, content) {
        // Prepare the entry data for the Flask API
        const entryData = { title, content };

        try {
            const response = await fetch(FLASK_API_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entryData)
            });

            if (response.ok) {
                // If Flask save succeeds, notify the user and refresh
                console.log('Entry saved successfully via Flask API.');
                this.displayAllEntries();
            } else {
                // FALLBACK: If API fails, save to LocalStorage (as 'browser' source)
                this.saveToLocal(title, content);
            }
        } catch (error) {
            console.warn('Flask API connection failed. Saving locally as fallback:', error);
            this.saveToLocal(title, content);
        }
    }

    // New helper function for local saving fallback
    saveToLocal(title, content) {
        const existingEntries = JSON.parse(localStorage.getItem(this.localKey)) || [];
        const newEntry = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            source: 'browser'
        };

        existingEntries.unshift(newEntry);
        localStorage.setItem(this.localKey, JSON.stringify(existingEntries));
        this.displayAllEntries();
    }


    getLocalEntries() {
        return JSON.parse(localStorage.getItem(this.localKey)) || [];
    }

    // === NEW JSON FILE METHODS (FLASK API) ===
    // UPDATE 4: Fetch entries from the Flask API route
    async loadJSONEntries() {
        try {
            // Fetch from the Flask GET route
            const response = await fetch(FLASK_API_PATH);
            if (!response.ok) throw new Error('Flask API not available or returned error');
            const jsonEntries = await response.json();

            // Add source identifier to JSON entries if not present
            return jsonEntries.map(entry => ({
                id: parseInt(entry.id),
                title: entry.title || 'API Entry',
                content: entry.content || entry.reflection,
                date: entry.date,
                time: entry.time || '',
                source: entry.source || 'python'
            }));
        } catch (error) {
            console.warn('Could not load JSON entries (via Flask API):', error);
            return [];
        }
    }

    // === DATA MERGING, REMOVE DUPLICATES, EXPORT, AND DISPLAY remain correct ===
    async getAllEntries() {
        const localEntries = this.getLocalEntries();
        const jsonEntries = await this.loadJSONEntries();

        const allEntries = [...localEntries, ...jsonEntries];
        const uniqueEntries = this.removeDuplicates(allEntries);

        // Sort by ID (newest first)
        return uniqueEntries.sort((a, b) => b.id - a.id);
    }

    removeDuplicates(entries) {
        const seen = new Set();
        return entries.filter(entry => {
            if (seen.has(entry.id)) {
                console.log(`Removed duplicate entry: ${entry.title}`);
                return false;
            }
            seen.add(entry.id);
            return true;
        });
    }

    // === ENHANCED DISPLAY FUNCTION ===
    async displayAllEntries() {
        const container = document.getElementById('saved-entries-container');
        if (!container) return;

        const entries = await this.getAllEntries();

        let html = '<h2>Custom Journal Entries</h2>';

        if (entries.length === 0) {
            html += `
                <div class="no-entries">
                    <p>No custom entries saved yet.</p>
                    <p>Add entries using the form above!</p>
                </div>
            `;
        } else {
            // Add entry counter and stats
            const browserEntries = entries.filter(e => e.source === 'browser').length;
            const pythonEntries = entries.filter(e => e.source === 'python').length;

            html += `
                <div class="entries-stats">
                    <p>Total entries: <strong>${entries.length}</strong>
                    (Browser: ${browserEntries}, Python/API: ${pythonEntries})</p>
                </div>
            `;

            entries.forEach(entry => {
                const sourceBadge = entry.source === 'python'
                    ? '<span class="source-badge python-badge">Python/API</span>'
                    : '<span class="source-badge browser-badge">Browser/Local</span>';

                html += `
                    <article class="journal-entry saved-custom-entry" data-entry-id="${entry.id}" data-source="${entry.source}">
                        <div class="entry-header">
                            <h3>${entry.title}</h3>
                            ${sourceBadge}
                        </div>
                        <p class="entry-meta">Saved on: ${entry.date} at ${entry.time}</p>
                        <p id="content-for-${entry.id}">${entry.content}</p>
                        <div class="entry-actions">
                            <button class="copy-button" data-target="content-for-${entry.id}">Copy Entry</button>
                            <button class="delete-button" data-entry-id="${entry.id}" data-entry-source="${entry.source}">Delete</button>
                        </div>
                    </article>
                `;
            });
        }
        container.innerHTML = html;
    }

    // === EXTRA FEATURE: EXPORT FUNCTIONALITY ===
    // This remains the same, consolidating all data for export
    async exportAllEntries() {
        try {
            const entries = await this.getAllEntries();
            const dataStr = JSON.stringify(entries, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = window.URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `journal-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            alert(`✅ Exported ${entries.length} entries successfully!`);
        } catch (error) {
            console.error('Export failed:', error);
            alert('❌ Export failed. Check console for details.');
        }
    }
}

// Initialize the enhanced storage manager
const journalManager = new JournalStorageManager();

// Update your existing functions to use the new manager
function saveEntry(title, content) {
    journalManager.saveEntry(title, content);
}

// UPDATE 5: Pass the source to deleteEntry
function deleteEntry(id, source) {
    journalManager.deleteEntry(id, source);
}

// Replace the original displaySavedEntries with the enhanced version
function displaySavedEntries() {
    journalManager.displayAllEntries();
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
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            const entryId = event.target.dataset.entryId;
            // UPDATE 6: Get the source from the button's data attribute
            const entrySource = event.target.dataset.entrySource;

            if (confirm('Are you sure you want to delete this entry?')) {
                // Pass both ID and source to the delete function
                deleteEntry(entryId, entrySource);
            }
        }
    });
}

// Setup export handler
function setupExportHandler() {
    // Export button
    document.getElementById('export-btn')?.addEventListener('click', () => {
        journalManager.exportAllEntries();
    });
}

// --- Enhanced Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('entry-form')) {
        setupEntryForm();
        displaySavedEntries();
        setupDeleteHandler();
        setupExportHandler();
    }
});
