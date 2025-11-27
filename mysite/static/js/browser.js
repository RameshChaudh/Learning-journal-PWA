// Browser API: Clipboard API Setup
function setupClipboardApi() {
    // Listen for clicks on the document and check if the target is a copy button.
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('copy-button')) {
            const button = event.target;
            const targetId = button.dataset.target;
            
            // Find the content element using the data-target ID
            const contentElement = document.getElementById(targetId);

            if (contentElement) {
                const textToCopy = contentElement.innerText;
                
                try {
                    // Clipboard API: Copy text asynchronously
                    await navigator.clipboard.writeText(textToCopy);
                    
                    // DOM Manipulation: Provide user feedback
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy Entry';
                    }, 1500);

                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    alert('Error: Could not copy text. Please ensure your browser supports the Clipboard API.');
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', setupClipboardApi);
