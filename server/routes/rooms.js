import express from 'express';
import Room from '../models/Room.js';
import { generateRoomCode } from '../utils/helpers.js';

const router = express.Router();

// GET /api/rooms/:code - Get room by code
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const room = await Room.findOne({ code: code.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// POST /api/rooms - Create new room
router.post('/', async (req, res) => {
  try {
    const { playerName } = req.body;
    
    if (!playerName || playerName.trim().length === 0) {
      return res.status(400).json({ error: 'Player name is required' });
    }
    
    // Generate unique room code
    let code;
    let attempts = 0;
    let room;
    
    do {
      code = generateRoomCode();
      room = await Room.findOne({ code });
      attempts++;
      
      if (attempts > 10) {
        return res.status(500).json({ error: 'Failed to generate unique room code' });
      }
    } while (room);
    
    // Create new room
    const newRoom = new Room({
      code,
      players: [{
        name: playerName.trim(),
        isReady: false,
        tiles: [],
        secretWord: '',
        originalTiles: [],
        tokens: 0,
        guesses: [],
        hasGuessedCorrectly: false,
        revealedLetters: [],
        revealedPositions: []
      }],
      gameState: {
        phase: 'LOBBY',
        turn: 'player1',
        activeCards: [],
        history: [],
        winner: null,
        winReason: null,
        waitingForOpponentGuess: false
      }
    });
    
    await newRoom.save();
    
    res.status(201).json({ roomCode: newRoom.code, room: newRoom });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// POST /api/rooms/:code/join - Join existing room
router.post('/:code/join', async (req, res) => {
  try {
    const { code } = req.params;
    const { playerName } = req.body;
    
    if (!playerName || playerName.trim().length === 0) {
      return res.status(400).json({ error: 'Player name is required' });
    }
    
    const room = await Room.findOne({ code: code.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (room.players.length >= 2) {
      return res.status(400).json({ error: 'Room is full' });
    }
    
    if (room.gameState.phase !== 'LOBBY') {
      return res.status(400).json({ error: 'Game already started' });
    }
    
    // Add player to room
    room.players.push({
      name: playerName.trim(),
      isReady: false,
      tiles: [],
      secretWord: '',
      originalTiles: [],
      tokens: 0,
      guesses: [],
      hasGuessedCorrectly: false,
      revealedLetters: [],
      revealedPositions: []
    });
    
    await room.save();
    
    res.json(room);
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// DELETE /api/rooms/:code - Delete room (for cleanup)
router.delete('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const room = await Room.findOneAndDelete({ code: code.toUpperCase() });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
});

export default router;
