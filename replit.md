# AI Nebula - 3D Interactive Tool Visualization

## Overview

AI Nebula is an immersive 3D web application that visualizes AI tools as an interactive star nebula. Users can explore different AI tools organized into constellations, with each tool represented as a glowing star in 3D space. The application provides detailed information about each tool through an interactive interface, allowing users to navigate between global and constellation-specific views.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a modern React-based single-page application (SPA) architecture:

- **Framework**: React 18 with TypeScript for type safety and developer experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming, shadcn/ui component library for consistent UI components
- **3D Rendering**: Three.js for 3D scene management, OrbitControls for camera interaction, CSS2DRenderer for HTML labels in 3D space

### Component Structure
- **Page Components**: Single main page (AINebulaPage) with routing fallback
- **UI Components**: Comprehensive shadcn/ui component library including buttons, cards, dialogs, forms, and custom components
- **Custom Components**: Loading screen, tool detail panel, navigation buttons for constellation switching
- **Hooks**: Custom hooks for Three.js scene management, mobile detection, and toast notifications

### Data Architecture
- **Static Data**: AI tools and constellations defined in TypeScript interfaces
- **Tool Classification**: Tools organized by categories (开发星座, 内容星座, 效率星座) with proficiency ratings and feature lists
- **3D Positioning**: Dynamic positioning system for stars and constellations in 3D space

### Backend Architecture
The backend follows a simple Express.js server pattern:

- **Server Framework**: Express.js with TypeScript
- **Development**: Vite integration for hot module replacement and development server
- **Storage Interface**: Abstract storage interface with in-memory implementation for user management
- **API Structure**: RESTful API pattern with /api prefix routing

### Build and Development
- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript Configuration**: Strict TypeScript settings with path aliases for clean imports
- **Development Mode**: Integrated development server with hot reloading and error overlay
- **Production Build**: Separate client and server builds with ESM module format

## External Dependencies

### Core Frontend Dependencies
- **React Ecosystem**: React 18, React DOM for UI framework
- **3D Graphics**: Three.js for WebGL-based 3D rendering and scene management
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling, class-variance-authority for component variants
- **State Management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing

### Backend Dependencies
- **Server**: Express.js for HTTP server and middleware
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon Database serverless driver
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type validation, drizzle-zod for schema validation

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full TypeScript support with strict configuration
- **Database**: Drizzle Kit for database migrations and schema management
- **Replit Integration**: Vite plugin for Replit development environment

### Database Integration
- **ORM**: Drizzle ORM configured for PostgreSQL with Neon Database
- **Schema**: User management schema with UUID primary keys and unique constraints
- **Migrations**: Automated migration system using Drizzle Kit
- **Connection**: Serverless database connection optimized for cloud deployment