export function showSoloProjectsPopup() {
    if (!window.soloProjectsData || window.soloProjectsData.length === 0) {
        alert('No solo projects found');
        return;
    }

    const popup = document.createElement('div');
    popup.className = 'solo-projects-popup';
    popup.innerHTML = `
        <div class="popup-overlay" onclick="closeSoloProjectsPopup()"></div>
        <div class="popup-content">
            <div class="popup-header">
                <h3>👤 Solo Projects</h3>
                <button class="popup-close" onclick="closeSoloProjectsPopup()">×</button>
            </div>
            <div class="popup-body">
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

    document.body.appendChild(popup);
    
    // Add animation
    setTimeout(() => {
        popup.style.opacity = '1';
        const content = popup.querySelector('.popup-content');
        content.style.transform = 'scale(1)';
    }, 10);
}

export function closeSoloProjectsPopup() {
    const popup = document.querySelector('.solo-projects-popup');
    if (popup) {
        popup.style.opacity = '0';
        const content = popup.querySelector('.popup-content');
        content.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}

// Make functions globally available
window.showSoloProjectsPopup = showSoloProjectsPopup;
window.closeSoloProjectsPopup = closeSoloProjectsPopup;
