export function showSoloProjectsPopup() {
    if (!window.soloProjectsData || window.soloProjectsData.length === 0) {
        alert('No solo projects found');
        return;
    }

    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
        <div class="solo-projects-popup">
            <div class="popup-header">
                <h3>
                    <span>👤</span>
                    Solo Projects
                </h3>
                <button class="close-btn" id="close-solo-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="popup-content">
                <div class="projects-summary">
                    <div class="summary-item">
                        <span class="summary-label">Total Solo Projects:</span>
                        <span class="summary-value">${window.soloProjectsData.length}</span>
                    </div>
                </div>
                <div class="projects-list">
                    ${window.soloProjectsData.map(project => `
                        <div class="project-item">
                            <div class="project-name">${project.name}</div>
                            <div class="project-status ${project.status}">${project.status}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Add close functionality
    const closeBtn = document.getElementById('close-solo-popup');
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

export function closeSoloProjectsPopup() {
    const overlay = document.querySelector('.popup-overlay');
    if (overlay) {
        document.body.removeChild(overlay);
    }
}

// Make functions globally available
window.showSoloProjectsPopup = showSoloProjectsPopup;
window.closeSoloProjectsPopup = closeSoloProjectsPopup;
