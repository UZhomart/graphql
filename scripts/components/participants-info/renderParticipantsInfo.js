import { fetchGraphQL } from '../../api/graphqlRequests.js';
import { GET_PARTICIPANTS_INFO, GET_EVENT_USER_LEVELS_BY_LOGIN } from '../../api/graphql.js';
import { renderTeamworkStatus } from './teamworkStatus.js';
import './soloProjectsPopup.js';
import './uniqueTeammatesPopup.js';
import './teamProjectsPopup.js';

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
                        <button id="clear-search-btn" class="clear-btn" title="Clear search">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div id="participant-results" class="participant-results"></div>
                <div id="participant-program-stats" class="participant-program-stats"></div>
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
            return;
        }
        
        const response = await fetchGraphQL(GET_PARTICIPANTS_INFO, {}, token);
        if (response && response.data && response.data.user_public_view) {
            participantsData = response.data.user_public_view;
        }
    } catch (error) {
        // Error loading participants data
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
    
    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }
}

function searchParticipant() {
    const searchInput = document.getElementById('participant-search');
    const resultsContainer = document.getElementById('participant-results');
    const programStatsContainer = document.getElementById('participant-program-stats');
    
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
        if (programStatsContainer) programStatsContainer.innerHTML = '';
        return;
    }

    // We render the info inline with circular stats; collapse the empty list area
    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('compact');
    
    // Load teamwork status and new components for the first found participant
    if (foundParticipants.length > 0) {
        const firstParticipant = foundParticipants[0];
        // Store the searched user ID for teamwork status
        localStorage.setItem('searchedUserId', firstParticipant.id.toString());
        
        // Render teamwork status for searched user
        renderTeamworkStatus(firstParticipant.id);

        // Render program-based circular stats for searched user
        renderParticipantProgramStats(firstParticipant);
    } else {
        // Clear components if no participants found
        const teamworkContainer = document.getElementById('teamwork-status');
        
        if (teamworkContainer) teamworkContainer.innerHTML = '';
        if (programStatsContainer) programStatsContainer.innerHTML = '';
        resultsContainer.classList.remove('compact');
    }
}

function clearSearch() {
    const searchInput = document.getElementById('participant-search');
    const resultsContainer = document.getElementById('participant-results');
    const teamworkContainer = document.getElementById('teamwork-status');
    const programStatsContainer = document.getElementById('participant-program-stats');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
    
    if (teamworkContainer) {
        teamworkContainer.innerHTML = '';
    }

    if (programStatsContainer) {
        programStatsContainer.innerHTML = '';
    }

    const resultsComp = document.getElementById('participant-results');
    if (resultsComp) resultsComp.classList.remove('compact');
}

async function renderParticipantProgramStats(participant) {
    const container = document.getElementById('participant-program-stats');
    if (!container) return;

    const token = localStorage.getItem('JWT');
    if (!token) return;

    // Loading state
    container.innerHTML = `<div class="tables-loading">Loading program data…</div>`;

    try {
        const login = participant.login;
        const response = await fetchGraphQL(
            GET_EVENT_USER_LEVELS_BY_LOGIN,
            { login },
            token
        );

        const data = response && response.data ? response.data : {};
        const core = Array.isArray(data.core) && data.core.length ? data.core[0] : null;
        const piscineJs = Array.isArray(data.piscine_js) && data.piscine_js.length 
            ? data.piscine_js.reduce((best, cur) => (best && best.level > cur.level ? best : cur), null)
            : null;
        const piscineGo = Array.isArray(data.piscine_go) && data.piscine_go.length 
            ? data.piscine_go.reduce((best, cur) => (best && best.level > cur.level ? best : cur), null)
            : null;

        const auditRatio = core && typeof core.userAuditRatio === 'number'
            ? core.userAuditRatio
            : (core && core.userAuditRatio) || '—';
        const coreLevel = core ? (core.level ?? '—') : '—';
        const jsLevel = piscineJs ? (piscineJs.level ?? '—') : '—';
        const goLevel = piscineGo ? (piscineGo.level ?? '—') : '—';

        const auditDisplay = typeof auditRatio === 'number' ? auditRatio.toFixed(4) : auditRatio;

        const fullName = `${participant.firstName || ''} ${participant.lastName || ''}`.trim() || 'Not specified';

        container.innerHTML = `
            <div class="participant-circles-row five-cols">
                <div class="program-stat-card info-card">
                    <div class="info-lines">
                        <div class="mini-row"><span class="mini-label">ID</span><span class="mini-value">${participant.id}</span></div>
                        <div class="mini-row"><span class="mini-label">Login</span><span class="mini-value">${participant.login}</span></div>
                        <div class="mini-row"><span class="mini-label">Name</span><span class="mini-value">${fullName}</span></div>
                    </div>
                </div>
                <div class="program-stat-card">
                    <div class="stat-circle">
                        <span class="stat-number">${auditDisplay}</span>
                        <span class="stat-unit">AR</span>
                    </div>
                    <div class="stat-label">Audit Ratio</div>
                </div>
                <div class="program-stat-card">
                    <div class="stat-circle">
                        <span class="stat-number">${coreLevel}</span>
                        <span class="stat-unit">LVL</span>
                    </div>
                    <div class="stat-label">Core Education</div>
                </div>
                <div class="program-stat-card">
                    <div class="stat-circle">
                        <span class="stat-number">${jsLevel}</span>
                        <span class="stat-unit">LVL</span>
                    </div>
                    <div class="stat-label">Piscine JS</div>
                </div>
                <div class="program-stat-card">
                    <div class="stat-circle">
                        <span class="stat-number">${goLevel}</span>
                        <span class="stat-unit">LVL</span>
                    </div>
                    <div class="stat-label">Piscine GO</div>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="tables-error">Failed to load program data</div>`;
        // Failed to load event user levels
    }
}
