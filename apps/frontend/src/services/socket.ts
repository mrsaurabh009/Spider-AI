import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import { addMessage, setTypingIndicator } from '@/store/slices/chatSlice';
import { updateFileContent } from '@/store/slices/editorSlice';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token?: string): void {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    this.socket = io(serverUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Chat events
    this.socket.on('message', (data) => {
      store.dispatch(addMessage({
        role: 'assistant',
        content: data.message,
        timestamp: data.timestamp,
        generatedCode: data.generatedCode,
      }));
    });

    this.socket.on('typing', (data) => {
      store.dispatch(setTypingIndicator(data.isTyping));
    });

    // Code collaboration events
    this.socket.on('file_updated', (data) => {
      store.dispatch(updateFileContent({
        fileId: data.fileId,
        content: data.content,
      }));
    });

    this.socket.on('user_joined_project', (data) => {
      console.log('User joined project:', data.userId);
      // Could show a notification here
    });

    this.socket.on('user_left_project', (data) => {
      console.log('User left project:', data.userId);
      // Could show a notification here
    });

    // AI generation progress events
    this.socket.on('generation_progress', (data) => {
      console.log('Generation progress:', data.progress, data.stage);
      // Could update UI to show progress
    });

    this.socket.on('generation_complete', (data) => {
      console.log('Generation complete:', data);
      store.dispatch(addMessage({
        role: 'assistant',
        content: 'Code generation completed!',
        timestamp: data.timestamp,
        generatedCode: data.generatedCode,
      }));
    });

    this.socket.on('generation_error', (data) => {
      console.error('Generation error:', data.error);
      store.dispatch(addMessage({
        role: 'assistant',
        content: `Sorry, there was an error generating your code: ${data.error}`,
        timestamp: new Date().toISOString(),
      }));
    });
  }

  // Project collaboration methods
  joinProject(projectId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join_project', { projectId });
    }
  }

  leaveProject(projectId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_project', { projectId });
    }
  }

  // Real-time code editing
  updateFile(projectId: string, fileId: string, content: string): void {
    if (this.socket?.connected) {
      this.socket.emit('update_file', {
        projectId,
        fileId,
        content,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Chat methods
  sendMessage(projectId: string, message: string): void {
    if (this.socket?.connected) {
      this.socket.emit('send_message', {
        projectId,
        message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  setTyping(projectId: string, isTyping: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', {
        projectId,
        isTyping,
      });
    }
  }

  // AI generation methods
  generateCode(projectId: string, prompt: string, options: any): void {
    if (this.socket?.connected) {
      this.socket.emit('generate_code', {
        projectId,
        prompt,
        options,
        timestamp: new Date().toISOString(),
      });
    }
  }

  refineCode(projectId: string, fileId: string, instructions: string): void {
    if (this.socket?.connected) {
      this.socket.emit('refine_code', {
        projectId,
        fileId,
        instructions,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
export const socketService = new SocketService();
export default socketService;
