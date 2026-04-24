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

    await loadParticipantsData();
    setupEventListeners();
}

async function loadParticipantsData() {
    try {
        const token = localStorage.getItem('JWT');
        if (!token) return;

        const response = await fetchGraphQL(GET_PARTICIPANTS_INFO, {}, token);
        if (response && response.data && response.data.user_public_view) {
            participantsData = response.data.user_public_view;
        }
    } catch (error) { }
}

function setupEventListeners() {
    const searchInput = document.getElementById('participant-search');
    const searchBtn = document.getElementById('search-participant-btn');
    const clearBtn = document.getElementById('clear-search-btn');

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchParticipant();
        });
    }

    if (searchBtn) searchBtn.addEventListener('click', searchParticipant);
    if (clearBtn) clearBtn.addEventListener('click', clearSearch);

    document.addEventListener('click', (e) => {
        const teammateBtn = e.target.closest('.clickable-teammate');
        if (teammateBtn) {
            const login = teammateBtn.dataset.login;
            if (login && searchInput) {
                searchInput.value = login;
                searchParticipant();
            }
        }
    });
}

function searchParticipant() {
    const searchInput = document.getElementById('participant-search');
    const resultsContainer = document.getElementById('participant-results');
    const programStatsContainer = document.getElementById('participant-program-stats');
    const teamworkContainer = document.getElementById('teamwork-status');

    if (!searchInput || !resultsContainer) return;
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        resultsContainer.innerHTML = '<p class="no-results">Please enter a login to search</p>';
        return;
    }

    let foundParticipants = participantsData.filter(p => p.login.toLowerCase() === searchTerm);
    if (foundParticipants.length === 0) {
        foundParticipants = participantsData.filter(p =>
            p.login.toLowerCase().includes(searchTerm) ||
            (p.firstName && p.firstName.toLowerCase().includes(searchTerm)) ||
            (p.lastName && p.lastName.toLowerCase().includes(searchTerm))
        );
    }

    if (foundParticipants.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No participants found</p>';
        if (programStatsContainer) programStatsContainer.innerHTML = '';
        if (teamworkContainer) teamworkContainer.innerHTML = '';
        return;
    }

    resultsContainer.innerHTML = '';
    resultsContainer.classList.add('compact');

    const firstParticipant = foundParticipants[0];
    localStorage.setItem('searchedUserId', firstParticipant.id.toString());
    renderTeamworkStatus(firstParticipant.id);
    renderParticipantProgramStats(firstParticipant);
}

function clearSearch() {
    const searchInput = document.getElementById('participant-search');
    const resultsContainer = document.getElementById('participant-results');
    const teamworkContainer = document.getElementById('teamwork-status');
    const programStatsContainer = document.getElementById('participant-program-stats');

    if (searchInput) searchInput.value = '';
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('compact');
    }
    if (teamworkContainer) teamworkContainer.innerHTML = '';
    if (programStatsContainer) programStatsContainer.innerHTML = '';
}

async function renderParticipantProgramStats(participant) {
    const container = document.getElementById('participant-program-stats');
    if (!container) return;

    const token = localStorage.getItem('JWT');
    if (!token) return;

    container.innerHTML = `<div class="tables-loading">Loading program data…</div>`;

    try {
        const login = participant.login;
        const response = await fetchGraphQL(GET_EVENT_USER_LEVELS_BY_LOGIN, { login }, token);
        const data = response && response.data ? response.data : {};

        const core = Array.isArray(data.core) && data.core.length ? data.core[0] : null;
        const jsStats = calcPiscineStats(data.piscine_js);
        const goStats = calcPiscineStats(data.piscine_go);
        const aiStats = calcPiscineStats(data.piscine_ai);
        const rustStats = calcPiscineStats(data.piscine_rust);

        const auditRatio = core && typeof core.userAuditRatio === 'number' ? core.userAuditRatio : '—';
        const coreLevel = core ? (core.level ?? '—') : '—';
        const auditDisplay = typeof auditRatio === 'number' ? auditRatio.toFixed(4) : auditRatio;
        const fullName = `${participant.firstName || ''} ${participant.lastName || ''}`.trim() || 'Not specified';

        container.innerHTML = `
            <div class="participant-circles-row seven-cols">
                <div class="program-stat-card info-card">
                    <div class="info-lines">
                        <div class="mini-row"><span class="mini-label">ID</span><span class="mini-value">${participant.id}</span></div>
                        <div class="mini-row"><span class="mini-label">Login</span><span class="mini-value">${participant.login}</span></div>
                        <div class="mini-row"><span class="mini-label">Name</span><span class="mini-value">${fullName}</span></div>
                        <div class="mini-row">
                            <span class="mini-label">Access</span>
                            <span class="mini-value status-badge ${participant.canAccessPlatform ? 'status-active' : 'status-blocked'}">
                                ${participant.canAccessPlatform ? 'Active' : 'Blocked'}
                            </span>
                        </div>
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
                ${buildPiscineCard('Piscine JS', jsStats)}
                ${buildPiscineCard('Piscine GO', goStats)}
                ${buildPiscineCard('Piscine AI', aiStats)}
                ${buildPiscineCard('Piscine Rust', rustStats)}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="tables-error">Failed to load program data</div>`;
    }
}

function calcPiscineStats(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    let bestLevel = 0;
    for (const entry of arr) {
        const lvl = entry.level ?? 0;
        if (lvl > bestLevel) bestLevel = lvl;
    }
    return { attempts: arr.length, bestLevel };
}

function buildPiscineCard(label, stats) {
    const lvl = stats ? stats.bestLevel : '—';
    return `
    <div class="program-stat-card">
        <div class="stat-circle">
            <span class="stat-number">${lvl}</span>
            <span class="stat-unit">LVL</span>
        </div>
        <div class="stat-label">${label}</div>
    </div>`;
}
