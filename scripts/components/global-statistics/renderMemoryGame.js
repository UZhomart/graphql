import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_GAMES_INFO } from "../../api/graphql.js";
import { showMemoryGamePopup } from "./memoryGamePopup.js";

export const renderMemoryGame = async () => {
    const container = document.getElementById("memory-game");
    
    try {
        // Fetch games data - using result ID 14389 as provided in the example
        const token = localStorage.getItem('JWT');
        const response = await fetchGraphQL(GET_GAMES_INFO, { resultId: 14389 }, token);
        
        if (!response || !response.data || !response.data.result || response.data.result.length === 0) {
            throw new Error('No games data found');
        }

        const resultData = response.data.result[0];
        const attrs = resultData.attrs;
        
        // Find memory game data
        const memoryGame = attrs?.games?.find(game => game.name === 'memory');
        
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
        
        // Show error state
        container.innerHTML = /*html*/ `
        <div class="game-card">
            <div class="game-icon">🧠</div>
            <div class="game-value">--</div>
            <div class="game-label">Memory Game</div>
            <div class="game-subtitle">Error loading data</div>
        </div>
        `;
    }
};
