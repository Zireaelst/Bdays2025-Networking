# Blockchain Days'25 Networking Application

This is a networking application for Blockchain Days 2025 event that allows attendees to connect with each other by scanning QR codes.

## Features

- User registration with name, email, and optional phone/LinkedIn URL
- Unique QR code generation for each user
- QR code scanning to connect with other attendees
- Points system for connections with bonus rewards
- Leaderboard showing top networkers
- Local data persistence
- Progressive Web App (PWA) capabilities

## Project Structure

```
├── public/                    # Public assets and HTML
│   ├── index.html             # Main HTML file
│   └── sw.js                  # Service Worker for PWA
├── src/                       # Source code
│   ├── assets/                # Images and icons
│   ├── css/                   # CSS styles
│   └── js/                    # JavaScript files
│       ├── api/               # API services
│       │   └── localApiService.js  # Local backend simulation
│       ├── components/        # UI components
│       ├── config/            # Configuration files
│       └── utils/             # Utility functions
├── manifest.json              # PWA manifest
├── package.json               # NPM dependencies and scripts
└── vite.config.js             # Vite configuration
```

## Local Backend Implementation

The application simulates a backend service using `localStorage` to store user data, connections, and QR codes. This implementation will later be replaced with AWS Lambda functions.

The `LocalApiService` provides the following methods:
- `registerUser()` - Register a new user and generate a QR code
- `getUserById()` - Get user data by ID
- `getUserByEmail()` - Get user data by email
- `getUserQR()` - Get a user's QR code
- `addConnection()` - Add a connection between two users
- `getLeaderboard()` - Get the current leaderboard

## Setup and Running

### Prerequisites
- Node.js (v14+)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/blockchain-days-25-networking.git
cd blockchain-days-25-networking
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Future Improvements

- Replace localStorage with AWS Lambda functions for the backend
- Add user authentication
- Implement real-time updates using WebSockets
- Add more detailed analytics for connections
- Expand mobile app features

## License

This project is licensed under the MIT License - see the LICENSE file for details.