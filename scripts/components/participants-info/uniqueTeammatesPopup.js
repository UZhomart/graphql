export function showUniqueTeammatesPopup() {
    if (!window.uniqueTeammatesData || window.uniqueTeammatesData.length === 0) {
        alert('No unique teammates found');
        return;
    }

    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'unique-teammates-overlay';
    overlay.innerHTML = /*html*/ `
        <div class="unique-teammates-popup">
            <div class="unique-teammates-header">
                <h3>
                    <span>👥</span>
                    Unique Teammates
                </h3>
                <button class="unique-teammates-close-btn" id="close-unique-teammates-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="unique-teammates-body">
                <div class="unique-teammates-summary">
                    <div class="summary-item">
                        <span class="summary-label">Total Unique Teammates:</span>
                        <span class="summary-value">${window.uniqueTeammatesData.length}</span>
                    </div>
                </div>
                <div class="unique-teammates-list">
                    <h4>Teammates</h4>
                    <div class="unique-teammates-grid">
                        ${window.uniqueTeammatesData.map(teammate => /*html*/`
                            <div class="unique-teammate-card">
                                <div class="unique-teammate-info">
                                    <div class="unique-teammate-name">${teammate.user.firstName || ''} ${teammate.user.lastName || ''}</div>
                                    <div class="unique-teammate-login">@${teammate.user.login}</div>
                                </div>
                                <div class="unique-teammate-stats">
                                    <span class="unique-projects-count">${teammate.projects.length}</span>
                                    <span class="unique-projects-label">project${teammate.projects.length > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Add close functionality
    const closeBtn = document.getElementById('close-unique-teammates-popup');
    const closePopup = () => {
        document.body.removeChild(overlay);
    };

    closeBtn.addEventListener('click', closePopup);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

export function closeUniqueTeammatesPopup() {
    const overlay = document.querySelector('.unique-teammates-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

// Make functions globally available
window.showUniqueTeammatesPopup = showUniqueTeammatesPopup;
window.closeUniqueTeammatesPopup = closeUniqueTeammatesPopup;
