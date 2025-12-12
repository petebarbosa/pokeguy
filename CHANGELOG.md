# PokeGuy - Project changelog

## Overview

**PokeGuy** is a real-time planning poker application built for agile teams. It allows an admin to create voting sessions, invite team members via shareable links, and manage task estimation with engaging features like character avatars and fireworks animations.

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
| `session:state` | Session | Sanitized session state (votes hidden until reveal) |
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
- **Server-side vote sanitization**: Votes are hidden from other users until admin reveals them

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

### Vote Security
The application implements server-side vote sanitization to prevent information disclosure:

- **Problem Solved**: Previously, all user votes were broadcast to all clients immediately after voting, allowing users to inspect WebSocket messages, React DevTools, or DOM to see others' votes before the admin revealed them.
- **Solution**: Server-side sanitization via `sanitizeSessionForUser()` function
- **Implementation**:
  - Each `session:state` emission is now sent individually to each socket
  - Users only see their own vote value; other users' votes appear as `null`
  - The `hasVoted` flag is preserved so the UI can show "voted" indicators
  - When admin reveals votes (`isRevealed: true`), full session state is sent to all users
- **Security Principle**: Never send data to the client that they shouldn't see

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

## Recent Changes

### December 2024 - Keep-Alive Feature for Render Free Tier

Added a heartbeat mechanism to prevent Render's free tier from putting the server to sleep during discussion phases.

#### Problem Solved
- Render's free plan shuts down the server after ~15 minutes of inactivity
- During planning poker sessions, teams often discuss tasks without actively clicking on the app
- This caused sessions to end unexpectedly even when users had the page open

#### Changes Made

| File | Change |
|------|--------|
| `src/types/index.ts` | Added `keepalive:ping` and `keepalive:pong` socket event types |
| `src/server/socket-server.ts` | Added handler that responds to ping events |
| `src/hooks/use-keepalive.ts` | New hook that sends pings every 60 seconds |
| `src/app/[locale]/session/[code]/page.tsx` | Integrated `useKeepalive` hook for all participants |

#### Technical Details

- **All participants send pings**: Not just admins - ensures server stays alive if anyone has the page open
- **60-second interval**: Well under Render's ~15 minute timeout
- **Connection-aware**: Only sends pings when socket is connected
- **Proper cleanup**: Clears interval on unmount or disconnection

#### Bug Fix
- Fixed TypeScript error in `vote-results.tsx` where `closest` variable was incorrectly inferred as literal type `1` instead of union type `1 | 2 | 3 | 5 | 8`

---

### December 2024 - Vote Results Display Fix
Fixed voting results display issues in the `VoteResults` component.

#### Changes Made

| Change | Description |
|--------|-------------|
| Added `NUMERIC_VALUES` constant | Array `[1, 2, 3, 5, 8]` for numeric calculations |
| Added `roundToNearestVoteOption()` function | Rounds average to nearest valid story point (1, 2, 3, 5, or 8) |
| Updated average display | Shows rounded value instead of decimal (e.g., "3" instead of "2.7") |
| Fixed bar chart heights | Changed from percentage to pixel-based heights for reliable rendering |

#### Technical Details

1. **Average Rounding**
   - Previously displayed decimal averages like "2.7" which aren't valid story points
   - New `roundToNearestVoteOption()` function finds the closest valid vote option
   - Average now displays as actionable story point values (1, 2, 3, 5, or 8)

2. **Bar Chart Height Fix**
   - Percentage-based heights didn't work because parent container lacked explicit height
   - Changed to pixel-based heights with `maxBarHeight = 100px`
   - Minimum height of 8px for bars with votes (ensures visibility)
   - Minimum height of 4px for bars without votes
   - Improved gap spacing from `gap-2` to `gap-1` for better layout

---

### December 2024 - ESLint & TypeScript Fixes
Fixed all linting errors (22 problems: 18 errors, 4 warnings) to ensure code quality and compatibility with React Compiler.

#### Changes Made

| File | Fix |
|------|-----|
| `eslint.config.mjs` | Added `dist/**` to ignore list to exclude compiled JS files |
| `src/hooks/use-socket.ts` | Removed unused `getSocket` import; used `queueMicrotask` to avoid synchronous setState in effect |
| `src/hooks/use-session.ts` | Fixed `useMemo` dependency (`socket?.id` → `socket`); removed unused `_user` callback parameter |
| `src/components/theme-provider.tsx` | Refactored to use lazy state initialization instead of setState in effects; derived `resolvedTheme` via `useMemo` |
| `src/app/[locale]/session/[code]/page.tsx` | Removed unused `isJoining` state; refactored join flow to state machine pattern with `queueMicrotask` |
| `src/types/images.d.ts` | Changed `any` types to `string` for image module declarations |
| `src/i18n/context.tsx` | Removed unused `Translations` import |
| `src/components/vote-results.tsx` | Changed `NUMERIC_VOTES` to `as const`; removed unused `VoteValue` import |

#### Technical Details

1. **React Compiler Compatibility**
   - Avoided synchronous `setState` calls inside `useEffect` bodies (causes cascading renders)
   - Used `queueMicrotask()` to defer state updates when synchronous update was unavoidable
   - Fixed `useMemo` dependencies to satisfy React Compiler's memoization preservation rules

2. **State Machine Pattern for Join Flow**
   - Replaced multiple boolean flags with single state: `'idle' | 'checking' | 'show_modal' | 'joined'`
   - Cleaner logic flow and easier to reason about

3. **Type Safety Improvements**
   - Image module declarations now use `string` instead of `any`
   - `NUMERIC_VOTES` uses `as const` for proper tuple inference

---

### December 2024 - Security Fix: Server-Side Vote Sanitization
- ✅ Fixed critical information disclosure vulnerability where user votes were visible in WebSocket payloads before admin reveal
- ✅ Implemented server-side session sanitization (`sanitizeSessionForUser`) to hide other users' votes
- ✅ Replaced broadcast `session:state` emissions with per-user sanitized emissions (`emitSessionState`)
- ✅ Each user now only sees their own vote until admin reveals all votes
- ✅ Preserved `hasVoted` flag so UI can still show "voted" indicators
- ✅ Zero client-side changes required - fix is entirely server-side

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
---

