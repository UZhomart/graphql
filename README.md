# Tomorrow School Dashboard

A modern, interactive dashboard for Tomorrow School students to view their learning analytics, progress, and achievements. Built with GraphQL, this single-page application provides a comprehensive overview of student data with beautiful visualizations and real-time statistics.

## 🌐 Live Demo

**🔗 [View Live Dashboard](https://uzhomart.github.io/graphql/)**

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Authentication](#authentication)
- [Hosting](#hosting)
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

- **Three Programs**: Core Education, Piscine JS, Piscine Go
- **Dynamic Statistics**: Program-specific XP, Level, and Transaction counts
- **Interactive Cards**: Hover effects and clickable statistics
- **Detailed Popups**: Comprehensive program analytics

#### 📈 Global Statistics

- **Audit Ratio**: Done vs Received with detailed breakdown
- **Audit Analytics**: Total audits, success/failure rates
- **Project Statistics**: Successful and failed project counts
- **Interactive Modals**: Detailed information for each statistic

#### 👥 Participants Info

- **User Search**: Search participants by login, first name, or last name
- **Public Data**: Display ID, Login, First Name, and Last Name
- **Responsive Cards**: Modern card layout with hover effects
- **Real-time Search**: Instant filtering as you type

#### 📊 Data Visualizations

- **XP Progress Chart**: Interactive SVG line chart showing XP growth over time
- **Skills Radar Chart**: Comprehensive skills assessment visualization
- **Responsive Design**: Optimized for all screen sizes

### 🎨 Modern UI/UX

- **Glassmorphism Design**: Translucent cards with backdrop blur effects
- **Gradient Themes**: Beautiful color transitions throughout the interface
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Layout**: Mobile-first design approach
- **Dark Theme**: Easy on the eyes with vibrant accent colors

## Screenshots

### Login Page

- Modern glassmorphism design with animated particle background
- Tomorrow School branding with gradient logo
- Secure authentication with error handling

### Dashboard Overview

- Comprehensive profile information with expandable details
- Program selector with dynamic statistics
- Global statistics cards with interactive popups
- Participants search and information lookup
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
│   │   ├── handleAuth.js          # Authentication state management and logout
│   │   └── handleProfile.js       # Profile data fetching and user session handling
│   ├── 📁 components/
│   │   ├── 📁 global-statistics/
│   │   │   ├── auditRatioPopup.js      # Modal for detailed audit ratio breakdown
│   │   │   ├── auditsPopup.js          # Modal for audit statistics (success/failure rates)
│   │   │   ├── failedProjectsPopup.js  # Modal showing failed projects list
│   │   │   ├── renderAudits.js         # Audits card component with statistics
│   │   │   ├── renderFailedProjects.js # Failed projects card component
│   │   │   ├── renderGlobalStatistics.js # Main global statistics container
│   │   │   ├── renderSuccessfulProjects.js # Successful projects card component
│   │   │   └── successfulProjectsPopup.js # Modal showing successful projects list
│   │   ├── 📁 graphs/
│   │   │   ├── skillsChart.js      # Interactive SVG radar chart for skills assessment
│   │   │   └── transactionsChart.js # Interactive SVG line chart for XP progress over time
│   │   ├── 📁 profile/
│   │   │   ├── renderAudits.js     # Legacy audits component (moved to global-statistics)
│   │   │   ├── renderLevel.js      # User level display component
│   │   │   ├── renderProfileInfo.js # Profile information with expandable details
│   │   │   └── renderTransactions.js # Recent transactions list with scrollable container
│   │   ├── 📁 program-selector/
│   │   │   ├── programDetailsPopup.js # Unified modal for XP, Level, and Transaction details
│   │   │   └── renderProgramSelector.js # Program selection buttons and statistics cards
│   │   ├── 📁 participants-info/
│   │   │   └── renderParticipantsInfo.js # Participants search and information display component
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
- **`graphql.js`**: Contains all GraphQL queries for user data, transactions, audits, and project progress
- **`graphqlRequests.js`**: Manages GraphQL requests with proper error handling and JWT token management

#### 🎨 UI Components

- **`authComponent.js`**: Modern login page with Tomorrow School branding, glassmorphism design, and animated backgrounds
- **`profileComponent.js`**: Main dashboard orchestrator that renders all sections in proper order
- **`renderProfileInfo.js`**: User profile information with expandable "More" section for additional details
- **`renderProgramSelector.js`**: Program selection (Core Education, Piscine JS, Piscine Go) with dynamic statistics
- **`renderGlobalStatistics.js`**: Global statistics container with audit ratio, audits, and project statistics
- **`renderParticipantsInfo.js`**: Participants search and information display with login-based lookup

#### 📊 Data Visualization

- **`skillsChart.js`**: Interactive SVG radar chart displaying user skills assessment
- **`transactionsChart.js`**: Interactive SVG line chart showing XP progress over time
- **`programDetailsPopup.js`**: Unified modal displaying detailed XP, Level, or Transaction information

#### 🎯 Statistics & Analytics

- **`renderAudits.js`**: Audit statistics card showing total audits, success/failure rates
- **`renderSuccessfulProjects.js`**: Successful projects counter with detailed project list
- **`renderFailedProjects.js`**: Failed projects counter with retry attempt tracking
- **`auditRatioPopup.js`**: Detailed audit ratio breakdown (Done vs Received)
- **`auditsPopup.js`**: Comprehensive audit statistics modal
- **`successfulProjectsPopup.js`**: Detailed successful projects list with grades and dates
- **`failedProjectsPopup.js`**: Detailed failed projects list with attempt counts

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
- **`global-statistics.css`**: Global statistics section styles with card layouts and modal popups
- **`participants-info.css`**: Participants info section styles with search interface and responsive card layouts

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

   **Option 1: Using Python**

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option 2: Using Node.js**

   ```bash
   npx serve .
   ```

   **Option 3: Using PHP**

   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**

   ```bash
   http://localhost:8000
   ```

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
- **Program Selector**: Switch between Core Education, Piscine JS, and Piscine Go
- **Global Statistics**: Click on any statistic card for detailed information
- **Data Visualizations**: Interactive charts showing your progress and skills

### Logout

Click the "Logout" button in the top-right corner to securely end your session.

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

## License

This project is part of the Tomorrow School curriculum and is intended for educational purposes.

## Author

- Zhomart Utemissov

- GitHub: [@uzhomart](https://github.com/uzhomart)
- Live Demo: [https://uzhomart.github.io/graphql/](https://uzhomart.github.io/graphql/)

## Acknowledgments

- Tomorrow School for providing the GraphQL API
- Font Awesome for the icon library
- GitHub Pages for free hosting
- The open-source community for inspiration and tools

---

**Note**: This dashboard is designed specifically for Tomorrow School students and requires valid school credentials to access personal data.
