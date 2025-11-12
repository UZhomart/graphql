import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_USER_PROFILE_INFO } from "../../api/graphql.js";
import { handleLogout } from "../../app/handleAuth.js";
import { showProgramDetailsPopup } from "./programDetailsPopup.js";

let currentProgram = 'core-education';

export const renderProgramSelector = async () => {
    // Render program selector
    const container = document.getElementById("program-selector");

    container.innerHTML = /*html*/ `
    <div class="chart-border"></div>
    <h2 class="program-title">Select Program</h2>
    <div class="program-buttons">
        <button class="program-btn active" data-program="core-education">
            Core Education
        </button>
        <button class="program-btn" data-program="piscine-js">
            Piscine JS
        </button>
        <button class="program-btn" data-program="piscine-go">
            Piscine Go
        </button>
    </div>
    
    <div class="program-stats">
        <div class="program-stat-card" id="xp-card">
            <div class="stat-circle">
                <span class="stat-number" id="program-xp">0</span>
                <span class="stat-unit">XP</span>
            </div>
            <div class="stat-label">Program XP</div>
        </div>
        
        <div class="program-stat-card" id="level-card">
            <div class="stat-circle">
                <span class="stat-number" id="program-level">0</span>
                <span class="stat-unit">LVL</span>
            </div>
            <div class="stat-label">Your Level</div>
        </div>
        
        <div class="program-stat-card" id="transactions-card">
            <div class="stat-circle">
                <span class="stat-number" id="program-transactions">0</span>
                <span class="stat-unit">TXN</span>
            </div>
            <div class="stat-label">Transactions<sup style="color: var(--primary-color); font-size: 0.8em; cursor: help;">*</sup></div>
        </div>
    </div>
    <div class="program-footnote" style="padding: 15px 20px 20px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 10px; font-size: 0.85em; color: var(--text-color-secondary);">
        <sup style="color: var(--primary-color);">*</sup> <strong>What is a Transaction?</strong><br>
        A Transaction = the moment when a project/assignment was successfully accepted (not a commit!). It's a record of XP awarded for completed work.
    </div>
`;

    // Add event listeners for program buttons
    document.querySelectorAll('.program-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.program-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update current program
            currentProgram = btn.dataset.program;
            
            // Update program stats
            updateProgramStats();
        });
    });

    // Add hover and click listeners for stat cards - all behave as one unit
    const statCards = document.querySelectorAll('.program-stat-card');
    
    statCards.forEach(card => {
        // Add hover listeners to highlight all cards together
        card.addEventListener('mouseenter', () => {
            statCards.forEach(c => c.classList.add('hovered'));
        });
        
        card.addEventListener('mouseleave', () => {
            statCards.forEach(c => c.classList.remove('hovered'));
        });
        
        // Add click listeners - all show XP details
        card.addEventListener('click', () => showProgramDetails('xp'));
    });

    // Load initial data
    await updateProgramStats();
};

async function updateProgramStats() {
    try {
        const token = localStorage.getItem("JWT");
        
        // Get program-specific data based on current program
        const programData = await getProgramData(currentProgram, token);
        
        // Update the stat cards
        document.getElementById('program-xp').textContent = Math.floor(programData.xp);
        document.getElementById('program-level').textContent = programData.level;
        document.getElementById('program-transactions').textContent = programData.transactions;
        
    } catch (error) {
        if (typeof error === "string" && error.includes('JWTExpired')) handleLogout();
    }
}

async function getProgramData(program, token) {
    // Get XP transactions
    const xpQuery = `
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
    
    const [xpResponse, levelResponse] = await Promise.all([
        fetchGraphQL(xpQuery, {}, token),
        fetchGraphQL(levelQuery, {}, token)
    ]);
    
    if (xpResponse.errors) {
        throw new Error(xpResponse.errors[0].message);
    }
    
    const transactions = xpResponse.data.user[0].transactions;
    
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
    
    const totalXP = programTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    
    // Get level from level query
    let level = 0;
    if (levelResponse.data && levelResponse.data.transaction && levelResponse.data.transaction[0]) {
        level = levelResponse.data.transaction[0].amount;
    }
    
    return {
        xp: totalXP, // Don't round - show exact values
        level: level,
        transactions: programTransactions.length,
        rawTransactions: programTransactions
    };
}

function showProgramDetails(type) {
    showProgramDetailsPopup(currentProgram, type);
}

export { currentProgram };
