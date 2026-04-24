import { fetchGraphQL } from "../../api/graphqlRequests.js";
import { GET_USER_TRANSACTIONS } from "../../api/graphql.js";

export async function renderProgressLineChart(userId) {
    if (!userId) return;

    try {
        const token = localStorage.getItem("JWT");
        const response = await fetchGraphQL(GET_USER_TRANSACTIONS, { userId }, token);

        if (response.errors) {
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

        // Process data
        const chartData = processProgressData(transactions);
        const totalXP = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

        container.innerHTML = `
            <div class="progress-chart">
                <div class="chart-header">
                    <h3>📈 Progress Line Chart</h3>
                    <div class="chart-description">
                        <p><strong>What this shows:</strong> XP accumulation over time. Click points for details.</p>
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
                    <div class="chart-scroll-indicator">
                        <span class="scroll-hint">← Scroll timeline →</span>
                    </div>
                    <div class="line-chart-svg-container">
                        ${renderLineChartSVG(chartData)}
                    </div>
                </div>
            </div>
        `;

        // Interactivity
        addChartInteractivity(container, chartData);
        checkProgressScrollNeeded();

        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const svgContainer = container.querySelector('.line-chart-svg-container');
                if (svgContainer) {
                    svgContainer.innerHTML = renderLineChartSVG(chartData);
                    addChartInteractivity(container, chartData);
                    checkProgressScrollNeeded();
                }
            }, 200);
        });

    } catch (error) {
        // Error rendering progress line chart
    }
}

function processProgressData(transactions) {
    const sortedTransactions = transactions.sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
    );

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

    const sortedDates = Object.keys(dailyData).sort();
    sortedDates.forEach(dateKey => {
        cumulativeXP += dailyData[dateKey].xp;
        dailyData[dateKey].cumulativeXP = cumulativeXP;
    });

    return sortedDates.map(dateKey => dailyData[dateKey]);
}

function renderLineChartSVG(data) {
    if (!data || data.length === 0) return '<div class="no-data">No data</div>';

    // Dynamic width
    const dataLength = data.length;
    const minWidthPerPoint = 25;
    const baseWidth = dataLength * minWidthPerPoint;
    const containerWidth = 800;

    let width = Math.max(baseWidth, containerWidth);

    // Compact height
    let ratio;
    if (window.innerWidth <= 480) ratio = 6;
    else if (window.innerWidth <= 768) ratio = 5;
    else ratio = 4;
    let height = Math.max(width / ratio, 150);
    height = Math.min(height, 300);

    const padding = { top: 20, right: 30, bottom: 50, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Scales
    const maxXP = Math.max(...data.map(d => d.cumulativeXP));
    const minXP = Math.min(...data.map(d => d.cumulativeXP));
    const xScale = chartWidth / (data.length - 1 || 1);
    const yScale = chartHeight / (Math.max(maxXP - minXP, 1));

    // Path
    const pathData = data.map((point, index) => {
        const x = padding.left + (index * xScale);
        const y = padding.top + chartHeight - ((point.cumulativeXP - minXP) * yScale);
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    // Points
    const points = data.map((point, index) => {
        const x = padding.left + (index * xScale);
        const y = padding.top + chartHeight - ((point.cumulativeXP - minXP) * yScale);
        return { x, y, data: point };
    });

    // Y Labels
    const yLabels = [];
    const labelCount = 4;
    for (let i = 0; i <= labelCount; i++) {
        const value = minXP + (maxXP - minXP) * (i / labelCount);
        const y = padding.top + chartHeight - ((value - minXP) * yScale);
        yLabels.push({ value: Math.round(value), y });
    }

    // X Labels - show more labels and always include the last point
    const xLabels = [];
    let maxLabels = window.innerWidth < 480 ? 5 : window.innerWidth < 768 ? 8 : 12;
    const labelInterval = Math.max(1, Math.floor(data.length / maxLabels));
    const processedIndices = new Set();

    // Add labels at intervals
    for (let i = 0; i < data.length; i += labelInterval) {
        const x = padding.left + (i * xScale);
        const date = new Date(data[i].date);
        xLabels.push({
            value: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            x,
            index: i
        });
        processedIndices.add(i);
    }

    // Always add the last point if not already included
    const lastIndex = data.length - 1;
    if (!processedIndices.has(lastIndex)) {
        const x = padding.left + (lastIndex * xScale);
        const date = new Date(data[lastIndex].date);
        xLabels.push({
            value: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            x,
            index: lastIndex
        });
    }

    // Sort by index to maintain order
    xLabels.sort((a, b) => a.index - b.index);

    // Build SVG
    let svg = `<svg width="${width}" height="${height}" class="line-chart-svg" viewBox="0 0 ${width} ${height}">`;

    // Grid
    svg += '<g class="grid">';
    for (let i = 0; i <= 5; i++) {
        const gy = padding.top + (chartHeight * i / 5);
        svg += `<line x1="${padding.left}" y1="${gy}" x2="${width - padding.right}" y2="${gy}" stroke="rgba(255,255,255,0.1)" />`;
    }
    for (let i = 0; i < data.length; i += Math.floor(data.length / 5)) {
        const gx = padding.left + (i * xScale);
        svg += `<line x1="${gx}" y1="${padding.top}" x2="${gx}" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.1)" />`;
    }
    svg += '</g>';

    // Area
    svg += `<path class="area-fill" d="${pathData} V ${padding.top + chartHeight} H ${padding.left} Z" />`;

    // Line
    svg += `<path class="progress-line" d="${pathData}" />`;

    // Points
    points.forEach(point => {
        svg += `<circle class="data-point" cx="${point.x}" cy="${point.y}" data-index="${points.indexOf(point)}" />`;
    });

    // Y Axis
    svg += `<line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="var(--border-color)" />`;
    yLabels.forEach(label => {
        svg += `
            <line x1="${padding.left - 5}" y1="${label.y}" x2="${padding.left}" y2="${label.y}" stroke="var(--border-color)" />
            <text class="axis-label" x="${padding.left - 8}" y="${label.y + 3}" text-anchor="end">${label.value.toLocaleString()}</text>
        `;
    });

    // X Axis
    svg += `<line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="var(--border-color)" />`;
    xLabels.forEach(label => {
        svg += `
            <line x1="${label.x}" y1="${height - padding.bottom}" x2="${label.x}" y2="${height - padding.bottom + 5}" stroke="var(--border-color)" />
            <text class="axis-label" x="${label.x}" y="${height - padding.bottom + 18}" text-anchor="middle">${label.value}</text>
        `;
    });

    svg += '</svg>';
    return svg;
}

function showTooltip(e, dataPoint) {
    let tooltip = document.querySelector('.chart-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'chart-tooltip';
        document.body.appendChild(tooltip);
    }

    tooltip.innerHTML = `
        <div class="tooltip-header">${new Date(dataPoint.date).toLocaleDateString()}</div>
        <div class="tooltip-content">
            <div class="tooltip-item"><span class="tooltip-label">Total XP:</span><span class="tooltip-value">${dataPoint.cumulativeXP.toLocaleString()}</span></div>
            <div class="tooltip-item"><span class="tooltip-label">Daily XP:</span><span class="tooltip-value">${dataPoint.xp.toLocaleString()}</span></div>
            <div class="tooltip-item"><span class="tooltip-label">Activities:</span><span class="tooltip-value">${dataPoint.transactions.length}</span></div>
        </div>
    `;

    tooltip.style.display = 'block';

    // Get tooltip dimensions after rendering
    const tooltipRect = tooltip.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    // Get mouse position relative to viewport
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate initial position
    let left = mouseX + 15;
    let top = mouseY - tooltipHeight - 15;

    // Boundary checks with margins
    const margin = 10;

    // Check right boundary
    if (left + tooltipWidth > window.innerWidth - margin) {
        left = mouseX - tooltipWidth - 15;
    }

    // Check left boundary
    if (left < margin) {
        left = margin;
    }

    // Check top boundary
    if (top < margin) {
        top = mouseY + 15;
    }

    // Check bottom boundary
    if (top + tooltipHeight > window.innerHeight - margin) {
        top = window.innerHeight - tooltipHeight - margin;
    }

    // Apply position
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = 'none';
    tooltip.style.opacity = '1';
}

function hideTooltip() {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip && tooltip.style.opacity === '0') {
                tooltip.style.display = 'none';
            }
        }, 150);
    }
}

function addChartInteractivity(container, data) {
    const svg = container.querySelector('.line-chart-svg');
    if (!svg) return;

    const points = svg.querySelectorAll('.data-point');
    const line = svg.querySelector('.progress-line');

    points.forEach((point, index) => {
        point.addEventListener('mouseenter', (e) => {
            showTooltip(e, data[index]);
            point.style.r = '4';
            point.style.filter = 'drop-shadow(0 0 4px var(--primary-color))';
        });

        point.addEventListener('mouseleave', () => {
            hideTooltip();
            point.style.r = '3';
            point.style.filter = 'none';
        });

        point.addEventListener('click', (e) => {
            showDetailedPopup(data[index]);
        });
    });

    // Line hover
    if (line) {
        line.addEventListener('mouseenter', () => {
            line.style.strokeWidth = '3';
            line.style.filter = 'drop-shadow(0 0 6px var(--primary-color))';
        });
        line.addEventListener('mouseleave', () => {
            line.style.strokeWidth = '2';
            line.style.filter = 'none';
        });
    }

    // Hide tooltip on leave
    container.addEventListener('mouseleave', hideTooltip);
}

function cleanProjectName(name) {
    if (!name) return 'Unknown Activity';
    let cleaned = name
        .replace(/^(project|exercise|piscine|module)\s*/i, '')
        .replace(/\s*(project|exercise|piscine|module)$/i, '')
        .replace(/^(piscine-js|piscine-go|piscine-c|piscine-ai)\s*/i, '')
        .replace(/^(core-education|module)\s*/i, '')
        .trim();
    return cleaned.length < 2 ? name : cleaned;
}

function getAverageXPPerDay(data) {
    if (!data || data.length === 0) return 0;
    const totalXP = data.reduce((sum, day) => sum + day.xp, 0);
    return Math.round(totalXP / data.length);
}

function showDetailedPopup(data) {
    const overlay = document.createElement('div');
    overlay.className = 'progress-detail-overlay';
    overlay.innerHTML = `
        <div class="progress-detail-popup">
            <div class="progress-detail-header">
                <h3><span>📊</span> Day: ${new Date(data.date).toLocaleDateString()}</h3>
                <button class="progress-detail-close-btn" id="close-progress-popup">&times;</button>
            </div>
            <div class="progress-detail-content">
                <div class="progress-detail-summary">
                    <div class="summary-item">
                        <span class="summary-label">Cumulative XP:</span>
                        <span class="summary-value">${data.cumulativeXP.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Daily XP:</span>
                        <span class="summary-value">${data.xp.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Activities:</span>
                        <span class="summary-value">${data.transactions.length}</span>
                    </div>
                </div>
                <div class="progress-detail-transactions">
                    <h4>📝 Activities</h4>
                    <div class="progress-transactions-list">
                        ${data.transactions.map(t => `
                            <div class="progress-transaction-item">
                                <div class="progress-transaction-info">
                                    <div class="progress-transaction-name">${cleanProjectName(t.object?.name || 'Unknown')}</div>
                                    <div class="progress-transaction-time">${new Date(t.createdAt).toLocaleTimeString()}</div>
                                </div>
                                <div class="progress-transaction-xp">
                                    <span class="progress-xp-amount">${t.amount} XP</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close
    const closeBtn = overlay.querySelector('#close-progress-popup');
    const closeOverlay = () => overlay.remove();
    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => e.target === overlay && closeOverlay());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeOverlay());
}

function checkProgressScrollNeeded() {
    const chartContainer = document.querySelector('.chart-container');
    const svg = document.querySelector('.line-chart-svg');
    const indicator = document.querySelector('.chart-scroll-indicator');

    if (!chartContainer || !svg || !indicator) return;

    setTimeout(() => {
        const containerWidth = chartContainer.offsetWidth;
        const svgWidth = parseFloat(svg.getAttribute('width')) || svg.scrollWidth;

        const needsScrollX = svgWidth > containerWidth;
        // Игнорируем y-scroll на десктопе
        const isDesktop = window.innerWidth > 1024;
        const needsScrollY = !isDesktop && (svg.scrollHeight > chartContainer.offsetHeight);

        if (needsScrollX || needsScrollY) {
            indicator.style.display = 'block';
            chartContainer.style.overflowX = needsScrollX ? 'auto' : 'visible';
            if (!isDesktop) {
                chartContainer.style.overflowY = needsScrollY ? 'auto' : 'visible';
            } else {
                chartContainer.style.overflowY = 'hidden';
            }
            indicator.innerHTML = '<span class="scroll-hint">← Scroll timeline →</span>';
        } else {
            indicator.style.display = 'none';
            chartContainer.style.overflowX = 'visible';
            chartContainer.style.overflowY = isDesktop ? 'hidden' : 'visible';
        }
    }, 50);
}

// Init
setTimeout(checkProgressScrollNeeded, 50);
window.addEventListener('resize', checkProgressScrollNeeded);