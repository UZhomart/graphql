import { fetchGraphQL } from '../../api/graphqlRequests.js';
import { GET_PARTICIPANTS_INFO } from '../../api/graphql.js';

let participantsData = [];

export async function renderParticipantsInfo() {
    const container = document.getElementById('participants-info');
    if (!container) return;

    container.innerHTML = `
        <div class="participants-section">
            <h2 class="section-title">👥 Participants Info</h2>
            <div class="participants-container">
                <div class="search-container">
                    <div class="search-input-group">
                        <input 
                            type="text" 
                            id="participant-search" 
                            placeholder="Enter participant login..." 
                            class="search-input"
                        >
                        <button id="search-participant-btn" class="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div id="participant-results" class="participant-results"></div>
            </div>
        </div>
    `;

    // Load participants data
    await loadParticipantsData();
    
    // Setup event listeners
    setupEventListeners();
}

async function loadParticipantsData() {
    try {
        const token = localStorage.getItem('JWT');
        if (!token) {
            console.error('No JWT token found');
            return;
        }
        
        const response = await fetchGraphQL(GET_PARTICIPANTS_INFO, {}, token);
        if (response && response.data && response.data.user_public_view) {
            participantsData = response.data.user_public_view;
            console.log('Participants data loaded:', participantsData.length, 'users');
        } else {
            console.error('No participants data received:', response);
        }
    } catch (error) {
        console.error('Error loading participants data:', error);
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('participant-search');
    const searchBtn = document.getElementById('search-participant-btn');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchParticipant();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', searchParticipant);
    }
}

function searchParticipant() {
    const searchInput = document.getElementById('participant-search');
    const resultsContainer = document.getElementById('participant-results');
    
    if (!searchInput || !resultsContainer) return;

    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p class="no-results">Please enter a login to search</p>';
        return;
    }

    // Search for participants
    const foundParticipants = participantsData.filter(participant => 
        participant.login.toLowerCase().includes(searchTerm) ||
        (participant.firstName && participant.firstName.toLowerCase().includes(searchTerm)) ||
        (participant.lastName && participant.lastName.toLowerCase().includes(searchTerm))
    );

    if (foundParticipants.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No participants found with that login</p>';
        return;
    }

    // Display results
    let html = '<div class="participants-list">';
    
    foundParticipants.forEach(participant => {
        const fullName = `${participant.firstName || ''} ${participant.lastName || ''}`.trim();
        html += `
            <div class="participant-card">
                <div class="participant-info">
                    <div class="participant-id">
                        <span class="label">ID:</span>
                        <span class="value">${participant.id}</span>
                    </div>
                    <div class="participant-login">
                        <span class="label">Login:</span>
                        <span class="value">${participant.login}</span>
                    </div>
                    <div class="participant-name">
                        <span class="label">Name:</span>
                        <span class="value">${fullName || 'Not specified'}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}
