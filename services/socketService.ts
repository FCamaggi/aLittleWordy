import { io, Socket } from 'socket.io-client';
import { GameState, Card, PlayerState } from './types';

export interface ServerToClientEvents {
  joined_room: (data: { room: any; playerId: string }) => void;
  player_joined: (data: { playerId: string }) => void;
  player_ready_updated: (data: { playerId: string; ready: boolean }) => void;
  game_starting: () => void;
  word_submitted: (data: { playerId: string }) => void;
  game_started: (data: { room: any }) => void;
  card_used: (data: { room: any }) => void;
  guess_made: (data: { room: any; correct: boolean; victory?: boolean; scenario2?: boolean }) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  join_room: (data: { roomCode: string; playerName: string }) => void;
  player_ready: (data: { roomCode: string }) => void;
  submit_word: (data: { roomCode: string; word: string }) => void;
  use_card: (data: { roomCode: string; cardIndex: number }) => void;
  guess_word: (data: { roomCode: string; word: string }) => void;
}

class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private serverUrl: string;

  constructor() {
    // Use environment variable or detect based on hostname
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const prodUrl = 'https://alittlewordy-server.onrender.com';
    const devUrl = 'http://localhost:5000';
    
    this.serverUrl = import.meta.env.VITE_SOCKET_URL || (isDev ? devUrl : prodUrl);
    console.log('🔌 Socket URL:', this.serverUrl, '| Dev mode:', isDev);
  }

  connect(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.socket) {
      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado al servidor:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Desconectado del servidor:', reason);
      });

      this.socket.on('error', (message) => {
        console.error('⚠️ Error del servidor:', message);
      });
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    return this.socket;
  }

  // Room Management
  async createRoom(playerName: string): Promise<{ roomCode: string; room?: any }> {
    const response = await fetch(`${this.serverUrl}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      throw new Error('Error al crear sala');
    }

    return response.json();
  }

  async getRoom(roomCode: string): Promise<any> {
    const response = await fetch(`${this.serverUrl}/api/rooms/${roomCode}`);

    if (!response.ok) {
      throw new Error('Sala no encontrada');
    }

    return response.json();
  }

  async joinRoom(roomCode: string, playerName: string): Promise<void> {
    const response = await fetch(`${this.serverUrl}/api/rooms/${roomCode}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Join room failed:', error);
      throw new Error(error.error || error.message || 'Error al unirse a sala');
    }
  }

  // Game Actions
  joinRoomSocket(roomCode: string, playerName: string) {
    if (!this.socket || !this.socket.connected) {
      console.error('Socket not connected');
      return;
    }
    console.log('Emitting join_room:', { roomCode, playerName });
    this.socket.emit('join_room', { roomCode, playerName });
  }

  setReady(roomCode: string) {
    this.socket?.emit('player_ready', { roomCode });
  }

  submitWord(roomCode: string, word: string) {
    this.socket?.emit('submit_word', { roomCode, word });
  }

  useCard(roomCode: string, cardIndex: number) {
    this.socket?.emit('use_card', { roomCode, cardIndex });
  }

  guessWord(roomCode: string, word: string) {
    this.socket?.emit('guess_word', { roomCode, word });
  }
}

export const socketService = new SocketService();
