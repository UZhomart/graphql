import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_PROJECTS_INFO } from "../../api/graphql.js";
import { handleLogout } from "../../app/handleAuth.js";
import { showSuccessfulProjectsPopup } from "./successfulProjectsPopup.js";

export const renderSuccessfulProjects = async () => {
    // Render successful projects
    const container = document.getElementById("successful-projects");
    
    try {
        // Fetch projects data
        const token = localStorage.getItem('JWT');
        const response = await fetchGraphQL(GET_PROJECTS_INFO, {}, token);
        
        if (!response || !response.data || !response.data.progress) {
            throw new Error('No projects data found');
        }

        const projectsData = response.data.progress;
        
        // Filter successful projects (grade >= 1)
        const successfulProjects = projectsData.filter(p => p.grade !== null && p.grade >= 1);
        
        container.innerHTML = /*html*/ `
        <div class="global-stat-card" id="successful-projects-card">
            <div class="global-stat-icon">✅</div>
            <div class="global-stat-value">${successfulProjects.length}</div>
            <div class="global-stat-label">Successful Projects</div>
            <div class="global-stat-subtitle">Completed</div>
        </div>
        `;

        // Add click listener for successful projects card
        document.getElementById('successful-projects-card').addEventListener('click', () => {
            showSuccessfulProjectsPopup(successfulProjects);
        });

    } catch (error) {
        // Error loading successful projects
        
        // Show error state
        container.innerHTML = /*html*/ `
        <div class="global-stat-card">
            <div class="global-stat-icon">✅</div>
            <div class="global-stat-value">--</div>
            <div class="global-stat-label">Successful Projects</div>
            <div class="global-stat-subtitle">Error loading data</div>
        </div>
        `;
        
        // Check if it's a JWT error
        if (error.message.includes('JWT') || error.message.includes('token')) {
            handleLogout();
        }
    }
};
