import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_AUDIT_RATIO_INFO } from "../../api/graphql.js";
import { handleLogout } from "../../app/handleAuth.js";
import { showAuditRatioPopup } from "./auditRatioPopup.js";
import { renderAudits } from "./renderAudits.js";
import { renderSuccessfulProjects } from "./renderSuccessfulProjects.js";
import { renderFailedProjects } from "./renderFailedProjects.js";
import { renderMemoryGame } from "./renderMemoryGame.js";
import { renderZzleGame } from "./renderZzleGame.js";

export const renderGlobalStatistics = async () => {
    // Render global statistics
    const container = document.getElementById("global-statistics");
    
    try {
        // Fetch audit ratio data
        const token = localStorage.getItem('JWT');
        const response = await fetchGraphQL(GET_AUDIT_RATIO_INFO, {}, token);
        
        if (!response || !response.data || !response.data.user) {
            throw new Error('No audit ratio data found');
        }

        const auditData = response.data.user[0];
        
        // Calculate done/received ratio
        const done = auditData.totalUp - auditData.totalUpBonus;
        const received = auditData.totalDown;
        
        container.innerHTML = /*html*/ `
        <div class="chart-border"></div>
        <h2 class="global-stats-title">Global Statistics</h2>
        <div class="global-stats-container">
            <div class="global-stat-card" id="audit-ratio-card">
                <div class="global-stat-icon">⚖️</div>
                <div class="global-stat-value">${auditData.auditRatio}</div>
                <div class="global-stat-label">Audit Ratio</div>
                <div class="global-stat-subtitle">Done / Received</div>
            </div>
            <div id="audits"></div>
            <div id="successful-projects"></div>
            <div id="failed-projects"></div>
            <div id="memory-game"></div>
            <div id="zzle-game"></div>
        </div>
        `;

        // Add click listener for audit ratio card
        document.getElementById('audit-ratio-card').addEventListener('click', () => {
            showAuditRatioPopup(auditData);
        });

        // Render all cards
        await renderAudits();
        await renderSuccessfulProjects();
        await renderFailedProjects();
        await renderMemoryGame();
        await renderZzleGame();

    } catch (error) {
        console.error('Error loading global statistics:', error);
        
        // Show error state
        container.innerHTML = /*html*/ `
        <div class="chart-border"></div>
        <h2 class="global-stats-title">Global Statistics</h2>
        <div class="global-stats-container">
            <div class="global-stat-card">
                <div class="global-stat-icon">⚖️</div>
                <div class="global-stat-value">--</div>
                <div class="global-stat-label">Audit Ratio</div>
                <div class="global-stat-subtitle">Error loading data</div>
            </div>
        </div>
        `;
        
        // Check if it's a JWT error
        if (error.message.includes('JWT') || error.message.includes('token')) {
            handleLogout();
        }
    }
};

