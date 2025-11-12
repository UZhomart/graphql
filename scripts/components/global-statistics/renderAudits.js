import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_AUDITS_INFO } from "../../api/graphql.js";
import { handleLogout } from "../../app/handleAuth.js";
import { showAuditsPopup } from "./auditsPopup.js";

export const renderAudits = async () => {
    // Render audits
    const container = document.getElementById("audits");
    
    try {
        // Fetch audits data
        const token = localStorage.getItem('JWT');
        const response = await fetchGraphQL(GET_AUDITS_INFO, {}, token);
        
        if (!response || !response.data || !response.data.user) {
            throw new Error('No audits data found');
        }

        const auditsData = response.data.user[0];
        
        // Calculate values
        const succeeded = auditsData.audits_aggregate.aggregate.count;
        const failed = auditsData.failed_audits.aggregate.count;
        const total = succeeded + failed;
        
        container.innerHTML = /*html*/ `
        <div class="global-stat-card" id="audits-card">
            <div class="global-stat-icon">📊</div>
            <div class="global-stat-value">${total}</div>
            <div class="global-stat-label">Total Audits</div>
            <div class="global-stat-subtitle">Success / Failed</div>
        </div>
        `;

        // Add click listener for audits card
        document.getElementById('audits-card').addEventListener('click', () => {
            showAuditsPopup(auditsData);
        });

    } catch (error) {
        // Error loading audits
        
        // Show error state
        container.innerHTML = /*html*/ `
        <div class="global-stat-card">
            <div class="global-stat-icon">📊</div>
            <div class="global-stat-value">--</div>
            <div class="global-stat-label">Total Audits</div>
            <div class="global-stat-subtitle">Error loading data</div>
        </div>
        `;
        
        // Check if it's a JWT error
        if (error.message.includes('JWT') || error.message.includes('token')) {
            handleLogout();
        }
    }
};
