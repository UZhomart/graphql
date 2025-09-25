import { handleLogout } from "../app/handleAuth.js";
import { renderSkillsChart } from "./graphs/skillsChart.js";
import { renderTransactionsChart } from "./graphs/transactionsChart.js";
import { renderProfileInfo } from "./profile/renderProfileInfo.js";
import { renderProgramSelector } from "./program-selector/renderProgramSelector.js";
import { renderGlobalStatistics } from "./global-statistics/renderGlobalStatistics.js";

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
            <div id="transaction-info"></div>
            <div id="transactions-chart"></div>
            <div id="skills-chart"></div>
        </div>
    </div>`;

    document.body.appendChild(container);
    document.getElementById('logout-button')?.addEventListener('click', handleLogout);

    renderProfileInfo()
    renderProgramSelector()
    renderGlobalStatistics()
    renderSkillsChart()
    renderTransactionsChart()
};
