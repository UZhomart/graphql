import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_GAMES_INFO } from "../../api/graphql.js";
import { showMemoryGamePopup } from "./memoryGamePopup.js";

export const renderMemoryGame = async () => {
    const container = document.getElementById("memory-game");
    
    try {
        // Fetch games data for current user
        const token = localStorage.getItem('JWT');
        
        if (!token) {
            throw new Error('Authentication token not found. Please log in again.');
        }
        
        const response = await fetchGraphQL(GET_GAMES_INFO, {}, token);
        
        if (!response || !response.data || !response.data.result) {
            throw new Error('No games data found');
        }

        const results = response.data.result;
        
        // Find the result that contains games data
        let gamesData = null;
        for (const result of results) {
            if (result.attrs && result.attrs.games) {
                gamesData = result.attrs.games;
                break;
            }
        }
        
        // Find memory game data
        const memoryGame = gamesData?.find(game => game.name === 'memory');
        
        if (!memoryGame) {
            container.innerHTML = /*html*/ `
            <div class="game-card">
                <div class="game-icon">🧠</div>
                <div class="game-value">--</div>
                <div class="game-label">Memory Game</div>
                <div class="game-subtitle">No data available</div>
            </div>
            `;
            return;
        }

        // Calculate statistics
        const totalLevels = memoryGame.results.length;
        const totalAttempts = memoryGame.results.reduce((sum, result) => sum + result.attempts, 0);
        const maxLevel = Math.max(...memoryGame.results.map(r => r.level));
        const avgAttempts = (totalAttempts / totalLevels).toFixed(1);
        
        container.innerHTML = /*html*/ `
        <div class="game-card" id="memory-game-card">
            <div class="game-icon">🧠</div>
            <div class="game-value">${maxLevel}</div>
            <div class="game-label">Memory Game</div>
            <div class="game-subtitle">Level</div>
            <div class="game-details">
                <span class="game-detail-item">${totalAttempts} attempts</span>
                <span class="game-detail-item">${avgAttempts} avg/level</span>
            </div>
        </div>
        `;

        // Add click listener for memory game card
        document.getElementById('memory-game-card').addEventListener('click', () => {
            showMemoryGamePopup(memoryGame);
        });

    } catch (error) {
        console.error('Error loading memory game data:', error);
        
        // Check if it's a JWT error and handle accordingly
        const errorMessage = error.message || 'Unknown error';
        let subtitle = 'Error loading data';
        
        if (errorMessage.includes('JWT') || errorMessage.includes('Authentication')) {
            subtitle = 'Please log in again';
        } else if (errorMessage.includes('No games data found')) {
            subtitle = 'No data available';
        }
        
        // Show error state
        container.innerHTML = /*html*/ `
        <div class="game-card">
            <div class="game-icon">🧠</div>
            <div class="game-value">--</div>
            <div class="game-label">Memory Game</div>
            <div class="game-subtitle">${subtitle}</div>
        </div>
        `;
    }
};
