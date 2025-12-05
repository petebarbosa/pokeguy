# Project Overview

This project, named "PokeGuy", is a real-time planning poker application designed for agile development teams. It enables teams to collaboratively estimate story points for their tasks in a seamless and interactive manner. The application is built with a modern tech stack, featuring a Next.js frontend and a custom Node.js server with Socket.io for real-time communication.

## How it works?

The application allows an administrator to create a new session, which generates a unique session code. This code can then be shared with team members, who can join the session by providing their name. Once in the session, users are assigned a random character from the "Family Guy" series as their avatar.

The administrator can then create tasks to be estimated. All participants can vote on the current task using a predefined set of values, including story points (1, 2, 3, 5, 8), a coffee cup for a break, and a question mark for uncertainty. The votes are cast in real-time, and once everyone has voted, the administrator can reveal the results. The reveal is accompanied by a celebratory fireworks animation.

The application also supports user reconnection. If a user's connection is interrupted, they can rejoin the session and their state will be restored.

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Real-time Communication**: Socket.io
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS 4
- **Animation**: canvas-confetti

# Building and Running

## Prerequisites

- Node.js 18+
- pnpm 9+

## Installation

1.  **Clone the repository.**
2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

## Development

To run the application in development mode, which includes the Socket.io server, use the following command:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Production

To build the application for production, use the following command:

```bash
pnpm build
```

To start the production server, use the following command:

```bash
pnpm start
```

# Development Conventions

## Code Style

The project uses ESLint for code linting. You can run the linter with the following command:

```bash
pnpm lint
```

## Project Structure

The project follows a standard Next.js project structure, with the addition of a custom server and a `src` directory.

- `src/app`: Contains the main application pages and layouts.
- `src/components`: Contains the reusable React components.
- `src/hooks`: Contains custom React hooks.
- `src/lib`: Contains utility functions and libraries.
- `src/server`: Contains the Socket.io server logic.
- `src/types`: Contains the TypeScript type definitions.
- `server.ts`: The custom Node.js server that integrates Next.js and Socket.io.

## Real-time Events

The application uses Socket.io for real-time communication between the client and the server. The main events are:

- `session:create`: Creates a new session.
- `session:join`: Joins an existing session.
- `session:rejoin`: Rejoins a session after a disconnection.
- `user:vote`: Submits a vote for the current task.
- `user:change-name`: Changes the user's name.
- `admin:create-task`: Creates a new task.
- `admin:reveal-votes`: Reveals the votes for the current task.
- `admin:new-task`: Clears the current task and starts a new one.
- `disconnect`: Handles user disconnection.
