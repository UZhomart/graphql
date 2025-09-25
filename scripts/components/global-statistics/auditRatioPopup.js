export const showAuditRatioPopup = (auditData) => {
    // Calculate values
    const done = auditData.totalUp - auditData.totalUpBonus;
    const received = auditData.totalDown;
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = /*html*/ `
        <div class="audit-ratio-popup">
            <div class="audit-ratio-header">
                <h3>
                    <span>⚖️</span>
                    Audit Ratio Details
                </h3>
                <button class="close-btn" id="close-audit-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="audit-ratio-content">
                <div class="audit-ratio-summary">
                    <div class="audit-summary-item">
                        <span class="audit-summary-label">Audit Ratio</span>
                        <span class="audit-summary-value">${auditData.auditRatio}</span>
                    </div>
                    <div class="audit-summary-item">
                        <span class="audit-summary-label">Total Done</span>
                        <span class="audit-summary-value">${auditData.totalUp}</span>
                    </div>
                    <div class="audit-summary-item">
                        <span class="audit-summary-label">Received</span>
                        <span class="audit-summary-value">${received}</span>
                    </div>
                </div>
                
                <div class="audit-details">
                    <h4>Detailed Information</h4>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">Received</span>
                        <span class="audit-detail-value">${auditData.totalDown}</span>
                    </div>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">Done (without bonus)</span>
                        <span class="audit-detail-value">${done}</span>
                    </div>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">+Bonus</span>
                        <span class="audit-detail-value">${auditData.totalUpBonus}</span>
                    </div>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">Total Done</span>
                        <span class="audit-detail-value">${auditData.totalUp}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(overlay);

    // Add close functionality
    const closeBtn = document.getElementById('close-audit-popup');
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

