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
        <div class="project-card" id="successful-projects-card">
            <div class="project-icon">✅</div>
            <div class="project-value">${successfulProjects.length}</div>
            <div class="project-label">Successful Projects</div>
            <div class="project-subtitle">Completed</div>
        </div>
        `;

        // Add click listener for successful projects card
        document.getElementById('successful-projects-card').addEventListener('click', () => {
            showSuccessfulProjectsPopup(successfulProjects);
        });

    } catch (error) {
        console.error('Error loading successful projects:', error);
        
        // Show error state
        container.innerHTML = /*html*/ `
        <div class="project-card">
            <div class="project-icon">✅</div>
            <div class="project-value">--</div>
            <div class="project-label">Successful Projects</div>
            <div class="project-subtitle">Error loading data</div>
        </div>
        `;
        
        // Check if it's a JWT error
        if (error.message.includes('JWT') || error.message.includes('token')) {
            handleLogout();
        }
    }
};
