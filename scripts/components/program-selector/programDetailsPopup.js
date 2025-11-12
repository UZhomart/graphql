import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { handleLogout } from "../../app/handleAuth.js";

export const showProgramDetailsPopup = async (program = 'core-education', type = 'xp') => {
    // Create popup overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = /*html*/ `
        <div class="program-popup">
            <div class="program-popup-header">
                <h3>
                    <span>📊</span>
                    ${getProgramName(program)} - ${getTypeTitle(type)}
                </h3>
                <button class="close-btn" id="close-program-popup">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="program-popup-content">
                <div class="loading" id="program-loading">Loading ${getTypeTitle(type).toLowerCase()}...</div>
                <div class="program-details" id="program-details" style="display: none;">
                    <!-- Content will be populated here -->
                </div>
                <div class="popup-footnote" id="popup-footnote" style="display: none; padding: 15px 0 0; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85em; color: var(--text-color-secondary);">
                    <sup style="color: var(--primary-color);">*</sup> <strong>What is a Transaction?</strong><br>
                    A Transaction = the moment when a project/assignment was successfully accepted (not a commit!). It's a record of XP awarded for completed work.
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Add close functionality
    const closeBtn = document.getElementById('close-program-popup');
    const closePopup = () => {
        document.body.removeChild(overlay);
    };

    closeBtn.addEventListener('click', closePopup);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Load program data
    await loadProgramData(program, type);
};

async function loadProgramData(program, type) {
    try {
        const token = localStorage.getItem("JWT");
        
        if (type === 'xp' || type === 'transactions') {
            await loadXPData(program, token, type);
        } else if (type === 'level') {
            await loadLevelData(program, token);
        }
        
    } catch (error) {
        if (typeof error === "string" && error.includes('JWTExpired')) handleLogout();
        
        document.getElementById('program-loading').innerHTML = 'Error loading program data';
    }
}

async function loadXPData(program, token, type) {
    const query = `
        query {
            user {
                transactions(where: {type: {_eq: "xp"}}, order_by: {createdAt: desc}) {
                    amount
                    createdAt
                    path
                    object {
                        name
                    }
                }
            }
        }
    `;
    
    // Get level data - different queries for different programs
    let levelQuery = '';
    switch(program) {
        case 'core-education':
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Module"}}}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                    }
                }
            `;
            break;
        case 'piscine-js':
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Piscine JS"}}}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                    }
                }
            `;
            break;
        case 'piscine-go':
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {path: {_like: "%piscinego%"}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                    }
                }
            `;
            break;
        default:
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Module"}}}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                    }
                }
            `;
    }
    
    const [response, levelResponse] = await Promise.all([
        fetchGraphQL(query, {}, token),
        fetchGraphQL(levelQuery, {}, token)
    ]);
    
    if (response.errors) {
        throw new Error(response.errors[0].message);
    }
    
    const transactions = response.data.user[0].transactions;
    
    // Filter transactions based on program using the same logic as renderAudits
    let programTransactions = [];
    switch(program) {
        case 'core-education':
            programTransactions = transactions.filter(t => 
                t.path && t.path.startsWith('/astanahub/module/') && !t.path.startsWith('/astanahub/module/piscine-js/')
            );
            break;
        case 'piscine-js':
            programTransactions = transactions.filter(t => 
                t.path && t.path.startsWith('/astanahub/module/piscine-js/')
            );
            break;
        case 'piscine-go':
            programTransactions = transactions.filter(t => 
                t.path && t.path.startsWith('/astanahub/piscinego/')
            );
            break;
        default:
            programTransactions = transactions;
    }
    
    // Get level from level query
    let level = 0;
    if (levelResponse.data && levelResponse.data.transaction && levelResponse.data.transaction[0]) {
        level = levelResponse.data.transaction[0].amount;
    }
    
    // Update popup with data
    updateXPDetails(programTransactions, type, level);
}

async function loadLevelData(program, token) {
    // Get level data - different queries for different programs
    let levelQuery = '';
    switch(program) {
        case 'core-education':
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Module"}}}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                        createdAt
                        path
                    }
                }
            `;
            break;
        case 'piscine-js':
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Piscine JS"}}}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                        createdAt
                        path
                    }
                }
            `;
            break;
        case 'piscine-go':
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {path: {_like: "%piscinego%"}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                        createdAt
                        path
                    }
                }
            `;
            break;
        default:
            levelQuery = `
                query {
                    transaction(
                        where: {_and: [{type: {_eq: "level"}}, {event: {object: {name: {_eq: "Module"}}}}]}
                        order_by: {amount: desc}
                        limit: 1
                    ) {
                        amount
                        createdAt
                        path
                    }
                }
            `;
    }
    
    const response = await fetchGraphQL(levelQuery, {}, token);
    
    if (response.errors) {
        throw new Error(response.errors[0].message);
    }
    
    const levelData = response.data.transaction[0];
    updateLevelDetails(levelData);
}

function updateXPDetails(transactions, type, level = 0) {
    const totalXP = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const detailsContainer = document.getElementById('program-details');
    const footnote = document.getElementById('popup-footnote');
    
    // Show footnote for XP and transactions types
    if (footnote && (type === 'xp' || type === 'transactions')) {
        footnote.style.display = 'block';
    } else if (footnote) {
        footnote.style.display = 'none';
    }
    
    if (type === 'xp') {
        detailsContainer.innerHTML = /*html*/ `
            <div class="xp-summary">
                <div class="summary-item">
                    <span class="summary-label">Total XP:</span>
                    <span class="summary-value">${Math.floor(totalXP)} KB</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Transactions:</span>
                    <span class="summary-value">${transactions.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Your Level:</span>
                    <span class="summary-value">${level} LVL</span>
                </div>
            </div>
            <div class="xp-transactions">
                <h4>Recent Transactions<sup style="color: var(--primary-color); font-size: 0.7em; cursor: help;">*</sup></h4>
                <div class="transactions-list" id="transactions-list">
                    ${transactions.length === 0 ? 
                        '<div class="no-data">No transactions found for this program</div>' :
                        transactions.map(transaction => /*html*/`
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <div class="transaction-name">${transaction.object?.name || transaction.path?.split('/').pop() || 'Unknown'}</div>
                                    <div class="transaction-path">${transaction.path || 'Unknown path'}</div>
                                    <div class="transaction-date">${new Date(transaction.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div class="transaction-xp">
                                    <span class="xp-amount">+${transaction.amount} XP</span>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    } else if (type === 'transactions') {
        detailsContainer.innerHTML = /*html*/ `
            <div class="xp-summary">
                <div class="summary-item">
                    <span class="summary-label">Total Transactions:</span>
                    <span class="summary-value">${transactions.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total XP:</span>
                    <span class="summary-value">${Math.floor(totalXP)}</span>
                </div>
            </div>
            <div class="xp-transactions">
                <h4>All Transactions<sup style="color: var(--primary-color); font-size: 0.7em; cursor: help;">*</sup></h4>
                <div class="transactions-list" id="transactions-list">
                    ${transactions.length === 0 ? 
                        '<div class="no-data">No transactions found for this program</div>' :
                        transactions.map(transaction => /*html*/`
                            <div class="transaction-item">
                                <div class="transaction-info">
                                    <div class="transaction-name">${transaction.object?.name || transaction.path?.split('/').pop() || 'Unknown'}</div>
                                    <div class="transaction-path">${transaction.path || 'Unknown path'}</div>
                                    <div class="transaction-date">${new Date(transaction.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div class="transaction-xp">
                                    <span class="xp-amount">+${transaction.amount} XP</span>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    }
    
    // Hide loading and show details
    document.getElementById('program-loading').style.display = 'none';
    document.getElementById('program-details').style.display = 'block';
}

function updateLevelDetails(levelData) {
    const detailsContainer = document.getElementById('program-details');
    const footnote = document.getElementById('popup-footnote');
    
    // Hide footnote for level type
    if (footnote) {
        footnote.style.display = 'none';
    }
    
    detailsContainer.innerHTML = /*html*/ `
        <div class="level-summary">
            <div class="summary-item">
                <span class="summary-label">Current Level:</span>
                <span class="summary-value">${levelData ? levelData.amount : 0}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Achieved:</span>
                <span class="summary-value">${levelData ? new Date(levelData.createdAt).toLocaleDateString() : 'Not achieved'}</span>
            </div>
        </div>
        <div class="level-info">
            <h4>Level Information</h4>
            <div class="level-details">
                <div class="level-item">
                    <span class="level-label">Path:</span>
                    <span class="level-value">${levelData ? levelData.path : 'Unknown'}</span>
                </div>
                <div class="level-item">
                    <span class="level-label">Status:</span>
                    <span class="level-value">${levelData ? 'Completed' : 'Not completed'}</span>
                </div>
            </div>
        </div>
    `;
    
    // Hide loading and show details
    document.getElementById('program-loading').style.display = 'none';
    document.getElementById('program-details').style.display = 'block';
}

function getProgramName(program) {
    switch(program) {
        case 'core-education':
            return 'Core Education';
        case 'piscine-js':
            return 'Piscine JS';
        case 'piscine-go':
            return 'Piscine Go';
        default:
            return 'Unknown Program';
    }
}

function getTypeTitle(type) {
    switch(type) {
        case 'xp':
            return 'Program XP';
        case 'level':
            return 'Your Level';
        case 'transactions':
            return 'Transactions';
        default:
            return 'Details';
    }
}
