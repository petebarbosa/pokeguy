export type VoteValue = '☕' | '❓' | '1' | '2' | '3' | '5' | '8' | null;

export interface User {
  id: string;           // Socket ID
  name: string;
  character: string;    // Family Guy character name
  vote: VoteValue;
  hasVoted: boolean;
  isOnBreak: boolean;   // True if user selected ☕
}

export interface Task {
  id: string;
  title: string;
}

export interface VotedTask {
  id: string;
  title: string;
  score: number;
  votedAt: number;
}

export interface Session {
  code: string;
  adminId: string;
  users: User[];
  currentTask: Task | null;
  votedTasks: VotedTask[];
  isVotingActive: boolean;
  isRevealed: boolean;
}

// Socket Events
export interface ServerToClientEvents {
  'session:state': (session: Session) => void;
  'session:ended': () => void;
  'user:joined': (user: User) => void;
  'user:left': (userId: string) => void;
  'user:voted': (userId: string) => void;
  'user:name-changed': (userId: string, newName: string) => void;
  'task:created': (task: Task) => void;
  'votes:revealed': () => void;
  'error': (message: string) => void;
  'keepalive:pong': () => void;
}

export interface ClientToServerEvents {
  'session:create': (callback: (code: string) => void) => void;
  'session:join': (code: string, name: string, callback: (success: boolean, error?: string) => void) => void;
  'session:rejoin': (code: string, name: string, callback: (success: boolean, user?: User) => void) => void;
  'user:vote': (vote: VoteValue) => void;
  'user:change-name': (newName: string) => void;
  'admin:create-task': (title: string) => void;
  'admin:reveal-votes': () => void;
  'admin:new-task': () => void;
  'keepalive:ping': () => void;
}
