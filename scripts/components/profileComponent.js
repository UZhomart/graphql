import { handleLogout } from "../app/handleAuth.js";
import { renderActivityHeatmap } from "./graphs/activityHeatmap.js";
import { renderProgressLineChart } from "./graphs/progressLineChart.js";
import { renderProfileInfo } from "./profile/renderProfileInfo.js";
import { renderProgramSelector } from "./program-selector/renderProgramSelector.js";
import { renderGlobalStatistics } from "./global-statistics/renderGlobalStatistics.js";
import { renderParticipantsInfo } from "./participants-info/renderParticipantsInfo.js";

export const renderProfilePage = (user) => {
    document.body.innerHTML = ``;

    // Create container
    const container = document.createElement('div');
    container.className = "main-container";
    container.innerHTML = /*html*/ `
    <div class="profile">
        <div class="profile-header">
            <div class="user-greeting">
                <h1>Welcome, <span class="user-name">${user.firstName} ${user.lastName}</span>!</h1>
                <p>Here’s your dashboard overview.</p>
            </div>
            <button id="logout-button" class="btn logout-btn">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </button>
        </div>
        <div class="profile-container">
            <div id="profile-info"></div>
            <div id="program-selector"></div>
            <div id="global-statistics"></div>
            <div id="activity-heatmap"></div>
            <div id="progress-line-chart"></div>
            <div id="transaction-info"></div>
            <div id="participants-info"></div>
        </div>
    </div>`;

    document.body.appendChild(container);
    document.getElementById('logout-button')?.addEventListener('click', handleLogout);

    renderProfileInfo()
    renderProgramSelector()
    renderGlobalStatistics()
    
    // Render Activity Heatmap for current user
    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    if (currentUserId) {
        renderActivityHeatmap(currentUserId);
        renderProgressLineChart(currentUserId);
    }
    
    renderParticipantsInfo()
};
