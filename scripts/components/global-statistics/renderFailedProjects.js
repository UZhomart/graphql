import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_PROJECTS_INFO } from "../../api/graphql.js";
import { handleLogout } from "../../app/handleAuth.js";
import { showFailedProjectsPopup } from "./failedProjectsPopup.js";

export const renderFailedProjects = async () => {
    // Render failed projects
    const container = document.getElementById("failed-projects");
    
    try {
        // Fetch projects data
        const token = localStorage.getItem('JWT');
        const response = await fetchGraphQL(GET_PROJECTS_INFO, {}, token);
        
        if (!response || !response.data || !response.data.progress) {
            throw new Error('No projects data found');
        }

        const projectsData = response.data.progress;
        
        // Filter failed projects (grade < 1)
        const failedProjects = projectsData.filter(p => p.grade !== null && p.grade < 1);
        
        container.innerHTML = /*html*/ `
        <div class="global-stat-card" id="failed-projects-card">
            <div class="global-stat-icon">❌</div>
            <div class="global-stat-value">${failedProjects.length}</div>
            <div class="global-stat-label">Failed Projects</div>
            <div class="global-stat-subtitle">Not Completed</div>
        </div>
        `;

        // Add click listener for failed projects card
        document.getElementById('failed-projects-card').addEventListener('click', () => {
            showFailedProjectsPopup(failedProjects);
        });

    } catch (error) {
        // Error loading failed projects
        
        // Show error state
        container.innerHTML = /*html*/ `
        <div class="global-stat-card">
            <div class="global-stat-icon">❌</div>
            <div class="global-stat-value">--</div>
            <div class="global-stat-label">Failed Projects</div>
            <div class="global-stat-subtitle">Error loading data</div>
        </div>
        `;
        
        // Check if it's a JWT error
        if (error.message.includes('JWT') || error.message.includes('token')) {
            handleLogout();
        }
    }
};
