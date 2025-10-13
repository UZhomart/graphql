export const showZzleGamePopup = (zzleGame) => {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.id = 'zzle-game-popup-overlay';
    
    // Calculate statistics
    const totalLevels = zzleGame.results.length;
    const totalAttempts = zzleGame.results.reduce((sum, result) => sum + result.attempts, 0);
    const maxLevel = Math.max(...zzleGame.results.map(r => r.level));
    const avgAttempts = (totalAttempts / totalLevels).toFixed(1);
    const duration = Math.round(zzleGame.duration / 60); // Convert to minutes
    
    overlay.innerHTML = /*html*/ `
    <div class="zzle-game-popup">
        <div class="zzle-game-header">
            <h3>
                <span class="game-icon">🧩</span>
                Zzle Game Details
            </h3>
            <button class="close-btn" id="close-zzle-popup">×</button>
        </div>
        <div class="zzle-game-content">
            <div class="zzle-game-summary">
                <div class="game-summary-item">
                    <div class="game-summary-label">Level</div>
                    <div class="game-summary-value">${maxLevel}</div>
                </div>
                <div class="game-summary-item">
                    <div class="game-summary-label">Total Attempts</div>
                    <div class="game-summary-value">${totalAttempts}</div>
                </div>
                <div class="game-summary-item">
                    <div class="game-summary-label">Avg Attempts/Level</div>
                    <div class="game-summary-value">${avgAttempts}</div>
                </div>
                <div class="game-summary-item">
                    <div class="game-summary-label">Duration</div>
                    <div class="game-summary-value">${duration} min</div>
                </div>
                <div class="game-summary-item">
                    <div class="game-summary-label">Points</div>
                    <div class="game-summary-value">${zzleGame.points}</div>
                </div>
                <div class="game-summary-item">
                    <div class="game-summary-label">Started At</div>
                    <div class="game-summary-value">${new Date(zzleGame.startedAt).toLocaleDateString()}</div>
                </div>
            </div>
            
            <div class="zzle-game-details">
                <h4>Level Progress</h4>
                <div class="levels-grid">
                    ${zzleGame.results.map(result => /*html*/ `
                        <div class="level-item">
                            <div class="level-number">Level ${result.level}</div>
                            <div class="level-attempts">${result.attempts} ${result.attempts === 1 ? 'attempt' : 'attempts'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Add to DOM
    document.body.appendChild(overlay);
    
    // Add event listeners
    const closeBtn = document.getElementById('close-zzle-popup');
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
    
    // Prevent content clicks from closing
    const popup = overlay.querySelector('.zzle-game-popup');
    popup.addEventListener('click', (e) => {
        e.stopPropagation();
    });
};
