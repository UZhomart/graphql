# Tomorrow School Dashboard

A modern, interactive dashboard for Tomorrow School students to view their learning analytics, progress, and achievements. Built with GraphQL, this single-page application provides a comprehensive overview of student data with beautiful visualizations and real-time statistics.

## 🌐 Live Demo

**🔗 [View Live Dashboard](https://01.tomorrow-school.ai/)**

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Authentication](#authentication)
- [Hosting](#hosting)
- [Author](#author)
- [License](#license)

## Features

### 🔐 Authentication System

- **Secure Login**: JWT-based authentication with Tomorrow School credentials
- **Dual Login Support**: Username/email + password combinations
- **Error Handling**: Comprehensive validation and user-friendly error messages
- **Session Management**: Automatic logout on token expiration
- **Modern UI**: Glassmorphism design with animated backgrounds

### 📊 Dashboard Sections

#### 👤 Profile Information

- **Basic Info**: ID, Login, Full Name, Member Since, Email
- **Extended Details**: Phone, Gender, Date of Birth, Address, Emergency Contacts
- **Interactive Toggle**: "More" button to reveal additional information

#### 🎯 Program Selector

- **Four Programs**: Core Education, Piscine JS, Piscine Go, Piscine AI
- **Dynamic Statistics**: Program-specific XP, Level, and Transaction counts
- **Interactive Cards**: Hover effects and clickable statistics
- **Detailed Popups**: Comprehensive program analytics

#### 📈 Global Statistics

- **Audit Ratio**: Done vs Received with detailed breakdown
- **Audit Analytics**: Total audits, success/failure rates
- **Project Statistics**: Successful and failed project counts
- **Memory Game**: Admission game statistics with level progression and attempts
- **Zzle Game**: Admission game statistics with level progression and attempts
- **Interactive Modals**: Detailed information for each statistic including game performance

#### 👥 Participants Info

- **Smart Search**: Priority-based search with exact login matching
- **Clear Search**: Red clear button (X) to reset all search results
- **Public Data**: Display ID, Login, First Name, and Last Name, audit ratio, levels on each program (including Piscine AI)
- **Real-time Search**: Instant filtering as you type
- **Teamwork Analytics**: Comprehensive collaboration statistics

#### 🤝 Teamwork Analytics

- **Smart Project Filtering**: Shows all finished projects (iy may be also unsuccesful)
- **Unique Teammates**: Count of different people worked together with
- **Team Projects**: Number of unique collaborative projects (excluding solo work)
- **Solo Projects**: Individual projects completed with detailed popup list
- **Collaboration Details**: Complete list of teammates and shared projects
- **Advanced Audit Logic**: Includes projects with succeeded, unused, expired audits or no audits
- **Interactive Statistics**: Clickable cards with detailed information popups

#### 📊 Data Visualizations

- **Activity Heatmap**: Visual representation of learning activity patterns across days and hours
  - **Interactive Tooltips**: Hover to see detailed transaction counts
  - **Kazakhstan Week Format**: Monday-first week display
  - **Peak Time Analysis**: Shows most active day and hour
  - **Responsive Design**: Optimized for all screen sizes
  - **Mobile Scroll Hint**: "← Scroll horizontally to see all hours →" on mobile devices

- **Progress Line Chart**: XP accumulation visualization over time
  - **Interactive Data Points**: Click on any point to see detailed daily information
  - **Cumulative XP Tracking**: Shows total XP earned up to each day
  - **Daily Activity Details**: Displays individual transactions and project names
  - **Clean Project Names**: Removes redundant prefixes like "project", "exercise", "piscine"
  - **Responsive Design**: Adapts to different screen sizes with proper centering
  - **Mobile Scroll Hint**: "← Scroll horizontally to see timeline →" on mobile devices
  - **Smooth Animations**: Hover effects and interactive elements

### 🎨 Modern UI/UX

- **Glassmorphism Design**: Translucent cards with backdrop blur effects
- **Gradient Themes**: Beautiful color transitions throughout the interface
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Layout**: Mobile-first design approach with adaptive table layouts
- **Dark Theme**: Easy on the eyes with vibrant accent colors
- **Adaptive Statistics**: Tables automatically stack vertically on mobile devices for optimal viewing
- **No Horizontal Scrolling**: All content fits within viewport on any device size

## Screenshots

### Login Page

- Modern glassmorphism design with animated particle background
- Tomorrow School branding with gradient logo
- Secure authentication with error handling

### Dashboard Overview

- Comprehensive profile information with expandable details
- Program selector with dynamic statistics
- Global statistics cards with interactive popups
- Smart participants search with exact match priority and clear functionality
- Advanced teamwork analytics with team/solo project separation
- Beautiful data visualizations

## Technologies Used

### Frontend

- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Advanced styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks - pure ES6+ JavaScript
- **SVG**: Custom interactive and animated graphs
- **Font Awesome**: Professional icon library

### Backend Integration

- **GraphQL**: Modern API query language for efficient data fetching
- **JWT**: Secure token-based authentication
- **REST API**: Authentication endpoint integration

### Development Tools

- **Git**: Version control
- **GitHub Pages**: Free hosting platform
- **VS Code**: Development environment

## Project Structure

```bash
graphql-master/
├── 📁 images/
│   └── favicon.svg                 # Modern SVG favicon with Tomorrow School branding
├── 📁 scripts/
│   ├── 📁 api/
│   │   ├── authRequests.js         # JWT authentication with Tomorrow School API
│   │   ├── graphql.js             # All GraphQL queries (user, transactions, audits, projects)
│   │   └── graphqlRequests.js     # GraphQL request handler with error management
│   ├── 📁 app/
│   │   └── handleAuth.js          # Authentication state management and logout
│   ├── 📁 components/
│   │   ├── 📁 global-statistics/
│   │   │   ├── auditRatioPopup.js      # Modal for detailed audit ratio breakdown
│   │   │   ├── auditsPopup.js          # Modal for audit statistics (success/failure rates)
│   │   │   ├── failedProjectsPopup.js  # Modal showing failed projects list
│   │   │   ├── memoryGamePopup.js      # Modal for Memory game detailed statistics
│   │   │   ├── renderAudits.js         # Audits card component with statistics
│   │   │   ├── renderFailedProjects.js # Failed projects card component
│   │   │   ├── renderGlobalStatistics.js # Main global statistics container
│   │   │   ├── renderMemoryGame.js     # Memory game card component
│   │   │   ├── renderSuccessfulProjects.js # Successful projects card component
│   │   │   ├── renderZzleGame.js       # Zzle game card component
│   │   │   ├── successfulProjectsPopup.js # Modal showing successful projects list
│   │   │   └── zzleGamePopup.js        # Modal for Zzle game detailed statistics
│   │   ├── 📁 graphs/
│   │   │   ├── activityHeatmap.js      # D3.js-based activity heatmap visualization
│   │   │   └── progressLineChart.js   # Interactive XP progress line chart with detailed popups
│   │   ├── 📁 profile/
│   │   │   └── renderProfileInfo.js # Profile information with expandable details
│   │   ├── 📁 program-selector/
│   │   │   ├── programDetailsPopup.js # Unified modal for XP, Level, and Transaction details
│   │   │   └── renderProgramSelector.js # Program selection (Core, JS, Go, AI) and statistics cards
│   │   ├── 📁 participants-info/
│   │   │   ├── renderParticipantsInfo.js # Participants search and information display component
│   │   │   ├── soloProjectsPopup.js     # Solo projects popup modal with detailed list
│   │   │   └── teamworkStatus.js        # Teamwork analytics with team/solo project separation
│   │   ├── authComponent.js        # Login page with glassmorphism design and Tomorrow School branding
│   │   └── profileComponent.js     # Main dashboard component orchestrating all sections
│   ├── 📁 utils/
│   │   ├── date.js                # Date formatting utilities (DD.MM.YYYY format)
│   │   ├── error.js               # Error handling and user-friendly error messages
│   │   └── svg.js                 # SVG generation utilities for charts and icons
│   ├── config.js                  # API endpoints configuration (Tomorrow School domain)
│   └── main.js                    # Application entry point and routing logic
├── 📁 styles/
│   ├── app.css                    # Global styles, CSS variables, and base styling
│   ├── global-statistics.css      # Global statistics section with card layouts and popups
│   ├── login.css                  # Login page styles with glassmorphism and animations
│   ├── participants-info.css      # Participants info section with search and card layouts
│   ├── profile.css                # Dashboard styles with gradients and modern UI
│   └── program-selector.css       # Program selector styles with interactive cards
├── index.html                     # Single page application entry point
└── README.md                      # Comprehensive project documentation
```

### 📋 File Descriptions

#### 🔐 Authentication & API

- **`authRequests.js`**: Handles JWT authentication with Tomorrow School API, includes safe encoding for non-Latin characters
- **`graphql.js`**: Contains all GraphQL queries for user data, transactions, audits, project progress, participants info, teamwork analytics, and admission games data with smart filtering (accepted participants only) and advanced audit logic (excludes failed projects)
- **`graphqlRequests.js`**: Manages GraphQL requests with proper error handling and JWT token management

#### 🎨 UI Components

- **`authComponent.js`**: Modern login page with Tomorrow School branding, glassmorphism design, and animated backgrounds
- **`profileComponent.js`**: Main dashboard orchestrator that renders all sections in proper order
- **`renderProfileInfo.js`**: User profile information with expandable "More" section for additional details
- **`renderProgramSelector.js`**: Program selection (Core Education, Piscine JS, Piscine Go, Piscine AI) with dynamic statistics
- **`renderGlobalStatistics.js`**: Global statistics container with audit ratio, audits, project statistics, and admission games (Memory & Zzle)
- **`renderParticipantsInfo.js`**: Participants search and information display with login-based lookup

#### 📊 Data Visualization

- **`activityHeatmap.js`**: D3.js-based activity heatmap showing learning patterns across days and hours
- **`programDetailsPopup.js`**: Unified modal displaying detailed XP, Level, or Transaction information

#### 🎯 Statistics & Analytics

- **`renderAudits.js`**: Audit statistics card showing total audits, success/failure rates
- **`renderSuccessfulProjects.js`**: Successful projects counter with detailed project list
- **`renderFailedProjects.js`**: Failed projects counter with retry attempt tracking
- **`renderMemoryGame.js`**: Memory game card component showing level progression and statistics
- **`renderZzleGame.js`**: Zzle game card component showing level progression and statistics
- **`auditRatioPopup.js`**: Detailed audit ratio breakdown (Done vs Received)
- **`auditsPopup.js`**: Comprehensive audit statistics modal
- **`successfulProjectsPopup.js`**: Detailed successful projects list with grades and dates
- **`failedProjectsPopup.js`**: Detailed failed projects list with attempt counts
- **`memoryGamePopup.js`**: Memory game detailed statistics modal with level progression data
- **`zzleGamePopup.js`**: Zzle game detailed statistics modal with level progression data

#### 👥 Participants & Teamwork

- **`renderParticipantsInfo.js`**: Smart participants search with exact match priority, clear search functionality, and responsive cards
- **`teamworkStatus.js`**: Comprehensive teamwork analytics with team/solo project separation, collaboration details, smart filtering for accepted participants only, and advanced audit logic that shows all finished projects except those with failed audits
- **`soloProjectsPopup.js`**: Interactive popup modal displaying detailed list of individual projects

#### 🛠 Utilities

- **`handleAuth.js`**: Authentication state management, token validation, and logout functionality
- **`handleProfile.js`**: Profile data management and user session handling
- **`date.js`**: Date formatting utilities for consistent date display (DD.MM.YYYY)
- **`error.js`**: Error handling utilities for user-friendly error messages
- **`svg.js`**: SVG generation utilities for charts, icons, and visual elements

#### 🎨 Styling

- **`app.css`**: Global styles, CSS custom properties, and base styling with modern color scheme
- **`login.css`**: Login page styles with glassmorphism effects, gradients, and animations
- **`profile.css`**: Dashboard styles with modern UI, gradients, and interactive elements
- **`program-selector.css`**: Program selector styles with interactive cards and hover effects
- **`global-statistics.css`**: Global statistics section styles with card layouts, modal popups, and admission games styling
- **`participants-info.css`**: Participants info section styles with search interface, teamwork analytics, responsive card layouts, and adaptive statistics tables that stack vertically on mobile devices

## Installation & Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (for cloning the repository)
- Local web server (for development)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/uzhomart/graphql.git
   cd graphql
   ```

2. **Start a local server**

   **Option 1: Using Python (Recommended)**

   ```bash
   # macOS/Linux
   python3 -m http.server 8000

   # Windows
   python -m http.server 8000

   # If python3 not found on macOS, install: brew install python3
   ```

   **Option 2: Using Node.js**

   ```bash
   # Install serve globally (one time)
   npm install -g serve

   # Start server
   npx serve .
   # or
   serve .
   ```

   **Option 3: Using PHP**

   ```bash
   # macOS/Linux
   php -S localhost:8000

   # Windows
   php -S localhost:8000
   ```

   **Option 4: Using VS Code Live Server Extension**

   1. Install "Live Server" extension in VS Code
   2. Right-click on `index.html`
   3. Select "Open with Live Server"
   4. Automatically opens in browser with auto-reload

   **Option 5: Using Python Simple Server**

   ```bash
   # macOS/Linux (Python 2)
   python -m SimpleHTTPServer 8000

   # Windows (Python 2)
   python -m SimpleHTTPServer 8000
   ```

3. **Open in browser**

   ```bash
   http://localhost:8000
   ```

4. **Troubleshooting**

   - **"python: command not found"** (macOS): Use `python3` instead of `python`
   - **Permission denied**: Try port 3000 or 8080 instead
   - **CORS errors**: Use a proper HTTP server (not file:// protocol)
   - **Port already in use**: Change port number (e.g., 8001, 3000)

### Production Deployment

The project is automatically deployed to GitHub Pages. Any push to the `main` branch triggers a new deployment.

## Usage

### Login Process

1. Navigate to the dashboard URL
2. Enter your Tomorrow School credentials:
   - **Username or Email**: Your school login
   - **Password**: Your account password
3. Click "Sign In" to authenticate
4. Upon successful login, you'll be redirected to your personal dashboard

### Dashboard Navigation

- **Profile Information**: View and expand your personal details
- **Program Selector**: Switch between Core Education, Piscine JS, Piscine Go, and Piscine AI
- **Global Statistics**: Click on any statistic card for detailed information including admission games performance
- **Participants Search**: Search for other students with smart exact-match priority
- **Teamwork Analytics**: View collaboration statistics and solo project details
- **Data Visualizations**: Interactive charts showing your progress and skills
- **Admission Games**: View your performance in Memory and Zzle games with detailed statistics

### Logout

Click the "Logout" button in the top-right corner to securely end your session.

## Key Features

### 🔍 Smart Search System

- **Exact Match Priority**: Login searches prioritize exact matches over partial matches
- **Visual Highlighting**: Exact matches are highlighted with green borders
- **Multi-field Search**: Search by login, first name, or last name
- **Real-time Results**: Instant filtering as you type

### 🤝 Advanced Teamwork Analytics

- **Smart Project Filtering**: Shows all finished projects except those with failed audits
- **Team vs Solo Separation**: Automatic filtering of collaborative vs individual projects
- **Accepted Participants Only**: Smart filtering to show only confirmed team members (excludes invited but not accepted)
- **Advanced Audit Logic**: Includes projects with succeeded, unused, expired audits or no audits at all
- **Failed Project Exclusion**: Automatically excludes projects with failed/autoFailed audit status
- **Collaboration Statistics**: Unique teammates count and team project totals
- **Detailed Project Lists**: Complete breakdown of shared projects with each teammate
- **Interactive Popups**: Clickable statistics with detailed information modals

### 🎮 Admission Games Analytics

- **Memory Game**: Brain training game performance with level progression tracking
  - **Level Achievement**: Shows the highest level reached by the student
  - **Attempt Statistics**: Total attempts and average attempts per level
  - **Performance Metrics**: Duration, points earned, and completion date
  - **Detailed Modal**: Comprehensive statistics with game session information

- **Zzle Game**: Puzzle-solving game performance with detailed analytics
  - **Level Progression**: Tracks student's progress through puzzle levels
  - **Attempt Analysis**: Shows total attempts and efficiency metrics
  - **Game Session Data**: Duration, scoring, and completion statistics
  - **Interactive Details**: Clickable cards with full performance breakdown

- **Game Integration**: Seamlessly integrated into Global Statistics section
- **Responsive Design**: Mobile-optimized cards and modals for all devices
- **Escape Key Support**: Standard modal controls for consistent user experience

### 📊 Comprehensive Statistics

- **Program-specific Data**: Dynamic statistics for Core Education, Piscine JS, Piscine Go, Piscine AI, and Piscine Rust
- **Access Monitoring**: Real-time display of student platform access status (Active/Blocked)
- **Teammate Navigation**: Interactive teammate lists with clickable logins for quick profile switching
- **Global Analytics**: Audit ratios, project success rates, and performance metrics
- **Admission Games**: Memory and Zzle game performance with level progression and attempt statistics
- **Visual Data**: Interactive charts and graphs for progress tracking
- **Real-time Updates**: Statistics update based on selected program
- **Mobile-Responsive Tables**: Statistics tables adapt from horizontal to vertical layout on smaller screens
- **Optimized Mobile Experience**: No horizontal scrolling required on any device

## Authentication

### JWT Token Management

- Tokens are automatically stored in browser memory
- Automatic token refresh and validation
- Secure logout with token invalidation

### API Endpoints

- **Authentication**: `https://01.tomorrow-school.ai/api/auth/signin`
- **GraphQL**: `https://01.tomorrow-school.ai/api/graphql-engine/v1/graphql`

### Security Features

- HTTPS-only communication
- Secure credential encoding
- CORS-compliant requests
- Input validation and sanitization

## Hosting

### GitHub Pages

The project is hosted on GitHub Pages for free:

- **URL**: `https://uzhomart.github.io/graphql/`
- **Automatic Deployment**: Updates on every push to main branch
- **Custom Domain**: Support for custom domains
- **HTTPS**: Automatic SSL certificate

## Author

- Zhomart Utemissov

- GitHub: [@uzhomart](https://github.com/uzhomart)
- Live Demo: [https://uzhomart.github.io/graphql/](https://uzhomart.github.io/graphql/) or [https://tubular-narwhal-7ef946.netlify.app//](https://tubular-narwhal-7ef946.netlify.app/)

## Acknowledgments

- Tomorrow School for providing the GraphQL API
- Font Awesome for the icon library
- GitHub Pages for free hosting
- The open-source community for inspiration and tools

## 🧮 Data Calculation Logic

The dashboard uses a **dynamic filtering system** to calculate XP and levels, avoiding unreliable hardcoded event IDs. This ensures the dashboard remains functional even if the school updates its event structure.

### XP & Level Filtering (by Event Path)

Instead of targeting specific database IDs, we filter transactions and event data based on their official URL paths:

-   **Core Education**: Calculated using the base path `/astanahub/module/` while **explicitly excluding** nested sub-paths (`/piscine-js/`, `/piscine-ai/`, `/piscine-rust/`) to isolate clean Core progress.
-   **Piscine JS**: Targets the full sub-path `/astanahub/module/piscine-js/`.
-   **Piscine Go**: Targets the dedicated independent path `/astanahub/piscinego/`.
-   **Piscine AI**: Targets the full sub-path `/astanahub/module/piscine-ai/`.
-   **Piscine Rust**: Targets the full sub-path `/astanahub/module/piscine-rust/`.

### Why this approach?
1.  **Zero Hardcoding**: No need to update the source code when new cohorts or batches are added.
2.  **Scalability**: New Piscine iterations are automatically detected if they follow the standard naming convention.
3.  **Precision**: By using path-based filtering, we ensure that only relevant projects contribute to each specific program's statistics, maintaining high data integrity for audit ratios and level progress.

## License

This project is part of the Tomorrow School curriculum and is intended for educational purposes.

---

**Note**: This dashboard is designed specifically for Tomorrow School students and requires valid school credentials to access personal data.
