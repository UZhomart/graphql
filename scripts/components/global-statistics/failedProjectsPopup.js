export const showFailedProjectsPopup = (failedProjects) => {
    // Sort projects by last attempt date (newest first)
    const sortedProjects = failedProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Group projects by name to show retry attempts
    const projectGroups = {};
    sortedProjects.forEach(project => {
        const name = project.object?.name || 'Unknown Project';
        if (!projectGroups[name]) {
            projectGroups[name] = [];
        }
        projectGroups[name].push(project);
    });
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = /*html*/ `
        <div class="projects-popup">
            <div class="projects-header">
                <h3>
                    <span>❌</span>
                    Failed Projects Details
                </h3>
                <button class="close-btn" id="close-failed-projects-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="projects-content">
                <div class="projects-summary">
                    <div class="project-summary-item">
                        <span class="project-summary-label">Total Failed</span>
                        <span class="project-summary-value">${sortedProjects.length}</span>
                    </div>
                    <div class="project-summary-item">
                        <span class="project-summary-label">Unique Projects</span>
                        <span class="project-summary-value">${Object.keys(projectGroups).length}</span>
                    </div>
                </div>
                
                <div class="projects-details">
                    <h4>Project List</h4>
                    <div class="projects-list">
                        ${sortedProjects.length === 0 ? 
                            '<div class="no-data">No failed projects found</div>' :
                            Object.entries(projectGroups).map(([name, attempts]) => {
                                const attemptsCount = attempts.length;
                                const latestAttempt = attempts[attempts.length - 1];
                                const createdAt = new Date(latestAttempt.createdAt).toLocaleDateString();
                                const grade = latestAttempt.grade.toFixed(2);
                                
                                return /*html*/`
                                    <div class="project-item">
                                        <div class="project-info">
                                            <div class="project-name">${name} (${attemptsCount} attempt${attemptsCount > 1 ? 's' : ''})</div>
                                            <div class="project-grade">Last Grade: ${grade}</div>
                                            <div class="project-date">Last attempt: ${createdAt}</div>
                                        </div>
                                    </div>
                                `;
                            }).join('')
                        }
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(overlay);

    // Add close functionality
    const closeBtn = document.getElementById('close-failed-projects-popup');
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
