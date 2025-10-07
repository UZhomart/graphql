export function showTeamProjectsPopup() {
    if (!window.teamProjectsData || window.teamProjectsData.length === 0) {
        alert('No team projects found');
        return;
    }

    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = /*html*/ `
        <div class="program-popup">
            <div class="program-popup-header">
                <h3>
                    <span>📁</span>
                    Team Projects
                </h3>
                <button class="close-btn" id="close-team-projects-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="program-popup-content">
                <div class="xp-summary">
                    <div class="summary-item">
                        <span class="summary-label">Total Team Projects:</span>
                        <span class="summary-value">${window.teamProjectsData.length}</span>
                    </div>
                </div>
                <div class="xp-transactions">
                    <h4>Team Projects</h4>
                    <div class="transactions-list">
                        ${window.teamProjectsData.map(project => /*html*/`
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <div class="transaction-name">${project.name}</div>
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
    const closeBtn = document.getElementById('close-team-projects-popup');
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

export function closeTeamProjectsPopup() {
    const overlay = document.querySelector('.popup-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

// Make functions globally available
window.showTeamProjectsPopup = showTeamProjectsPopup;
window.closeTeamProjectsPopup = closeTeamProjectsPopup;
