export const showSuccessfulProjectsPopup = (successfulProjects) => {
    // Sort projects by completion date (newest first)
    const sortedProjects = successfulProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = /*html*/ `
        <div class="projects-popup">
            <div class="projects-header">
                <h3>
                    <span>✅</span>
                    Successful Projects Details
                </h3>
                <button class="close-btn" id="close-successful-projects-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="projects-content">
                <div class="projects-summary">
                    <div class="project-summary-item">
                        <span class="project-summary-label">Total Successful</span>
                        <span class="project-summary-value">${sortedProjects.length}</span>
                    </div>
                </div>
                
                <div class="projects-details">
                    <h4>Project List</h4>
                    <div class="projects-list">
                        ${sortedProjects.length === 0 ? 
                            '<div class="no-data">No successful projects found</div>' :
                            sortedProjects.map(project => /*html*/`
                                <div class="project-item">
                                    <div class="project-info">
                                        <div class="project-name">${project.object?.name || 'Unknown Project'}</div>
                                        <div class="project-grade">Grade: ${project.grade.toFixed(2)}</div>
                                        <div class="project-date">Completed: ${new Date(project.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(overlay);

    // Add close functionality
    const closeBtn = document.getElementById('close-successful-projects-popup');
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
};
