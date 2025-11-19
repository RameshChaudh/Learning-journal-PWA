const JOURNAL_STORAGE_KEY = 'learningJournalEntries';
const JSON_DATA_PATH = './backend/reflections.json';

// Enhanced Storage Manager Class
class JournalStorageManager {
    constructor() {
        this.localKey = JOURNAL_STORAGE_KEY;
    }

    // === EXISTING LOCALSTORAGE METHODS ===
    deleteEntry(id) {
        const entryId = parseInt(id); 
        let existingEntries = JSON.parse(localStorage.getItem(this.localKey)) || [];
        const updatedEntries = existingEntries.filter(entry => entry.id !== entryId);
        localStorage.setItem(this.localKey, JSON.stringify(updatedEntries));
        this.displayAllEntries();
    }

    saveEntry(title, content) {
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

    // === NEW JSON FILE METHODS ===
    async loadJSONEntries() {
        try {
            const response = await fetch(JSON_DATA_PATH);
            if (!response.ok) throw new Error('JSON file not found');
            const jsonEntries = await response.json();
            
            // Add source identifier to JSON entries if not present
            return jsonEntries.map(entry => ({
                ...entry,
                source: entry.source || 'python'
            }));
        } catch (error) {
            console.warn('Could not load JSON entries:', error);
            return [];
        }
    }

    // === DATA MERGING ===
    async getAllEntries() {
        const localEntries = this.getLocalEntries();
        const jsonEntries = await this.loadJSONEntries();
        
        // Combine entries
        const allEntries = [...localEntries, ...jsonEntries];
        
        // Remove duplicates based on ID
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
                    (Browser: ${browserEntries}, Python: ${pythonEntries})</p>
                </div>
            `;
            
            entries.forEach(entry => {
                const sourceBadge = entry.source === 'python' 
                    ? '<span class="source-badge python-badge">Python</span>' 
                    : '<span class="source-badge browser-badge">Browser</span>';
                
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
                            ${entry.source === 'browser' 
                                ? `<button class="delete-button" data-entry-id="${entry.id}">Delete</button>`
                                : '<span class="delete-hint">(Python entry)</span>'
                            }
                        </div>
                    </article>
                `;
            });
        }
        container.innerHTML = html;
    }

    // === EXTRA FEATURE: EXPORT FUNCTIONALITY ===
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

function deleteEntry(id) {
    journalManager.deleteEntry(id);
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

            if (confirm('Are you sure you want to delete this entry?')) {
                deleteEntry(entryId);
            }
        }
    });
}

// NEW: Setup export handler
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
        displaySavedEntries(); // This now uses the enhanced version
        setupDeleteHandler();
        setupExportHandler(); // NEW
    }
});