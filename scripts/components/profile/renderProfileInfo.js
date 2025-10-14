import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_USER_PROFILE_INFO } from "../../api/graphql.js";
import { handleLogout } from "../../app/handleAuth.js";

export const renderProfileInfo = async () => {
    // Fetch profile info
    const token = localStorage.getItem("JWT");
    let data;

    await fetchGraphQL(GET_USER_PROFILE_INFO, {}, token)
        .then((response) => {
            if (Array.isArray(response.errors)) {
                throw response.errors[0].message;
            }

            if (response && response.data.user[0]) {
                data = response.data.user[0];
                // Store current user ID for teamwork filtering
                localStorage.setItem('currentUserId', data.id.toString());
            } else {
                throw new Error("Invalid data received!");
            }
        })
        .catch((error) => {
            if (typeof error === "string" && error.includes('JWTExpired')) {
                handleLogout();
                return;
            }
            console.error(error);
            // Set data to null if there was an error
            data = null;
        });

    // Render profile info
    const container = document.getElementById("profile-info");

    // Check if data is available before rendering
    if (!data) {
        container.innerHTML = /*html*/ `
        <div class="chart-border"></div>
        <h2 class="profile-title">Profile Information</h2>
        <div class="profile-info-container">
            <div class="profile-main-info">
                <div class="profile-info-item">
                    <span class="profile-label">Error:</span>
                    <span class="profile-value">Failed to load profile data</span>
                </div>
            </div>
        </div>
        `;
        return;
    }

    container.innerHTML = /*html*/ `
    <div class="chart-border"></div>
    <h2 class="profile-title">Profile Information</h2>
    <div class="profile-info-container">
        <div class="profile-main-info">
            <div class="profile-info-item">
                <span class="profile-label">ID:</span>
                <span class="profile-value">${data.id}</span>
            </div>
            <div class="profile-info-item">
                <span class="profile-label">Login:</span>
                <span class="profile-value">${data.login}</span>
            </div>
            <div class="profile-info-item">
                <span class="profile-label">Full Name:</span>
                <span class="profile-value">${data.firstName} ${data.lastName}</span>
            </div>
            <div class="profile-info-item">
                <span class="profile-label">Member since:</span>
                <span class="profile-value">${new Date(data.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="profile-info-item">
                <span class="profile-label">Email:</span>
                <span class="profile-value">${data.email || 'Not specified'}</span>
            </div>
        </div>
        
        <div class="profile-more-section">
            <button id="more-info-btn" class="more-info-btn">
                <i class="fa-solid fa-chevron-down"></i> More
            </button>
            
            <div id="additional-info" class="additional-info hidden">
                <div class="profile-info-grid">
                    <div class="profile-info-item">
                        <span class="profile-label">First Name:</span>
                        <span class="profile-value">${data.firstName || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Last Name:</span>
                        <span class="profile-value">${data.lastName || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Name in Cyrillic:</span>
                        <span class="profile-value">${data.attrs?.firstNameCyr || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Phone:</span>
                        <span class="profile-value">${data.attrs?.phone || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Gender:</span>
                        <span class="profile-value">${data.attrs?.gender || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Date of Birth:</span>
                        <span class="profile-value">${formatDateOfBirth(data.attrs?.dateOfBirth)}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Country:</span>
                        <span class="profile-value">${data.attrs?.addressCountry || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">City:</span>
                        <span class="profile-value">${data.attrs?.addressCity || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Street:</span>
                        <span class="profile-value">${data.attrs?.addressStreet || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Place of Birth:</span>
                        <span class="profile-value">${data.attrs?.placeOfBirth || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Emergency Last Name:</span>
                        <span class="profile-value">${data.attrs?.emergencyLastName || 'Not specified'}</span>
                    </div>
                    <div class="profile-info-item">
                        <span class="profile-label">Emergency First Name:</span>
                        <span class="profile-value">${data.attrs?.emergencyFirstName || 'Not specified'}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

    // Add event listener for more button
    const moreBtn = document.getElementById('more-info-btn');
    const additionalInfo = document.getElementById('additional-info');
    
    moreBtn.addEventListener('click', () => {
        const isHidden = additionalInfo.classList.contains('hidden');
        
        if (isHidden) {
            additionalInfo.classList.remove('hidden');
            moreBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i> Less';
        } else {
            additionalInfo.classList.add('hidden');
            moreBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i> More';
        }
    });
};

// Helper function to format date of birth
function formatDateOfBirth(dateString) {
    if (!dateString) return 'Not specified';
    
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    } catch (error) {
        return 'Invalid date';
    }
}
