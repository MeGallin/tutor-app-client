# Tutor AI - Front-End Application

This is the front-end client application for Tutor AI, built using React, Vite, and Bootstrap 5.

## Technology Stack

- **Vite** - Fast build tool and development server
- **React 18+** - Modern React with functional components and hooks
- **Bootstrap 5** - Responsive UI framework
- **React Router v6** - Client-side routing
- **Context API** - State management

## Application Structure

The application follows a modular architecture with the following structure:

```
src/
  ├── assets/         # Static assets (images, fonts, etc.)
  ├── components/     # Reusable UI components
  │   ├── common/     # Shared components (Header, Footer, etc.)
  │   └── layout/     # Layout components (MainLayout)
  ├── context/        # React Context providers
  ├── hooks/          # Custom React hooks
  ├── pages/          # Page components
  │   └── auth/       # Authentication-related pages
  ├── routes/         # Routing configuration
  ├── styles/         # Global styles and theme settings
  ├── utils/          # Utility functions and helpers
  ├── api/            # API client and utilities
  └── services/       # Service modules for API integration
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173

#### API Configuration

The application can connect to the API in two ways:

1. **Local Development**:

   - By default, when no `VITE_API_URL` is set, API requests are proxied to `http://localhost:8000`
   - Make sure the backend API server is running locally on port 8000

2. **Production/Staging**:
   - Create a `.env` file based on `.env.example`
   - Set `VITE_API_URL` to the full URL of your deployed API (e.g., `https://tutor-app-api.onrender.com`)

```bash
# Example .env file for production
VITE_API_URL=https://tutor-app-api.onrender.com
```

### Building for Production

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Features

- **Authentication** - User registration and login
- **Responsive Design** - Works on desktop and mobile devices
- **Component-based Architecture** - Modular and maintainable code
- **Form Handling** - Custom hooks for form state management and validation

## Future Enhancements

- Dashboard for logged-in users
- Integration with backend APIs
- Chat interface for the AI tutor
- User profile management
