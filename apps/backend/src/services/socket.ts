import { Server as SocketIOServer } from 'socket.io';
import { logger } from '@/utils/logger';

export function initializeSocketIO(io: SocketIOServer): void {
  logger.info('🔌 Initializing Socket.IO...');

  io.on('connection', (socket) => {
    logger.info(`🔌 Client connected: ${socket.id}`);

    // Join room for project collaboration
    socket.on('join-project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      logger.info(`Client ${socket.id} joined project: ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      logger.info(`Client ${socket.id} left project: ${projectId}`);
    });

    // Handle code generation progress updates
    socket.on('code-generation-progress', (data) => {
      // Broadcast to project room
      socket.to(`project:${data.projectId}`).emit('generation-progress', data);
    });

    // Handle real-time code updates
    socket.on('code-update', (data) => {
      socket.to(`project:${data.projectId}`).emit('code-updated', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`🔌 Client disconnected: ${socket.id}`);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to Spider AI',
      socketId: socket.id
    });
  });

  logger.info('✅ Socket.IO initialized successfully');
}
