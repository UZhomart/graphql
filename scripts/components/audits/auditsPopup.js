export const showAuditsPopup = (auditsData) => {
    // Calculate values
    const succeeded = auditsData.audits_aggregate.aggregate.count;
    const failed = auditsData.failed_audits.aggregate.count;
    const total = succeeded + failed;
    const successRate = total > 0 ? ((succeeded / total) * 100).toFixed(1) : 0;
    
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = /*html*/ `
        <div class="audits-popup">
            <div class="audits-header">
                <h3>
                    <span>📊</span>
                    Audits Details
                </h3>
                <button class="close-btn" id="close-audits-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="audits-content">
                <div class="audits-summary">
                    <div class="audit-summary-item">
                        <span class="audit-summary-label">Total Audits</span>
                        <span class="audit-summary-value">${total}</span>
                    </div>
                    <div class="audit-summary-item">
                        <span class="audit-summary-label">Succeeded</span>
                        <span class="audit-summary-value">${succeeded}</span>
                    </div>
                    <div class="audit-summary-item">
                        <span class="audit-summary-label">Success Rate</span>
                        <span class="audit-summary-value">${successRate}%</span>
                    </div>
                </div>
                
                <div class="audit-details">
                    <h4>Detailed Information</h4>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">Succeeded Audits</span>
                        <span class="audit-detail-value">${succeeded}</span>
                    </div>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">Failed Audits</span>
                        <span class="audit-detail-value">${failed}</span>
                    </div>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">Total Audits</span>
                        <span class="audit-detail-value">${total}</span>
                    </div>
                    <div class="audit-detail-item">
                        <span class="audit-detail-label">Success Rate</span>
                        <span class="audit-detail-value">${successRate}%</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(overlay);

    // Add close functionality
    const closeBtn = document.getElementById('close-audits-popup');
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
