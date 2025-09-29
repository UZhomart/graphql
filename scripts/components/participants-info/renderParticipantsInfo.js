import { fetchGraphQL } from '../../api/graphqlRequests.js';
import { GET_PARTICIPANTS_INFO } from '../../api/graphql.js';
import { renderTeamworkStatus } from './teamworkStatus.js';
import './soloProjectsPopup.js';

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
                <div id="teamwork-status" class="teamwork-status"></div>
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

    // Search for participants - prioritize exact login match
    let foundParticipants = participantsData.filter(participant => 
        participant.login.toLowerCase() === searchTerm
    );
    
    // If no exact match, search for partial matches
    if (foundParticipants.length === 0) {
        foundParticipants = participantsData.filter(participant => 
            participant.login.toLowerCase().includes(searchTerm) ||
            (participant.firstName && participant.firstName.toLowerCase().includes(searchTerm)) ||
            (participant.lastName && participant.lastName.toLowerCase().includes(searchTerm))
        );
    }

    if (foundParticipants.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No participants found with that login</p>';
        return;
    }

    // Display results
    let html = '<div class="participants-list">';
    
    foundParticipants.forEach(participant => {
        const fullName = `${participant.firstName || ''} ${participant.lastName || ''}`.trim();
        const isExactMatch = participant.login.toLowerCase() === searchTerm;
        const cardClass = isExactMatch ? 'participant-card exact-match' : 'participant-card';
        
        html += `
            <div class="${cardClass}">
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
    
    // Load teamwork status for the first found participant
    if (foundParticipants.length > 0) {
        const firstParticipant = foundParticipants[0];
        // Store the searched user ID for teamwork status
        localStorage.setItem('searchedUserId', firstParticipant.id.toString());
        renderTeamworkStatus(firstParticipant.id);
    } else {
        // Clear teamwork status if no participants found
        const teamworkContainer = document.getElementById('teamwork-status');
        if (teamworkContainer) {
            teamworkContainer.innerHTML = '';
        }
    }
}
