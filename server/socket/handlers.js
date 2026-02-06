import Room from '../models/Room.js';
import { generateTiles, generateDeck, shuffleArray } from '../utils/helpers.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join room
    socket.on('join_room', async (data) => {
      try {
        const { roomCode, playerName } = data || {};

        if (!roomCode || !playerName) {
          console.error('Missing roomCode or playerName:', data);
          socket.emit('error', { message: 'Missing roomCode or playerName' });
          return;
        }

        const room = await Room.findOne({ code: roomCode.toUpperCase() });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Find player index
        const playerIndex = room.players.findIndex(p => p.name === playerName);

        if (playerIndex === -1) {
          socket.emit('error', { message: 'Player not found in room' });
          return;
        }

        // Update socket ID
        room.players[playerIndex].socketId = socket.id;
        await room.save();

        // CRITICAL: Join socket room FIRST
        socket.join(room.code);
        
        console.log(`✅ ${playerName} joined room ${roomCode}`);

        // THEN notify player (must be after join)
        socket.emit('joined_room', { room, playerId: playerName });

        // THEN notify other players in room
        socket.to(room.code).emit('player_joined', {
          room,
          playerName
        });
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: error.message || 'Failed to join room' });
      }
    });

    // Player ready
    socket.on('player_ready', async (data) => {
      try {
        const { roomCode } = data || {};

        if (!roomCode) {
          socket.emit('error', { message: 'Missing roomCode' });
          return;
        }

        const room = await Room.findOne({ code: roomCode.toUpperCase() });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Find player by socket ID
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);

        if (playerIndex === -1) {
          socket.emit('error', { message: 'Player not found in room' });
          return;
        }

        // Generate tiles for this player if not already done
        if (!room.players[playerIndex].originalTiles || room.players[playerIndex].originalTiles.length === 0) {
          const tiles = generateTiles();
          room.players[playerIndex].originalTiles = tiles;
        }

        room.players[playerIndex].isReady = true;
        await room.save();

        // Notify all players in room
        io.to(room.code).emit('player_ready_updated', { room });

        // Check if both players are ready
        if (room.players.length === 2 && room.players.every(p => p.isReady)) {
          // Start game setup phase
          room.gameState.phase = 'SETUP';
          await room.save();

          io.to(room.code).emit('game_starting', { room });
        }

        console.log(`✅ Player ${playerIndex} ready in room ${roomCode}`);
      } catch (error) {
        console.error('Error marking player ready:', error);
        console.error('Error stack:', error.stack);
        socket.emit('error', { message: 'Failed to mark ready' });
      }
    });

    // Submit secret word
    socket.on('submit_word', async (data) => {
      try {
        const { roomCode, word } = data || {};

        console.log('submit_word received:', { roomCode, word: word ? '***' : undefined });

        if (!roomCode || !word) {
          console.error('Missing roomCode or word:', data);
          socket.emit('error', { message: 'Missing roomCode or word' });
          return;
        }

        const room = await Room.findOne({ code: roomCode.toUpperCase() });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Find player by socket ID
        const playerIndex = room.players.findIndex(p => p.socketId === socket.id);

        if (playerIndex === -1) {
          socket.emit('error', { message: 'Player not found in room' });
          return;
        }

        room.players[playerIndex].secretWord = word.toUpperCase();
        await room.save();

        console.log(`✅ Player ${playerIndex} (${room.players[playerIndex].name}) submitted word in room ${roomCode}`);

        // Notify room
        io.to(room.code).emit('word_submitted', { room, playerIndex });

        // Check if both players submitted
        const bothSubmitted = room.players.every(p => p.secretWord);
        console.log(`Both players submitted: ${bothSubmitted}`, room.players.map(p => ({ name: p.name, hasWord: !!p.secretWord })));

        if (bothSubmitted) {
          console.log('Both players submitted, starting game...');

          // Swap tiles
          const p1Tiles = shuffleArray([...room.players[0].originalTiles]);
          const p2Tiles = shuffleArray([...room.players[1].originalTiles]);

          room.players[0].tiles = p2Tiles;
          room.players[1].tiles = p1Tiles;

          // Generate deck
          room.gameState.activeCards = generateDeck();
          room.gameState.phase = 'GAME_LOOP';
          room.gameState.turn = room.players[0].socketId;
          room.gameState.history = ['¡Intercambio realizado! Comienza el juego.'];

          await room.save();

          console.log(`✅ Game started in room ${roomCode}, emitting to all players in room`);
          io.to(room.code).emit('game_started', { room });
        }
      } catch (error) {
        console.error('Error submitting word:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          data: data
        });
        socket.emit('error', { message: error.message || 'Failed to submit word' });
      }
    });

    // Use card
    socket.on('use_card', async ({ roomCode, playerIndex, cardId, input }) => {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const currentPlayer = room.players[playerIndex];
        const opponentIndex = playerIndex === 0 ? 1 : 0;
        const opponent = room.players[opponentIndex];

        // Find card
        const card = room.gameState.activeCards.find(c => c.id === cardId);
        if (!card) {
          socket.emit('error', { message: 'Card not found' });
          return;
        }

        // Process card logic (simplified - you'll expand this)
        let cost = typeof card.cost === 'number' ? card.cost : 0;
        let result = '';

        // Add tokens to opponent
        opponent.tokens += cost;

        // Switch turn
        room.gameState.turn = playerIndex === 0 ? 'player2' : 'player1';
        room.gameState.history.unshift(`${currentPlayer.name} usó ${card.name}`);

        await room.save();

        io.to(roomCode.toUpperCase()).emit('card_used', { room, result });
      } catch (error) {
        console.error('Error using card:', error);
        socket.emit('error', { message: 'Failed to use card' });
      }
    });

    // Guess word
    socket.on('guess_word', async ({ roomCode, playerIndex, guess }) => {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        const currentPlayer = room.players[playerIndex];
        const opponentIndex = playerIndex === 0 ? 1 : 0;
        const opponent = room.players[opponentIndex];

        const isCorrect = guess.toUpperCase() === opponent.secretWord;

        if (isCorrect) {
          currentPlayer.hasGuessedCorrectly = true;

          // Check victory
          if (currentPlayer.tokens > opponent.tokens) {
            room.gameState.phase = 'GAME_OVER';
            room.gameState.winner = currentPlayer.name;
            room.gameState.winReason = '¡Adivinó y tenía más tokens!';
          } else {
            room.gameState.waitingForOpponentGuess = true;
            room.gameState.history.unshift(`${currentPlayer.name} adivinó correctamente`);
          }
        } else {
          opponent.tokens += 2;
          room.gameState.turn = playerIndex === 0 ? 'player2' : 'player1';
          room.gameState.history.unshift(`${currentPlayer.name} falló al adivinar`);
        }

        await room.save();

        io.to(roomCode.toUpperCase()).emit('guess_made', { room, isCorrect });
      } catch (error) {
        console.error('Error guessing word:', error);
        socket.emit('error', { message: 'Failed to guess word' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
}
