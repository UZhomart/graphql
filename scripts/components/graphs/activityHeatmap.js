import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_ACTIVITY_DATA } from "../../api/graphql.js";

export async function renderActivityHeatmap(userId) {
    if (!userId) return;

    try {
        const token = localStorage.getItem("JWT");
        const response = await fetchGraphQL(GET_ACTIVITY_DATA, { userId }, token);
        
        if (response.errors) {
            console.error('Error fetching activity data:', response.errors);
            return;
        }

        const activityData = response.data.transaction;
        if (!activityData || activityData.length === 0) {
            const container = document.getElementById('activity-heatmap');
            if (container) {
                container.innerHTML = `
                    <div class="activity-heatmap">
                        <h3>🔥 Activity Heatmap</h3>
                        <div class="no-data">No activity data available</div>
                    </div>
                `;
            }
            return;
        }

        const container = document.getElementById('activity-heatmap');
        if (!container) return;

        // Process activity data
        const heatmapData = createHeatmapData(activityData);
        const maxActivity = Math.max(...heatmapData.flat().map(cell => cell.count));

        container.innerHTML = `
            <div class="activity-heatmap">
                <div class="heatmap-header">
                    <h3>🔥 Activity Heatmap</h3>
                    <div class="heatmap-description">
                        <p>Shows when you're most active (earning XP). Darker green = more activity</p>
                    </div>
                    <div class="heatmap-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📊</span>
                            <span class="stat-value">${activityData.length}</span>
                            <span class="stat-label">Transactions</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">📅</span>
                            <span class="stat-value">30</span>
                            <span class="stat-label">Days</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">⚡</span>
                            <span class="stat-value">${getMostActiveDay(heatmapData)} ${getMostActiveHour(heatmapData)}:00</span>
                            <span class="stat-label">Peak Time</span>
                        </div>
                    </div>
                </div>
                <div class="heatmap-container">
                    <div class="heatmap-grid">
                        ${renderHeatmapGrid(heatmapData, maxActivity)}
                    </div>
                </div>
                <div class="heatmap-legend">
                    <div class="legend-section">
                        <h4>Activity Intensity</h4>
                        <div class="legend-items">
                            <div class="legend-item">
                                <div class="legend-color" style="background: #ebedf0"></div>
                                <span>No activity</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #c6e48b"></div>
                                <span>Low</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #7bc96f"></div>
                                <span>Medium</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #239a3b"></div>
                                <span>High</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: #196127"></div>
                                <span>Very High</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add hover effects
        addHoverEffects(container, heatmapData);

    } catch (error) {
        console.error('Error rendering activity heatmap:', error);
    }
}

function createHeatmapData(transactions) {
    // Initialize 7x24 grid (days of week x hours)
    const grid = Array(7).fill().map(() => Array(24).fill().map(() => ({ count: 0, transactions: [] })));
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.createdAt);
        // Convert to Kazakhstan format: Monday = 0, Sunday = 6
        const dayOfWeek = (date.getDay() + 6) % 7; // 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
        const hour = date.getHours();
        
        grid[dayOfWeek][hour].count++;
        grid[dayOfWeek][hour].transactions.push(transaction);
    });
    
    return grid;
}

function renderHeatmapGrid(heatmapData, maxActivity) {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Kazakhstan format: Monday first
    const hours = Array.from({length: 24}, (_, i) => i);
    
    let html = '<div class="heatmap-labels">';
    html += '<div class="day-label"></div>'; // Empty corner
    
    // Hour labels
    hours.forEach(hour => {
        html += `<div class="hour-label">${hour}</div>`;
    });
    html += '</div>';
    
    // Day rows
    dayNames.forEach((dayName, dayIndex) => {
        html += `<div class="heatmap-row">`;
        html += `<div class="day-label">${dayName}</div>`;
        
        hours.forEach(hour => {
            const cell = heatmapData[dayIndex][hour];
            const intensity = maxActivity > 0 ? cell.count / maxActivity : 0;
            const color = getHeatmapColor(intensity);
            
            html += `
                <div class="heatmap-cell" 
                     style="background-color: ${color}"
                     data-day="${dayIndex}" 
                     data-hour="${hour}"
                     data-count="${cell.count}"
                     title="${dayName} ${hour}:00 - ${cell.count} transactions">
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    return html;
}

function getHeatmapColor(intensity) {
    if (intensity === 0) return '#ebedf0';
    if (intensity <= 0.2) return '#c6e48b';
    if (intensity <= 0.4) return '#7bc96f';
    if (intensity <= 0.6) return '#239a3b';
    return '#196127';
}

function addHoverEffects(container, heatmapData) {
    const cells = container.querySelectorAll('.heatmap-cell');
    
    cells.forEach(cell => {
        cell.addEventListener('mouseenter', (e) => {
            const day = parseInt(e.target.dataset.day);
            const hour = parseInt(e.target.dataset.hour);
            const count = parseInt(e.target.dataset.count);
            
            showHeatmapTooltip(e, day, hour, count, heatmapData[day][hour].transactions);
        });
        
        cell.addEventListener('mouseleave', () => {
            hideHeatmapTooltip();
        });
    });
}

function showHeatmapTooltip(event, day, hour, count, transactions) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Удаляем существующий tooltip если есть
    hideHeatmapTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'heatmap-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-header">${dayNames[day]} ${hour}:00</div>
        <div class="tooltip-count">${count} transactions</div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Позиционируем tooltip относительно курсора
    const rect = event.target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top;
    
    tooltip.style.left = `${centerX}px`;
    tooltip.style.top = `${topY}px`;
}

function hideHeatmapTooltip() {
    const tooltip = document.querySelector('.heatmap-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function getMostActiveHour(heatmapData) {
    let maxActivity = 0;
    let mostActiveHour = 0;
    
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            if (heatmapData[day][hour].count > maxActivity) {
                maxActivity = heatmapData[day][hour].count;
                mostActiveHour = hour;
            }
        }
    }
    
    return mostActiveHour;
}

function getMostActiveDay(heatmapData) {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; // Kazakhstan format
    let maxActivity = 0;
    let mostActiveDay = 0;
    
    for (let day = 0; day < 7; day++) {
        let dayActivity = 0;
        for (let hour = 0; hour < 24; hour++) {
            dayActivity += heatmapData[day][hour].count;
        }
        if (dayActivity > maxActivity) {
            maxActivity = dayActivity;
            mostActiveDay = day;
        }
    }
    
    return dayNames[mostActiveDay];
}
