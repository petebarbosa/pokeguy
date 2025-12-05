import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import {
  Session,
  User,
  Task,
  VoteValue,
  ServerToClientEvents,
  ClientToServerEvents,
} from '../types';
import { getRandomCharacter } from '../lib/characters-data';

// In-memory storage
const sessions = new Map<string, Session>();

// Track which session each socket belongs to
const socketToSession = new Map<string, string>();

export function setupSocketServer(
  io: Server<ClientToServerEvents, ServerToClientEvents>
) {
  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log(`Client connected: ${socket.id}`);

    // Create a new session
    socket.on('session:create', (callback) => {
      const code = uuidv4().substring(0, 8).toUpperCase();
      
      const session: Session = {
        code,
        adminId: socket.id,
        users: [],
        currentTask: null,
        isVotingActive: false,
        isRevealed: false,
      };

      sessions.set(code, session);
      socketToSession.set(socket.id, code);
      socket.join(code);

      console.log(`Session created: ${code} by admin ${socket.id}`);
      callback(code);
    });

    // Join an existing session
    socket.on('session:join', (code, name, callback) => {
      const session = sessions.get(code);

      if (!session) {
        callback(false, 'Session not found');
        return;
      }

      // Check if name is already taken
      const existingUser = session.users.find(
        (u) => u.name.toLowerCase() === name.toLowerCase()
      );
      if (existingUser) {
        callback(false, 'Name already taken in this session');
        return;
      }

      // Get characters already in use
      const usedCharacters = session.users.map((u) => u.character);
      const character = getRandomCharacter(usedCharacters);

      const user: User = {
        id: socket.id,
        name,
        character: character.name,
        vote: null,
        hasVoted: false,
        isOnBreak: false,
      };

      session.users.push(user);
      socketToSession.set(socket.id, code);
      socket.join(code);

      // Broadcast to all users in the session
      io.to(code).emit('user:joined', user);
      
      // Send current session state to the new user
      socket.emit('session:state', session);

      console.log(`User ${name} joined session ${code}`);
      callback(true);
    });

    // Rejoin a session (after refresh)
    socket.on('session:rejoin', (code, name, callback) => {
      const session = sessions.get(code);

      if (!session) {
        callback(false);
        return;
      }

      // Find existing user by name
      const existingUser = session.users.find(
        (u) => u.name.toLowerCase() === name.toLowerCase()
      );

      if (existingUser) {
        // Update the socket ID
        existingUser.id = socket.id;
        
        socketToSession.set(socket.id, code);
        socket.join(code);

        // Notify others about the user coming back
        io.to(code).emit('session:state', session);
        
        console.log(`User ${name} rejoined session ${code}`);
        callback(true, existingUser);
      } else {
        callback(false);
      }
    });

    // User submits a vote
    socket.on('user:vote', (vote: VoteValue) => {
      const code = socketToSession.get(socket.id);
      if (!code) return;

      const session = sessions.get(code);
      if (!session || !session.isVotingActive || session.isRevealed) return;

      const user = session.users.find((u) => u.id === socket.id);
      if (!user) return;

      user.vote = vote;
      user.hasVoted = true;
      user.isOnBreak = vote === '☕';

      io.to(code).emit('user:voted', socket.id);
      io.to(code).emit('session:state', session);

      console.log(`User ${user.name} voted ${vote} in session ${code}`);
    });

    // User changes their name
    socket.on('user:change-name', (newName: string) => {
      const code = socketToSession.get(socket.id);
      if (!code) return;

      const session = sessions.get(code);
      if (!session) return;

      const user = session.users.find((u) => u.id === socket.id);
      if (!user) return;

      // Check if name is already taken
      const nameTaken = session.users.some(
        (u) => u.id !== socket.id && u.name.toLowerCase() === newName.toLowerCase()
      );
      if (nameTaken) {
        socket.emit('error', 'Name already taken');
        return;
      }

      const oldName = user.name;
      user.name = newName;

      io.to(code).emit('user:name-changed', socket.id, newName);
      io.to(code).emit('session:state', session);

      console.log(`User ${oldName} changed name to ${newName} in session ${code}`);
    });

    // Admin creates a new task
    socket.on('admin:create-task', (title: string) => {
      const code = socketToSession.get(socket.id);
      if (!code) return;

      const session = sessions.get(code);
      if (!session || session.adminId !== socket.id) return;

      const task: Task = {
        id: uuidv4(),
        title,
      };

      session.currentTask = task;
      session.isVotingActive = true;
      session.isRevealed = false;

      // Reset votes for all users except those on break
      session.users.forEach((user) => {
        if (!user.isOnBreak) {
          user.vote = null;
          user.hasVoted = false;
        }
      });

      io.to(code).emit('task:created', task);
      io.to(code).emit('session:state', session);

      console.log(`Admin created task "${title}" in session ${code}`);
    });

    // Admin reveals votes
    socket.on('admin:reveal-votes', () => {
      const code = socketToSession.get(socket.id);
      if (!code) return;

      const session = sessions.get(code);
      if (!session || session.adminId !== socket.id) return;

      session.isRevealed = true;

      io.to(code).emit('votes:revealed');
      io.to(code).emit('session:state', session);

      console.log(`Admin revealed votes in session ${code}`);
    });

    // Admin starts a new task (clears current task)
    socket.on('admin:new-task', () => {
      const code = socketToSession.get(socket.id);
      if (!code) return;

      const session = sessions.get(code);
      if (!session || session.adminId !== socket.id) return;

      session.currentTask = null;
      session.isVotingActive = false;
      session.isRevealed = false;

      // Reset votes for all users except those on break
      session.users.forEach((user) => {
        if (!user.isOnBreak) {
          user.vote = null;
          user.hasVoted = false;
        }
      });

      io.to(code).emit('session:state', session);

      console.log(`Admin cleared task in session ${code}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      const code = socketToSession.get(socket.id);
      if (!code) return;

      const session = sessions.get(code);
      if (!session) return;

      // If admin disconnects, end the session
      if (session.adminId === socket.id) {
        io.to(code).emit('session:ended');
        sessions.delete(code);
        
        // Clean up all socket mappings for this session
        session.users.forEach((user) => {
          socketToSession.delete(user.id);
        });
        
        console.log(`Admin left, session ${code} ended`);
      } else {
        // Regular user disconnects - remove them from session
        const userIndex = session.users.findIndex((u) => u.id === socket.id);
        if (userIndex !== -1) {
          const user = session.users[userIndex];
          session.users.splice(userIndex, 1);
          io.to(code).emit('user:left', socket.id);
          io.to(code).emit('session:state', session);
          
          console.log(`User ${user.name} left session ${code}`);
        }
      }

      socketToSession.delete(socket.id);
    });
  });
}
