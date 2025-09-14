# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Spider AI** is an AI-powered full-stack web development platform that generates complete applications from natural language descriptions. Built as a comprehensive Lovable AI clone using modern web technologies.

## Development Commands

### Starting the Application
```bash
# Start both frontend and backend in development mode
npm run dev

# Start only frontend (React + Vite)
npm run dev:frontend

# Start only backend (Node.js + Express)
npm run dev:backend
```

### Building
```bash
# Build all workspaces
npm run build

# Build specific workspace
npm run build:frontend
npm run build:backend
```

### Testing
```bash
# Run all tests
npm run test

# Run specific tests
npm run test --workspace=apps/frontend
npm run test --workspace=apps/backend
```

### Database Operations
```bash
# Setup database (generate, migrate, seed)
npm run db:setup

# Run migrations
npm run db:migrate

# Reset database
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

## Architecture

### Project Structure
```
WebAi/
├── apps/
│   ├── frontend/          # React TypeScript frontend
│   │   ├── src/
│   │   │   ├── components/    # React components organized by feature
│   │   │   ├── store/         # Redux Toolkit store and slices
│   │   │   ├── services/      # API and socket services
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   └── lib/           # Utility functions
│   │   └── package.json
│   └── backend/           # Node.js Express backend
│       ├── src/
│       │   ├── routes/        # API route handlers
│       │   ├── services/      # Business logic services
│       │   ├── middleware/    # Express middleware
│       │   ├── database/      # Database connection and models
│       │   └── utils/         # Backend utilities
│       └── package.json
└── package.json           # Root package.json with workspaces
```

### Key Technologies

**Frontend:**
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- TanStack Query for server state
- Tailwind CSS for styling
- Monaco Editor for code editing
- Socket.IO client for real-time features

**Backend:**
- Node.js with Express and TypeScript
- Prisma ORM with PostgreSQL
- Socket.IO for WebSocket connections
- JWT authentication
- Redis for caching
- Winston for logging

## Component Architecture

### State Management
The application uses Redux Toolkit with the following slices:
- `authSlice`: User authentication and prompt counting
- `chatSlice`: AI conversation management
- `editorSlice`: Code editor file management
- `previewSlice`: Live preview state
- `projectsSlice`: Project CRUD operations
- `uiSlice`: UI state and theme management

### Key Components

**Landing Page (`/`):**
- Public landing page with demo mode
- Allows 5 free prompts before requiring signup
- Showcases features and examples

**Chat Interface (`components/chat/`):**
- Real-time AI conversation
- Message history with code syntax highlighting
- Typing indicators and loading states

**Code Editor (`components/editor/`):**
- Monaco editor integration
- Multi-file editing with syntax highlighting
- File explorer with language detection

**Live Preview (`components/preview/`):**
- Real-time HTML/CSS/JS preview
- Responsive viewport testing
- Iframe sandbox for security

### Routing Structure
```
/ - Landing page (public)
/auth/login - Login page
/auth/register - Registration page
/app/dashboard - Main dashboard (protected)
/app/project/:id - Project editor (protected)
/app/settings - User settings (protected)
```

## AI Integration

### Prompt Limiting System
- Unauthenticated users: 5 free prompts
- Tracked in Redux store (`auth.promptCount`)
- Forces registration after limit reached

### Code Generation Flow
1. User enters prompt in chat interface
2. `sendMessage` thunk processes request
3. Mock API simulates AI response (replace with Claude API)
4. Generated code populates editor files
5. Live preview updates automatically

## Development Guidelines

### File Naming
- Components: PascalCase (`ChatMessage.tsx`)
- Services: camelCase (`socketService.ts`)
- Types: Exported from `types/index.ts`
- Utilities: camelCase in `lib/utils.ts`

### State Updates
- Use Redux Toolkit slices for global state
- Prefer TypeScript interfaces for type safety
- Handle loading/error states consistently

### Socket.IO Integration
- Real-time collaboration features ready
- Socket service in `services/socket.ts`
- Events: file updates, user presence, generation progress

## Environment Setup

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/spider_ai"
REDIS_URL="redis://localhost:6379"

# AI Service (when backend is connected)
CLAUDE_API_KEY="your-claude-api-key"

# Authentication
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# Frontend
VITE_API_URL="http://localhost:3000"
```

## Current Status

### Completed Features
✅ Complete React frontend with responsive design  
✅ Redux store with all necessary slices  
✅ Chat interface with mock AI responses  
✅ Monaco code editor with multi-file support  
✅ Live preview with iframe sandbox  
✅ Landing page with demo mode  
✅ Authentication flow (UI only)  
✅ Socket.IO service for real-time features  
✅ Project management dashboard  

### TODO
- Connect to actual Claude API backend
- Implement user registration/login backend
- Add project persistence to database
- Implement code export functionality
- Add deployment integrations

## Development Tips

### Running Frontend Only
The frontend works independently with mock data. Start with:
```bash
npm run dev:frontend
```

### Adding New Components
1. Create component in appropriate feature directory
2. Add to `index.ts` exports if reusable
3. Update types in `types/index.ts` if needed
4. Add to Redux slices for state management

### Debugging
- Frontend: http://localhost:3001
- Redux DevTools available in development
- React Query DevTools for API state inspection
- Console logs in mock API service

### Testing Integration
Use the demo mode on the landing page to test:
1. Prompt submission and AI responses
2. Code editor file management
3. Live preview updates
4. Responsive design across viewports
