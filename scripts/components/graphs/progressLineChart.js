import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_USER_TRANSACTIONS } from "../../api/graphql.js";

export async function renderProgressLineChart(userId) {
    if (!userId) return;

    try {
        const token = localStorage.getItem("JWT");
        const response = await fetchGraphQL(GET_USER_TRANSACTIONS, { userId }, token);

        if (response.errors) {
            console.error('Error fetching progress data:', response.errors);
            return;
        }

        const transactions = response.data.transaction;
        if (!transactions || transactions.length === 0) {
            const container = document.getElementById('progress-line-chart');
            if (container) {
                container.innerHTML = `
                    <div class="progress-chart">
                        <h3>📈 Progress Line Chart</h3>
                        <div class="no-data">No progress data available</div>
                    </div>
                `;
            }
            return;
        }

        const container = document.getElementById('progress-line-chart');
        if (!container) return;

        // Process data for line chart
        const chartData = processProgressData(transactions);
        const totalXP = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        container.innerHTML = `
            <div class="progress-chart">
                <div class="chart-header">
                    <h3>📈 Progress Line Chart</h3>
                    <div class="chart-description">
                        <p><strong>What this shows:</strong> Chart displays XP accumulation over time. Each point = one day of activity. Click on a point for details.</p>
                    </div>
                    <div class="chart-stats">
                        <div class="stat-item">
                            <span class="stat-icon">📊</span>
                            <span class="stat-value">${totalXP.toLocaleString()}</span>
                            <span class="stat-label">Total XP</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">📅</span>
                            <span class="stat-value">${chartData.length}</span>
                            <span class="stat-label">Data Points</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon">⚡</span>
                            <span class="stat-value">${getAverageXPPerDay(chartData)}</span>
                            <span class="stat-label">Avg XP/Day</span>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <div class="chart-scroll-indicator" style="display: none;">
                        <span class="scroll-hint">← Scroll horizontally to see timeline →</span>
                    </div>
                    <div class="line-chart-svg-container">
                        ${renderLineChartSVG(chartData)}
                    </div>
                </div>
            </div>
        `;

        // Add interactive functionality
        addChartInteractivity(container, chartData);
        
        // Handle window resize
        const handleResize = () => {
            const chartContainer = document.getElementById('progress-line-chart');
            if (chartContainer) {
                chartContainer.innerHTML = renderLineChartSVG(chartData);
                addChartInteractivity(container, chartData);
            }
        };
        
        window.addEventListener('resize', handleResize);

    } catch (error) {
        console.error('Error rendering progress line chart:', error);
    }
}

function processProgressData(transactions) {
    // Sort transactions by date
    const sortedTransactions = transactions.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Group by date and calculate cumulative XP
    const dailyData = {};
    let cumulativeXP = 0;

    sortedTransactions.forEach(transaction => {
        const date = new Date(transaction.createdAt);
        const dateKey = date.toISOString().split('T')[0];
        
        if (!dailyData[dateKey]) {
            dailyData[dateKey] = {
                date: dateKey,
                xp: 0,
                transactions: [],
                cumulativeXP: 0
            };
        }
        
        dailyData[dateKey].xp += transaction.amount || 0;
        dailyData[dateKey].transactions.push(transaction);
    });

    // Calculate cumulative XP
    const sortedDates = Object.keys(dailyData).sort();
    sortedDates.forEach(dateKey => {
        cumulativeXP += dailyData[dateKey].xp;
        dailyData[dateKey].cumulativeXP = cumulativeXP;
    });

    return sortedDates.map(dateKey => dailyData[dateKey]);
}

function renderLineChartSVG(data) {
    if (!data || data.length === 0) return '<div class="no-data">No data to display</div>';

    // Get container width or use minimum width
    const container = document.getElementById('progress-line-chart');
    const containerWidth = container ? container.offsetWidth - 40 : 800; // 40px for padding
    const width = Math.max(800, Math.min(containerWidth, data.length * 20));
    const height = 300;
    const padding = { top: 20, right: 40, bottom: 60, left: 80 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Calculate scales
    const maxXP = Math.max(...data.map(d => d.cumulativeXP));
    const minXP = Math.min(...data.map(d => d.cumulativeXP));
    const xScale = chartWidth / (data.length - 1);
    const yScale = chartHeight / (maxXP - minXP);

    // Generate path for line
    const pathData = data.map((point, index) => {
        const x = padding.left + (index * xScale);
        const y = padding.top + chartHeight - ((point.cumulativeXP - minXP) * yScale);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Generate points
    const points = data.map((point, index) => {
        const x = padding.left + (index * xScale);
        const y = padding.top + chartHeight - ((point.cumulativeXP - minXP) * yScale);
        return { x, y, data: point };
    });

    // Generate Y-axis labels
    const yLabels = [];
    const labelCount = 6;
    for (let i = 0; i <= labelCount; i++) {
        const value = minXP + (maxXP - minXP) * (i / labelCount);
        const y = padding.top + chartHeight - ((value - minXP) * yScale);
        yLabels.push({ value: Math.round(value), y });
    }

    // Generate X-axis labels (every 7th day or so)
    const xLabels = [];
    const labelInterval = Math.max(1, Math.floor(data.length / 8));
    for (let i = 0; i < data.length; i += labelInterval) {
        const x = padding.left + (i * xScale);
        const date = new Date(data[i].date);
        xLabels.push({ 
            value: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            x 
        });
    }

    return `
        <svg width="${width}" height="${height}" class="line-chart-svg">
            <!-- Grid lines -->
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                </pattern>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#grid)" />
            
            <!-- Y-axis -->
            <line x1="${padding.left}" y1="${padding.top}" 
                  x2="${padding.left}" y2="${padding.top + chartHeight}" 
                  stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
            
            <!-- X-axis -->
            <line x1="${padding.left}" y1="${padding.top + chartHeight}" 
                  x2="${padding.left + chartWidth}" y2="${padding.top + chartHeight}" 
                  stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
            
            <!-- Y-axis labels -->
            ${yLabels.map(label => `
                <text x="${padding.left - 10}" y="${label.y + 5}" 
                      text-anchor="end" class="axis-label">
                    ${label.value.toLocaleString()}
                </text>
            `).join('')}
            
            <!-- X-axis labels -->
            ${xLabels.map(label => `
                <text x="${label.x}" y="${padding.top + chartHeight + 20}" 
                      text-anchor="middle" class="axis-label">
                    ${label.value}
                </text>
            `).join('')}
            
            <!-- Line path -->
            <path d="${pathData}" 
                  fill="none" 
                  stroke="var(--primary-color)" 
                  stroke-width="3" 
                  class="progress-line"
                  stroke-linecap="round" 
                  stroke-linejoin="round"/>
            
            <!-- Data points -->
            ${points.map((point, index) => `
                <circle cx="${point.x}" cy="${point.y}" r="4" 
                        fill="var(--primary-color)" 
                        stroke="white" 
                        stroke-width="2"
                        class="data-point"
                        data-index="${index}"
                        data-date="${point.data.date}"
                        data-xp="${point.data.cumulativeXP}"
                        data-transactions="${point.data.transactions.length}"/>
            `).join('')}
            
            <!-- Gradient for area under curve -->
            <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:var(--primary-color);stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:var(--primary-color);stop-opacity:0.05" />
                </linearGradient>
            </defs>
            <path d="${pathData} L ${padding.left + chartWidth} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z" 
                  fill="url(#areaGradient)" 
                  class="area-fill"/>
        </svg>
    `;
}

function showTooltip(e, dataPoint) {
    let tooltip = document.querySelector('.chart-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        document.body.appendChild(tooltip);
    }

    tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${new Date(dataPoint.date).toLocaleDateString()}</div>
        <div>Total XP: ${dataPoint.cumulativeXP.toLocaleString()}</div>
        <div>Daily XP: ${dataPoint.xp.toLocaleString()}</div>
        <div>Activities: ${dataPoint.transactions.length}</div>
        <div style="font-size: 0.8em; margin-top: 5px; opacity: 0.8;">Click for details</div>
    `;

    tooltip.style.display = 'block';
    tooltip.style.left = e.pageX + 10 + 'px';
    tooltip.style.top = e.pageY + 10 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

function highlightPoint(point) {
    point.style.r = '8';
    point.style.filter = 'drop-shadow(0 0 6px var(--primary-color))';
}

function unhighlightPoint(point) {
    point.style.r = '5';
    point.style.filter = 'none';
}

function addChartInteractivity(container, data) {
    const svg = container.querySelector('.line-chart-svg');
    if (!svg) return;

    const points = svg.querySelectorAll('.data-point');
    const line = svg.querySelector('.progress-line');
    const areaFill = svg.querySelector('.area-fill');

    points.forEach((point, index) => {
        point.addEventListener('mouseenter', (e) => {
            showTooltip(e, data[index]);
            highlightPoint(point);
        });

        point.addEventListener('mouseleave', () => {
            hideTooltip();
            unhighlightPoint(point);
        });

        point.addEventListener('click', (e) => {
            showDetailedPopup(data[index]);
        });
    });

    // Add hover effect to line
    line.addEventListener('mouseenter', () => {
        line.style.strokeWidth = '4';
        line.style.filter = 'drop-shadow(0 0 8px var(--primary-color))';
    });

    line.addEventListener('mouseleave', () => {
        line.style.strokeWidth = '3';
        line.style.filter = 'none';
    });
}

function cleanProjectName(name) {
    if (!name) return 'Unknown Activity';
    
    // Remove common prefixes and suffixes
    let cleaned = name
        .replace(/^(project|exercise|piscine|module)\s*/i, '') // Remove prefixes
        .replace(/\s*(project|exercise|piscine|module)$/i, '') // Remove suffixes
        .replace(/^(piscine-js|piscine-go|piscine-c)\s*/i, '') // Remove piscine variants
        .replace(/^(core-education|module)\s*/i, '') // Remove core education prefixes
        .trim();
    
    // If name becomes empty or too short, return original
    if (cleaned.length < 2) {
        return name;
    }
    
    return cleaned;
}

function getAverageXPPerDay(data) {
    if (!data || data.length === 0) return 0;
    
    const totalXP = data.reduce((sum, day) => sum + day.xp, 0);
    const days = data.length;
    
    return Math.round(totalXP / days);
}

function showDetailedPopup(data) {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <h3>📊 Day Details: ${new Date(data.date).toLocaleDateString()}</h3>
                <button class="popup-close" id="close-progress-popup">&times;</button>
            </div>
            <div class="popup-body">
                <div class="popup-stats">
                    <div class="stat-card">
                        <div class="stat-number">${data.cumulativeXP.toLocaleString()}</div>
                        <div class="stat-label">Total XP (Cumulative)</div>
                        <div class="stat-description">Sum of all XP earned up to this day</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.xp.toLocaleString()}</div>
                        <div class="stat-label">Daily XP</div>
                        <div class="stat-description">XP earned on this specific day</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${data.transactions.length}</div>
                        <div class="stat-label">Activities</div>
                        <div class="stat-description">Number of actions performed</div>
                    </div>
                </div>
                <div class="transactions-list">
                    <h4>📝 Activity Details</h4>
                    <p class="transactions-description">Each row = one activity (project, exercise, etc.)</p>
                    ${data.transactions.map(transaction => `
                        <div class="transaction-item">
                            <div class="transaction-info">
                                <div class="transaction-xp">+${transaction.amount} XP</div>
                                <div class="transaction-project">${cleanProjectName(transaction.object?.name || 'Unknown Activity')}</div>
                            </div>
                            <div class="transaction-time">${new Date(transaction.createdAt).toLocaleTimeString()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Close handlers
    const closeBtn = overlay.querySelector('#close-progress-popup');
    const closeOverlay = () => {
        overlay.remove();
    };
    
    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });
    
    // ESC key handler
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeOverlay();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

function checkProgressScrollNeeded() {
    const svgContainer = document.querySelector('.line-chart-svg-container');
    const svg = document.querySelector('.line-chart-svg');
    const indicator = document.querySelector('.chart-scroll-indicator');
    
    if (!svgContainer || !svg || !indicator) return;
    
    // Check if SVG is wider than its container
    const svgContainerWidth = svgContainer.offsetWidth;
    const svgWidth = svg.scrollWidth;
    
    // On mobile, always show scroll hint if SVG is wider than container
    const isMobile = window.innerWidth <= 1024;
    
    if (svgWidth > svgContainerWidth || (isMobile && svgWidth > svgContainerWidth)) {
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

// Check scroll on load and resize
setTimeout(checkProgressScrollNeeded, 100);
window.addEventListener('resize', checkProgressScrollNeeded);
