# PokeGuy - Project Summary

## Overview

**PokeGuy** is a real-time planning poker application built for agile teams. It allows an admin to create voting sessions, invite team members via shareable links, and manage task estimation with engaging features like character avatars and fireworks animations.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| Real-time | Socket.io |
| Animation | canvas-confetti |
| Internationalization | Custom React Context-based i18n |
| Package Manager | pnpm |

---

## Features Implemented

### 🎯 Core Voting Functionality
- **Session Creation**: Admin creates a unique session with an 8-character code
- **Join via Link**: Users join by visiting the session URL and entering their name
- **Vote Options**: ☕ (break), ❓ (unsure), 1, 2, 3, 5, 8 (story points)
- **Real-time Updates**: All votes and state changes sync instantly via WebSocket
- **Vote Reveal**: Admin reveals all votes simultaneously with fireworks animation

### 👥 User Management
- **Random Character Assignment**: Each user gets a unique Family Guy character with avatar
- **Name Persistence**: Names stored in localStorage for session rejoin
- **Name Change**: Users can update their display name during the session
- **Rejoin Support**: Users can refresh and rejoin with their previous state

### 🎨 Character Avatars
12 Family Guy characters with custom images:
- Peter Griffin
- Lois Griffin
- Stewie Griffin
- Brian Griffin
- Chris Griffin
- Meg Griffin
- Glenn Quagmire
- Cleveland Brown
- Joe Swanson
- Herbert
- Angry Monkey
- God

### 📊 Vote Results
- **Vote Distribution**: Shows count for each vote value
- **Average Calculation**: Computes average (excluding ☕ and ❓)
- **Consensus Detection**: Celebrates when everyone votes the same
- **Special Vote Tracking**: Lists users on break or unsure

### 🌍 Internationalization (i18n)
- **URL-based Locales**: Clean URLs with locale prefix (e.g., `/en-US/session/ABC123`)
- **Supported Languages**: English (en-US), Portuguese (pt-BR), Spanish (es-PE)
- **Browser Detection**: Automatic locale detection from Accept-Language header
- **Language Switcher**: Dropdown with flags to switch languages
- **Persistent Preference**: Saves selected language to cookie
- **Complete Translation**: All UI text translated across 3 languages
- **Interpolation Support**: Dynamic values in translations (e.g., vote counts, user names)

### 🌙 Dark Mode
- **Three Modes**: Light, Dark, System (follows OS preference)
- **Persistent**: Saves preference to localStorage
- **Smooth Transitions**: All components support dark theme
- **Translated Labels**: Theme mode labels respect selected language

### 📱 Responsive Design
- **Mobile-First**: Optimized for touch devices
- **Fixed Voting Panel**: Easy thumb access on mobile
- **Responsive Grid**: 2-6 columns based on screen size
- **44px Touch Targets**: Accessible button sizes

### 🎆 Animations
- **Card Flip**: 3D flip animation when votes are revealed
- **Fireworks**: Confetti burst on vote reveal
- **Border Pulse**: Green border when user has voted
- **Badge Pulse**: Animated "Voting in progress" indicator

---

## Project Structure

```
pokeguy/
├── src/
│   ├── app/
│   │   ├── [locale]/                # Locale-specific routes
│   │   │   ├── layout.tsx           # Locale layout with LanguageProvider
│   │   │   ├── page.tsx             # Home page (translated)
│   │   │   └── session/
│   │   │       └── [code]/
│   │   │           └── page.tsx     # Session page (translated)
│   │   ├── globals.css              # Global styles & animations
│   │   └── layout.tsx               # Minimal root layout
│   ├── assets/                      # Character images (12 PNGs)
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── input.tsx
│   │   ├── admin-controls.tsx       # Task creation & vote reveal (translated)
│   │   ├── change-name-modal.tsx    # Name change dialog (translated)
│   │   ├── fireworks.tsx            # Confetti animation
│   │   ├── join-modal.tsx           # Join session dialog (translated)
│   │   ├── language-switcher.tsx    # Language selector dropdown
│   │   ├── session-ended-modal.tsx  # Admin left notification (translated)
│   │   ├── task-display.tsx         # Current task header (translated)
│   │   ├── theme-provider.tsx       # Dark mode context
│   │   ├── theme-toggle.tsx         # Theme switcher button (translated)
│   │   ├── user-card.tsx            # User avatar with vote
│   │   ├── users-grid.tsx           # Grid of user cards (translated)
│   │   ├── vote-results.tsx         # Results summary (translated)
│   │   └── voting-panel.tsx         # Vote buttons (translated)
│   ├── hooks/
│   │   ├── use-session.ts           # Session state management
│   │   └── use-socket.ts            # Socket.io connection
│   ├── i18n/
│   │   ├── context.tsx              # React Context & useTranslations hook
│   │   ├── get-locale.ts            # Locale parsing utilities
│   │   ├── index.ts                 # i18n configuration & types
│   │   ├── en-US.json               # English translations
│   │   ├── pt-BR.json               # Portuguese translations
│   │   └── es-PE.json               # Spanish translations
│   ├── lib/
│   │   ├── characters.ts            # Character data & images
│   │   ├── socket.ts                # Socket.io client singleton
│   │   └── utils.ts                 # Utility functions (cn)
│   ├── server/
│   │   └── socket-server.ts         # Socket.io event handlers
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── middleware.ts                # Next.js middleware for locale handling
├── server.ts                        # Custom server with Socket.io
├── tsconfig.json                    # Next.js TypeScript config
├── tsconfig.server.json             # Server TypeScript config
├── package.json                     # Dependencies & scripts
├── pnpm-lock.yaml                   # pnpm lock file
└── README.md                        # Project documentation
```

---

## Internationalization (i18n) Architecture

### Implementation Details

**Custom React Context-based i18n** (no external libraries)

#### URL Structure
- All routes are prefixed with locale: `/{locale}/path`
- Examples: `/en-US/`, `/pt-BR/session/ABC123`, `/es-PE/`

#### Locale Detection Flow
1. **URL pathname** - If locale present in URL, use it
2. **Cookie preference** - `NEXT_LOCALE` cookie from previous selection
3. **Accept-Language header** - Browser language preferences
4. **Default fallback** - `en-US` if none of the above match

#### Middleware
`src/middleware.ts` intercepts all requests and:
- Validates locale in pathname
- Redirects requests without locale to appropriate locale-prefixed URL
- Reads cookie preference or Accept-Language header
- Skips processing for static files and API routes

#### Translation System
- **`useTranslations()` hook** - Returns `t()` function, current `locale`, and `setLocale()`
- **Dot notation** - Access nested keys like `t('home.title')`
- **Interpolation** - Dynamic values like `t('voteResults.consensusReached', { vote: '5' })`
- **Fallback** - Missing translations fall back to English
- **Type-safe** - TypeScript types derived from English translation file

#### Language Persistence
- Selected language saved to `NEXT_LOCALE` cookie (1 year expiry)
- Cookie read by middleware on subsequent visits
- Changing language redirects to same page with new locale prefix

---

## Socket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `session:create` | callback(code) | Create new session |
| `session:join` | code, name, callback | Join existing session |
| `session:rejoin` | code, name, callback | Rejoin after refresh |
| `user:vote` | VoteValue | Submit a vote |
| `user:change-name` | newName | Update display name |
| `admin:create-task` | title | Create voting task |
| `admin:reveal-votes` | - | Reveal all votes |
| `admin:new-task` | - | Clear for next task |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `session:state` | Session | Full session state |
| `session:ended` | - | Admin left |
| `user:joined` | User | New user joined |
| `user:left` | userId | User disconnected |
| `user:voted` | userId | User submitted vote |
| `user:name-changed` | userId, newName | Name updated |
| `task:created` | Task | New task started |
| `votes:revealed` | - | Votes are visible |
| `error` | message | Error occurred |

---

## Type Definitions

```typescript
type VoteValue = '☕' | '❓' | '1' | '2' | '3' | '5' | '8' | null;

interface User {
  id: string;           // Socket ID
  name: string;         // Display name
  character: string;    // Character name
  vote: VoteValue;      // Current vote
  hasVoted: boolean;    // Has submitted vote
  isOnBreak: boolean;   // Voted ☕
}

interface Task {
  id: string;
  title: string;
}

interface Session {
  code: string;         // 8-char uppercase code
  adminId: string;      // Admin's socket ID
  users: User[];
  currentTask: Task | null;
  isVotingActive: boolean;
  isRevealed: boolean;
}

interface Character {
  name: string;
  image: StaticImageData;
  color: string;
}

// i18n types
type Locale = 'en-US' | 'pt-BR' | 'es-PE';

interface Translations {
  common: { ... };
  home: { ... };
  session: { ... };
  joinModal: { ... };
  changeNameModal: { ... };
  adminControls: { ... };
  voteResults: { ... };
  sessionEnded: { ... };
  language: { ... };
  theme: { ... };
}
```

---

## Commands

```bash
# Install dependencies
pnpm install

# Run development server (with ts-node for hot reload)
pnpm dev

# Build for production (Next.js + server compilation)
pnpm build

# Start production server (pre-compiled JavaScript)
pnpm start

# Lint code
pnpm lint
```

---

## User Flow

### Admin Flow
1. Visit home page → Click "Create New Session"
2. Share session link with team
3. Enter task title → Click "Create Task"
4. Wait for team to vote
5. Click "Reveal Votes" → See results with fireworks
6. Click "New Task" to continue

### User Flow
1. Open shared session link
2. Enter name → Click "Join Session"
3. Wait for admin to create task
4. Click vote button (1-8, ☕, or ❓)
5. See card turn green (voted)
6. Wait for reveal → See all votes flip

### Language Selection Flow
1. Visit home page (auto-detects browser language)
2. Click language switcher (flag icon) in top-right
3. Select preferred language from dropdown
4. Language preference saved to cookie
5. All future visits use saved language

---

## Key Implementation Details

### Real-time Sync
- Socket.io handles bidirectional communication
- Custom server (`server.ts`) integrates Socket.io with Next.js
- In-memory session storage (Map)
- Automatic cleanup on admin disconnect

### State Management
- `useSession` hook manages all session state
- `useSocket` hook handles connection lifecycle
- Optimistic updates for votes and name changes
- localStorage for name persistence

### Internationalization
- Middleware intercepts all requests for locale detection
- `LanguageProvider` context wraps app with current locale
- `useTranslations()` hook provides `t()` function to all components
- Cookie stores language preference for persistence
- Translation files organized by locale (en-US.json, pt-BR.json, es-PE.json)
- URL structure preserves locale across navigation

### Dark Mode
- CSS variables in `globals.css` for theme colors
- `ThemeProvider` context with system preference detection
- Class-based switching (`dark` class on `<html>`)
- Persisted to localStorage

### Animations
- CSS `perspective` and `transform` for card flip
- `canvas-confetti` library for fireworks
- Tailwind `animate-pulse` for status badges
- Smooth `transition` on all interactive elements

---

## Translation Coverage

All user-facing text is fully translated across 3 languages:

### Translated Components
- Home page (title, subtitle, buttons)
- Session page header (app name, admin badge, copy link)
- Join modal (title, description, input placeholder, buttons)
- Change name modal (title, description, buttons)
- Admin controls (all labels, status messages)
- Task display (waiting states, voting status)
- Vote results (distribution, average, consensus messages)
- Voting panel (waiting message)
- Users grid (empty state messages)
- Session ended modal (title, description, buttons)
- Theme toggle (system, dark, light labels)

### Translation Keys Structure
```json
{
  "common": { "appName", "admin", "cancel", "save", "copied", "connecting" },
  "home": { "title", "subtitle", "description", "createSession", "creating", "noAccount" },
  "session": { "copyLink", "participants", "waitingForTask", ... },
  "joinModal": { "title", "description", "namePlaceholder", ... },
  "adminControls": { "title", "taskPlaceholder", "createTask", ... },
  "voteResults": { "title", "consensusReached", "voteDistribution", ... },
  "theme": { "system", "dark", "light" },
  "language": { "en-US": "English", "pt-BR": "Português", "es-PE": "Español" }
}
```

---

## Deployment Optimizations

### December 2024 - Build & Deployment Performance Improvements

The deployment pipeline was optimized to reduce total deployment time from ~8 minutes to ~2-3 minutes.

#### Changes Made

| Change | Impact |
|--------|--------|
| Pre-compiled server code | Reduced `pnpm start` from ~2 min to ~5 sec |
| Standalone Next.js output | Smaller deployment artifacts, faster cold starts |
| Static locale generation | Pre-built locale routes instead of dynamic rendering |
| Render configuration | Explicit build/start commands with health checks |

#### Technical Details

1. **Removed `ts-node` from Production**
   - Server code (`server.ts`, `socket-server.ts`) is now pre-compiled to JavaScript during build
   - Added `tsc-alias` to resolve TypeScript path aliases in compiled output
   - Production start command now runs `node dist/server.js` instead of `ts-node`

2. **Next.js Standalone Output**
   - Added `output: 'standalone'` to `next.config.ts`
   - Creates minimal deployment with only required dependencies

3. **Static Generation for Locales**
   - Added `generateStaticParams()` to locale layout
   - All 3 locale routes (en-US, pt-BR, es-PE) are pre-built at build time

4. **Render Configuration**
   - Added `render.yaml` for explicit deployment configuration
   - Configured health check endpoint for reliable deployments

#### Performance Results

| Metric | Before | After |
|--------|--------|-------|
| `pnpm build` | ~3-4 min | ~2-3 min |
| `pnpm start` | ~2 min | ~5 sec |
| **Total Deploy** | ~8 min | ~2-3 min |

---

## Future Enhancements (Not Implemented)
- [ ] Session history/persistence
- [ ] Custom vote scales
- [ ] Timer for voting
- [ ] Export results
- [ ] Multiple admins
- [ ] Spectator mode
- [ ] Sound effects
- [ ] Additional language support
- [ ] RTL language support

---

## Recent Changes

### December 2024 - Internationalization Implementation
- ✅ Implemented URL-based internationalization with 3 supported languages
- ✅ Created custom React Context-based i18n solution (no external libraries)
- ✅ Added Next.js middleware for automatic locale detection and redirection
- ✅ Implemented language switcher component with flag icons
- ✅ Translated all UI components and modals
- ✅ Added cookie-based language preference persistence
- ✅ Restructured app with `[locale]` dynamic route segments
- ✅ Implemented translation interpolation for dynamic values
- ✅ Added browser language detection via Accept-Language header

---

## Created By
Built with ❤️ for agile teams using Next.js, Socket.io, Tailwind CSS, and custom i18n.
