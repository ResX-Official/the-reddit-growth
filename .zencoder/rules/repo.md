---
description: Repository Information Overview
alwaysApply: true
---

# Reddit Growth Application Information

## Summary
A Next.js application designed for Reddit account management and growth tracking. The project provides authentication functionality with email verification, password reset capabilities, and Reddit account integration. Users can connect their Reddit accounts, view karma statistics, and manage their Reddit credentials. The application also includes a subreddit tracker feature to search and monitor subreddits.

## Structure
- **app/**: Next.js application routes and pages
- **components/**: React components organized by functionality (auth, Dashboard, common, ui)
- **actions/**: Server actions for authentication flows
- **lib/**: Utility functions, database connections, and Reddit API integration
- **prisma/**: Database schema and migrations
- **public/**: Static assets and images

## Language & Runtime
**Language**: TypeScript
**Framework**: Next.js 14.2.3
**Runtime**: Node.js
**Build System**: Next.js build system
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- next: 14.2.3 (React framework)
- react: ^18 (UI library)
- next-auth: ^5.0.0-beta.18 (Authentication)
- @prisma/client: ^5.13.0 (Database ORM)
- zod: ^3.23.8 (Schema validation)
- tailwindcss: ^3.4.1 (CSS framework)
- @radix-ui components (UI components)

**Development Dependencies**:
- typescript: ^5
- prisma: ^5.14.0
- eslint: ^8

## Database
**ORM**: Prisma
**Database**: PostgreSQL
**Models**: 
- User: Authentication and user management
- Account: OAuth provider accounts
- VerificationToken: Email verification
- PasswordResetToken: Password reset functionality
- RedditAccount: Reddit account credentials and karma tracking

## Build & Installation
```bash
npm install
npx prisma generate
npm run build
npm start
```

## Development
```bash
npm run dev
```

## Authentication
**Provider**: NextAuth.js
**Features**: 
- Email/password authentication
- OAuth providers support
- Email verification
- Password reset
- Two-factor authentication option

## Reddit Integration
**Features**:
- Reddit account connection via username search
- Karma tracking and display
- Reddit account password storage
- Multiple Reddit accounts management
- Account deletion functionality
- Subreddit tracking and search functionality

## Main Components
**Dashboard**:
- Main page displays connected Reddit accounts
- UserAccountCard for displaying account information
- AccountModal for adding new Reddit accounts
- Navigation to Subreddit Tracker page

**Subreddit Tracker**:
- Search functionality for subreddits
- Backend API integration to avoid CORS issues
- Display of subreddit information
- Navigation back to the main dashboard