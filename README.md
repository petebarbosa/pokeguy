# PokeGuy - Real-time Planning Poker

A real-time voting application for agile teams. Create sessions, invite your team via a shareable link, and manage task voting with fireworks reveal animation.

## Features

- **Real-time voting**: All participants see votes update in real-time
- **Session management**: Admin creates sessions and controls the voting flow
- **Character avatars**: Each user gets a random Family Guy character avatar
- **Vote options**: ☕ (break), ❓ (unsure), 1, 2, 3, 5, 8 (story points)
- **Fireworks animation**: Celebratory confetti when votes are revealed
- **Vote statistics**: Average, distribution, and consensus detection
- **Mobile responsive**: Works great on all devices
- **Reconnection support**: Users can rejoin after refresh

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Real-time**: Socket.io
- **Animation**: canvas-confetti

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

### Development

Run the development server (includes Socket.io server):

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Production

Build the application:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Usage

### Creating a Session (Admin)

1. Open the application
2. Click "Create New Session"
3. Share the session link with your team
4. Create tasks and manage voting

### Joining a Session (User)

1. Open the shared session link
2. Enter your name
3. Wait for the admin to create a task
4. Vote on tasks using the voting panel

### Voting Options

| Option | Meaning |
|--------|---------|
| ☕ | Taking a break (excluded from voting) |
| ❓ | Unsure/need discussion |
| 1-8 | Story point estimates |

### Admin Controls

- **Create Task**: Start a new voting round
- **Reveal Votes**: Show all votes with fireworks
- **New Task**: Clear results and prepare for next round

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home page - Create session
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles & animations
│   └── session/
│       └── [code]/
│           └── page.tsx            # Session page
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── admin-controls.tsx          # Admin panel
│   ├── change-name-modal.tsx       # Name change dialog
│   ├── fireworks.tsx               # Confetti animation
│   ├── join-modal.tsx              # Join session dialog
│   ├── session-ended-modal.tsx     # Session ended dialog
│   ├── task-display.tsx            # Current task display
│   ├── user-card.tsx               # User avatar card
│   ├── users-grid.tsx              # Grid of user cards
│   ├── vote-results.tsx            # Vote statistics
│   └── voting-panel.tsx            # Vote buttons
├── hooks/
│   ├── use-session.ts              # Session state management
│   └── use-socket.ts               # Socket.io connection
├── lib/
│   ├── characters.ts               # Family Guy characters
│   ├── socket.ts                   # Socket.io client
│   └── utils.ts                    # Utility functions
├── server/
│   └── socket-server.ts            # Socket.io event handlers
└── types/
    └── index.ts                    # TypeScript definitions
```

## License

MIT
