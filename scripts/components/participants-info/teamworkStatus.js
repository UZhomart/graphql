import { fetchGraphQL } from '../../api/graphqlRequests.js';
import { GET_TEAMWORK_INFO_V3, GET_FINISHED_PROJECT_GROUPS, GET_AUDITS_FOR_GROUPS } from '../../api/graphql.js';
import './uniqueTeammatesPopup.js';
import './teamProjectsPopup.js';

let teamworkData = {};

export async function renderTeamworkStatus(userId) {
    const container = document.getElementById('teamwork-status');
    if (!container) return;

    // Store current user ID for filtering
    localStorage.setItem('currentUserId', userId.toString());

    container.innerHTML = `
        <div class="teamwork-section">
            <h3 class="teamwork-title">🤝 Teamwork Status (Core education) (only succeeded projects)</h3>
            <div class="teamwork-container">
                <div class="teamwork-loading" id="teamwork-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading teamwork data...</p>
                </div>
                <div class="teamwork-content" id="teamwork-content" style="display: none;">
                    <div class="teamwork-summary" id="teamwork-summary"></div>
                    <div class="teammates-list" id="teammates-list"></div>
                </div>
                <div class="teamwork-error" id="teamwork-error" style="display: none;">
                    <p>❌ Unable to load teamwork data</p>
                </div>
            </div>
        </div>
    `;

    await loadTeamworkData(userId);
}

async function loadTeamworkData(userId) {
    const loadingEl = document.getElementById('teamwork-loading');
    const contentEl = document.getElementById('teamwork-content');
    const errorEl = document.getElementById('teamwork-error');

    try {
        const token = localStorage.getItem('JWT');
        if (!token) {
            throw new Error('No JWT token found');
        }

        console.log('Loading teamwork data for userId:', userId);
        
        // First, get all finished project groups for this user
        console.log('Step 1: Getting finished project groups for userId:', userId);
        const groupsResponse = await fetchGraphQL(GET_FINISHED_PROJECT_GROUPS, { userId }, token);
        console.log('Finished groups response:', groupsResponse);
        
        if (groupsResponse && groupsResponse.errors) {
            console.error('GraphQL errors:', groupsResponse.errors);
            console.error('Detailed error:', JSON.stringify(groupsResponse.errors, null, 2));
        }
        
        if (!groupsResponse || !groupsResponse.data || !groupsResponse.data.group) {
            throw new Error('No finished project groups found');
        }
        
        const allFinishedGroupIds = groupsResponse.data.group.map(g => g.id);
        console.log('All finished group IDs:', allFinishedGroupIds);
        console.log('Sample finished groups:', groupsResponse.data.group.slice(0, 3));
        
        console.log('\n=== Project details for each of 14 projects ===');
        groupsResponse.data.group.forEach(group => {
            console.log(`Group ${group.id} (${group.object.name}): status=${group.status}, type=${group.object.type}`);
        });
        
        if (allFinishedGroupIds.length === 0) {
            console.log('No finished projects found');
            teamworkData = [];
            displayTeamworkData();
            loadingEl.style.display = 'none';
            contentEl.style.display = 'block';
            return;
        }
        
        // Second, get ALL audits for these groups
        console.log('Step 2: Getting ALL audits for groups...');
        const auditsResponse = await fetchGraphQL(GET_AUDITS_FOR_GROUPS, { groupIds: allFinishedGroupIds }, token);
        console.log('Succeeded audits response:', auditsResponse);
        
        if (auditsResponse && auditsResponse.errors) {
            console.error('GraphQL errors for audits:', auditsResponse.errors);
        }
        
        // Log audit analysis
        if (auditsResponse && auditsResponse.data && auditsResponse.data.audit) {
            console.log('Total audits found:', auditsResponse.data.audit.length);
            console.log('All audits:', auditsResponse.data.audit);
            
            const closureTypeCounts = {};
            const auditsByGroup = {};
            
            auditsResponse.data.audit.forEach(audit => {
                closureTypeCounts[audit.closureType] = (closureTypeCounts[audit.closureType] || 0) + 1;
                if (!auditsByGroup[audit.groupId]) {
                    auditsByGroup[audit.groupId] = [];
                }
                auditsByGroup[audit.groupId].push(audit.closureType);
            });
            
            console.log('Closure type distribution:', closureTypeCounts);
            console.log('\n=== Audit status for each of 14 projects ===');
            
            allFinishedGroupIds.forEach(groupId => {
                const audits = auditsByGroup[groupId] || [];
                console.log(`Group ${groupId}: ${audits.length > 0 ? audits.join(', ') : 'NO AUDITS'}`);
            });
        }
        
        // Start with all finished groups
        let succeededGroupIds = [...allFinishedGroupIds];
        
        // Remove groups that have failed audits
        if (auditsResponse && auditsResponse.data && auditsResponse.data.audit) {
            const failedGroupIds = new Set(
                auditsResponse.data.audit
                    .filter(audit => audit.closureType === 'failed' || audit.closureType === 'autoFailed')
                    .map(audit => audit.groupId)
            );
            
            console.log('Failed group IDs to exclude:', [...failedGroupIds]);
            succeededGroupIds = succeededGroupIds.filter(groupId => !failedGroupIds.has(groupId));
        }
        
        console.log('Final group IDs to process (all finished except failed):', succeededGroupIds.length);
        
        // Fourth, get teamwork data for these groups
        console.log('Step 3: Getting teamwork data for groups...');
        const response = await fetchGraphQL(GET_TEAMWORK_INFO_V3, { userId, groupIds: succeededGroupIds }, token);
        console.log('Teamwork response:', response);
        
        if (response && response.data && response.data.group_user) {
            teamworkData = response.data.group_user;
            console.log('Teamwork data loaded:', teamworkData);
            displayTeamworkData();
            loadingEl.style.display = 'none';
            contentEl.style.display = 'block';
        } else if (response && response.errors) {
            console.error('GraphQL errors:', response.errors);
            throw new Error(`GraphQL errors: ${response.errors.map(e => e.message).join(', ')}`);
        } else {
            console.log('No teamwork data found - user may not have team projects');
            teamworkData = [];
            displayTeamworkData();
            loadingEl.style.display = 'none';
            contentEl.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading teamwork data:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.innerHTML = `<p>❌ Error: ${error.message}</p>`;
    }
}

function displayTeamworkData() {
    const summaryEl = document.getElementById('teamwork-summary');
    const teammatesEl = document.getElementById('teammates-list');

    if (!teamworkData || teamworkData.length === 0) {
        summaryEl.innerHTML = `
            <div class="no-teamwork">
                <h4>📝 No Teamwork Data</h4>
                <p>This user hasn't completed any team projects yet.</p>
            </div>
        `;
        teammatesEl.innerHTML = '';
        return;
    }

    // Group teammates by user (excluding current user and solo projects)
    const teammatesMap = {};
    const currentUserId = parseInt(document.querySelector('[data-user-id]')?.getAttribute('data-user-id')) || 
                         parseInt(localStorage.getItem('currentUserId')) || 0;
    
    // First, identify team projects (groups with more than 1 member)
    const groupMemberCounts = {};
    teamworkData.forEach(item => {
        const groupId = item.group.id;
        if (!groupMemberCounts[groupId]) {
            groupMemberCounts[groupId] = new Set();
        }
        groupMemberCounts[groupId].add(item.user.id);
    });
    
    teamworkData.forEach(item => {
        const userId = item.user.id;
        const groupId = item.group.id;
        
        // Skip current user
        if (userId === currentUserId) return;
        
        // Skip solo projects (groups with only 1 member)
        if (groupMemberCounts[groupId].size <= 1) return;
        
        if (!teammatesMap[userId]) {
            teammatesMap[userId] = {
                user: item.user,
                projects: []
            };
        }
        teammatesMap[userId].projects.push(item.group);
    });

    const teammates = Object.values(teammatesMap);
    const uniqueTeammates = teammates.length;
    
    // Count unique team projects (projects with multiple participants)
    const teamProjectNames = new Set();
    Object.keys(groupMemberCounts).forEach(groupId => {
        if (groupMemberCounts[groupId].size > 1) {
            const projectName = teamworkData.find(item => item.group.id === parseInt(groupId))?.group.object.name;
            if (projectName) {
                teamProjectNames.add(projectName);
            }
        }
    });
    
    const uniqueProjects = teamProjectNames.size;
    const totalCollaborations = teamworkData.filter(item => groupMemberCounts[item.group.id].size > 1).length;
    
    // Count solo projects (projects with only 1 member)
    const soloProjectNames = new Set();
    Object.keys(groupMemberCounts).forEach(groupId => {
        if (groupMemberCounts[groupId].size === 1) {
            const projectName = teamworkData.find(item => item.group.id === parseInt(groupId))?.group.object.name;
            if (projectName) {
                soloProjectNames.add(projectName);
            }
        }
    });
    const soloProjects = soloProjectNames.size;
    
    // Store solo projects data for popup
    const soloProjectsData = Array.from(soloProjectNames).map(projectName => {
        const projectData = teamworkData.find(item => 
            item.group.object.name === projectName && 
            groupMemberCounts[item.group.id].size === 1
        );
        return {
            name: projectName,
            status: projectData?.group.status || 'unknown',
            updatedAt: projectData?.group.updatedAt || null
        };
    }).sort((a, b) => {
        // Sort by updatedAt descending (newest first)
        if (a.updatedAt && b.updatedAt) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        return 0;
    });
    
    // Store in global scope for popup access
    window.soloProjectsData = soloProjectsData;
    window.uniqueTeammatesData = teammates;
    
    // Store team projects data for popup
    const teamProjectsData = Array.from(teamProjectNames).map(projectName => {
        const projectData = teamworkData.find(item => 
            item.group.object.name === projectName && 
            groupMemberCounts[item.group.id].size > 1
        );
        return {
            name: projectName,
            status: projectData?.group.status || 'unknown',
            updatedAt: projectData?.group.updatedAt || null,
            type: projectData?.group.object.type || 'Core'
        };
    }).sort((a, b) => {
        // Sort by updatedAt descending (newest first)
        if (a.updatedAt && b.updatedAt) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        }
        return 0;
    });
    window.teamProjectsData = teamProjectsData;

    // Sort teammates by number of projects (descending)
    teammates.sort((a, b) => b.projects.length - a.projects.length);

    // Summary
    summaryEl.innerHTML = `
        <div class="teamwork-stats">
            <div class="stat-item" onclick="showUniqueTeammatesPopup()">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                    <div class="stat-number">${uniqueTeammates}</div>
                    <div class="stat-label">Unique Teammates</div>
                    <div class="stat-description">Different people worked together</div>
                </div>
            </div>
            <div class="stat-item" onclick="showTeamProjectsPopup()">
                <div class="stat-icon">📁</div>
                <div class="stat-info">
                    <div class="stat-number">${uniqueProjects}</div>
                    <div class="stat-label">Team Projects</div>
                    <div class="stat-description">Unique collaborative projects</div>
                </div>
            </div>
            <div class="stat-item" onclick="showSoloProjectsPopup()">
                <div class="stat-icon">👤</div>
                <div class="stat-info">
                    <div class="stat-number">${soloProjects}</div>
                    <div class="stat-label">Solo Projects</div>
                    <div class="stat-description">Individual projects completed</div>
                </div>
            </div>
        </div>
    `;

    // Teammates list
    teammatesEl.innerHTML = `
        <div class="teammates-header">
            <h4>🤝 Teammates & Projects</h4>
        </div>
        <div class="teammates-grid">
            ${teammates.map(teammate => `
                <div class="teammate-card">
                    <div class="teammate-header">
                        <div class="teammate-info">
                            <div class="teammate-name">${teammate.user.firstName || ''} ${teammate.user.lastName || ''}</div>
                            <div class="teammate-login">@${teammate.user.login}</div>
                        </div>
                        <div class="projects-count">
                            <span class="count-badge">${teammate.projects.length}</span>
                            <span class="count-label">project${teammate.projects.length > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <div class="projects-list">
                        ${teammate.projects.map(project => `
                            <div class="project-item">
                                <div class="project-name">${project.object.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
