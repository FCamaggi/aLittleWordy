import React, { useState, useEffect } from 'react';
import { Play, Users, BookOpen, Crown, CheckCircle, ArrowRight, X, History, RefreshCw, ChevronLeft } from 'lucide-react';
import { GameState, GamePhase, Tile as TileType, Card as CardType } from './types';
import { CARDS } from './constants';
import { generateDeck, generateTiles, getBotWordAndTiles, scrambleTiles, getNewTile } from './services/gameLogic';
import { isValidWord, getValidationMessage } from './services/dictionary';
import { socketService } from './services/socketService';
import { Button } from './components/Button';
import { Tile } from './components/Tile';
import { Card } from './components/Card';
import { ManualModal } from './components/ManualModal';
import { EventModal, EventModalProps } from './components/EventModal';
import { MainMenu } from './components/MainMenu';
import { Lobby } from './components/Lobby';

const INITIAL_STATE: GameState = {
  phase: GamePhase.MENU,
  roomCode: null,
  turn: 'player',
  player: {
    name: 'Jugador',
    isBot: false,
    tiles: [],
    secretWord: '',
    originalTiles: [],
    tokens: 0,
    guesses: [],
    hasGuessedCorrectly: false,
    revealedLetters: [],
    revealedPositions: [],
  },
  opponent: {
    name: 'Bot',
    isBot: true,
    tiles: [],
    secretWord: '',
    originalTiles: [],
    tokens: 0,
    guesses: [],
    hasGuessedCorrectly: false,
    revealedLetters: [],
    revealedPositions: [],
  },
  activeCards: [],
  history: [],
  winner: null,
  winReason: null,
  waitingForOpponentGuess: false,
};

export default function App() {
  const [game, setGame] = useState<GameState>(INITIAL_STATE);
  const [manualOpen, setManualOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Multiplayer State
  const [isConnected, setIsConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<Array<{ name: string; ready: boolean }>>([]);
  const [localPlayerReady, setLocalPlayerReady] = useState(false);
  
  // Setup State
  const [setupWord, setSetupWord] = useState('');
  const [setupTiles, setSetupTiles] = useState<TileType[]>([]);
  const [swapsRemaining, setSwapsRemaining] = useState(2);
  const [isSwapping, setIsSwapping] = useState(false);
  const [selectedSwapTiles, setSelectedSwapTiles] = useState<string[]>([]);
  
  // Event Modal State
  const [eventModal, setEventModal] = useState<Partial<EventModalProps>>({ isOpen: false });

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);

  // --- Socket.io Setup ---

  useEffect(() => {
    const socket = socketService.connect();
    setIsConnected(true);

    // Joined room event
    socket.on('joined_room', (data) => {
      setPlayerId(data.playerId);
      const room = data.room;
      
      setGame(prev => ({
        ...prev,
        phase: GamePhase.LOBBY,
        roomCode: room.code,
        player: {
          ...prev.player,
          name: room.players.find((p: any) => p.socketId === socket.id)?.name || prev.player.name
        }
      }));

      updatePlayersFromRoom(room);
    });

    // Player joined
    socket.on('player_joined', (data) => {
      showNotification('¡Un jugador se ha unido!');
      // Refetch room data
      if (game.roomCode) {
        socketService.getRoom(game.roomCode).then(room => {
          updatePlayersFromRoom(room);
        });
      }
    });

    // Player ready updated
    socket.on('player_ready_updated', (data) => {
      // Room will be updated, refetch or update local state
    });

    // Game starting (both players ready)
    socket.on('game_starting', () => {
      setGame(prev => ({ ...prev, phase: GamePhase.SETUP }));
      const tiles = generateTiles();
      setSetupTiles(tiles);
      setSetupWord('');
      setSwapsRemaining(2);
    });

    // Word submitted
    socket.on('word_submitted', (data) => {
      showNotification('Palabra enviada');
    });

    // Game started (both words submitted, game begins)
    socket.on('game_started', (data) => {
      const room = data.room;
      updateGameStateFromRoom(room);
    });

    // Card used
    socket.on('card_used', (data) => {
      const room = data.room;
      updateGameStateFromRoom(room);
    });

    // Guess made
    socket.on('guess_made', (data) => {
      const room = data.room;
      updateGameStateFromRoom(room);
      
      if (data.victory) {
        // Handle victory
      }
      if (data.scenario2) {
        // Handle scenario 2
      }
    });

    // Error
    socket.on('error', (message) => {
      showNotification(`Error: ${message}`);
    });

    return () => {
      socketService.disconnect();
      setIsConnected(false);
    };
  }, []);

  const updatePlayersFromRoom = (room: any) => {
    const playerList = room.players.map((p: any) => ({
      name: p.name,
      ready: p.ready
    }));
    setPlayers(playerList);
    
    const socket = socketService.getSocket();
    const me = room.players.find((p: any) => p.socketId === socket?.id);
    if (me) {
      setLocalPlayerReady(me.ready);
      setIsHost(room.players[0].socketId === socket?.id);
    }
  };

  const updateGameStateFromRoom = (room: any) => {
    // Convert room data to game state
    const socket = socketService.getSocket();
    const myPlayerData = room.players.find((p: any) => p.socketId === socket?.id);
    const opponentData = room.players.find((p: any) => p.socketId !== socket?.id);

    if (!myPlayerData || !opponentData) return;

    setGame(prev => ({
      ...prev,
      phase: room.phase === 'GAME_LOOP' ? GamePhase.GAME_LOOP : prev.phase,
      turn: room.currentTurn === myPlayerData.socketId ? 'player' : 'opponent',
      player: {
        ...prev.player,
        name: myPlayerData.name,
        tiles: myPlayerData.tiles || prev.player.tiles,
        secretWord: myPlayerData.secretWord || '',
        tokens: myPlayerData.tokens || 0,
        guesses: myPlayerData.guesses || [],
        hasGuessedCorrectly: myPlayerData.hasGuessedCorrectly || false,
        revealedLetters: prev.player.revealedLetters,
        revealedPositions: prev.player.revealedPositions,
      },
      opponent: {
        ...prev.opponent,
        name: opponentData.name,
        tiles: opponentData.tiles || prev.opponent.tiles,
        tokens: opponentData.tokens || 0,
        guesses: opponentData.guesses || [],
        hasGuessedCorrectly: opponentData.hasGuessedCorrectly || false,
        revealedLetters: prev.opponent.revealedLetters,
        revealedPositions: prev.opponent.revealedPositions,
      },
      activeCards: room.deck || prev.activeCards,
    }));
  };

  // --- Effects ---

  // Bot Turn Logic (only for demo mode with bot)
  useEffect(() => {
    if (game.opponent.isBot && game.phase === GamePhase.GAME_LOOP && game.turn === 'opponent' && !game.winner && !game.waitingForOpponentGuess && !eventModal.isOpen) {
      const timer = setTimeout(() => {
        executeBotTurn();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [game.phase, game.turn, game.waitingForOpponentGuess, eventModal.isOpen]);

  // Scenario 2 Logic (only for bot demo)
  useEffect(() => {
    if (game.opponent.isBot && game.phase === GamePhase.GAME_LOOP && game.waitingForOpponentGuess && !game.winner && !eventModal.isOpen) {
      const timer = setTimeout(() => {
        executeBotTurn();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [game.waitingForOpponentGuess, game.history, eventModal.isOpen]);

  // --- Core Game Functions ---

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper function to check Scenario 2 victory after token changes
  const checkScenario2Victory = (currentState: GameState): GameState => {
    if (currentState.waitingForOpponentGuess && 
        currentState.player.tokens > currentState.opponent.tokens &&
        !currentState.winner) {
      return {
        ...currentState,
        winner: 'player',
        winReason: '¡Has superado los tokens del oponente! Victoria.',
        phase: GamePhase.GAME_OVER
      };
    }
    return currentState;
  };

  const handleCreateRoom = async (playerName: string) => {
    try {
      const { roomCode } = await socketService.createRoom(playerName);
      socketService.joinRoomSocket(roomCode, playerName);
      setIsHost(true);
    } catch (error) {
      showNotification('Error al crear sala');
      console.error(error);
    }
  };

  const handleJoinRoom = async (roomCode: string, playerName: string) => {
    try {
      await socketService.joinRoom(roomCode, playerName);
      socketService.joinRoomSocket(roomCode, playerName);
      setIsHost(false);
    } catch (error: any) {
      showNotification(error.message || 'Error al unirse a sala');
      console.error(error);
    }
  };

  const handlePlayerReady = () => {
    if (game.roomCode) {
      socketService.setReady(game.roomCode);
      setLocalPlayerReady(true);
    }
  };

  const handleLeaveRoom = () => {
    setGame(INITIAL_STATE);
    setPlayers([]);
    setLocalPlayerReady(false);
    setIsHost(false);
    socketService.disconnect();
    socketService.connect();
  };

  // Bot demo mode functions
  const createGame = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    const botData = getBotWordAndTiles();
    
    setGame({
      ...INITIAL_STATE,
      phase: GamePhase.LOBBY,
      roomCode: code,
      player: { ...INITIAL_STATE.player, name: 'Jugador' },
      opponent: {
        ...INITIAL_STATE.opponent,
        originalTiles: botData.tiles,
        secretWord: botData.word
      }
    });
  };

  const joinGame = () => {
    const botData = getBotWordAndTiles();
    const tiles = generateTiles();
    setSetupTiles(tiles);

    setGame({
      ...INITIAL_STATE,
      phase: GamePhase.SETUP,
      roomCode: 'DEMO',
      player: { ...INITIAL_STATE.player, name: playerName, originalTiles: tiles },
      opponent: {
        ...INITIAL_STATE.opponent,
        originalTiles: botData.tiles,
        secretWord: botData.word
      }
    });
  };

  const startSetup = () => {
    const tiles = generateTiles();
    setSetupTiles(tiles);
    setSwapsRemaining(2); // Reset swaps
    setGame(prev => ({
      ...prev,
      phase: GamePhase.SETUP,
      player: { ...prev.player, originalTiles: tiles }
    }));
  };

  const confirmSetupWord = () => {
    const validationError = getValidationMessage(setupWord);
    if (validationError) {
      showNotification(validationError);
      return;
    }
    
    const letters = setupWord.toUpperCase().split('');
    const available = [...setupTiles.map(t => t.letter)];
    let possible = true;
    for (const l of letters) {
      const idx = available.indexOf(l);
      if (idx === -1) {
        possible = false;
        break;
      }
      available.splice(idx, 1);
    }

    if (!possible) {
      showNotification("No puedes formar esa palabra con tus fichas.");
      return;
    }

    // Multiplayer mode: send word to server
    if (game.roomCode && !game.opponent.isBot) {
      socketService.submitWord(game.roomCode, setupWord.toUpperCase());
      showNotification('Palabra enviada. Esperando al oponente...');
      return;
    }

    // Bot demo mode: continue with local logic
    setGame(prev => ({
      ...prev,
      phase: GamePhase.GAME_LOOP,
      activeCards: generateDeck(),
      player: {
        ...prev.player,
        secretWord: setupWord.toUpperCase(),
        tiles: scrambleTiles(prev.opponent.originalTiles)
      },
      opponent: {
        ...prev.opponent,
        tiles: scrambleTiles(prev.player.originalTiles)
      },
      history: ["¡Intercambio realizado! Comienza el juego."]
    }));
  };

  // --- Setup Actions (Swapping) ---

  const toggleSwapMode = () => {
    if (isSwapping) {
      setIsSwapping(false);
      setSelectedSwapTiles([]);
    } else {
      if (swapsRemaining <= 0) {
        showNotification("No te quedan cambios.");
        return;
      }
      // Reset current word to avoid conflicts
      setSetupWord('');
      setIsSwapping(true);
      setSelectedSwapTiles([]);
    }
  };

  const handleTileClickInSetup = (tile: TileType) => {
    if (isSwapping) {
      // Toggle selection for swap
      if (selectedSwapTiles.includes(tile.id)) {
        setSelectedSwapTiles(prev => prev.filter(id => id !== tile.id));
      } else {
        if (selectedSwapTiles.length >= swapsRemaining) {
          showNotification(`Solo puedes cambiar ${swapsRemaining} ficha(s) más.`);
          return;
        }
        setSelectedSwapTiles(prev => [...prev, tile.id]);
      }
    } else {
      // Add to word
      setSetupWord(prev => prev + tile.letter);
    }
  };

  const confirmSwap = () => {
    if (selectedSwapTiles.length === 0) return;

    const newTiles = [...setupTiles];
    let swapsUsed = 0;

    selectedSwapTiles.forEach(id => {
      const index = newTiles.findIndex(t => t.id === id);
      if (index !== -1) {
        newTiles[index] = getNewTile(newTiles[index].type); // Replace with same type
        swapsUsed++;
      }
    });

    setSetupTiles(newTiles);
    setSwapsRemaining(prev => prev - swapsUsed);
    setIsSwapping(false);
    setSelectedSwapTiles([]);
    showNotification(`¡${swapsUsed} fichas cambiadas!`);
  };

  // --- Gameplay Actions ---

  const closeEventModal = () => {
    setEventModal({ isOpen: false });
  };

  const handleCardClick = (card: CardType) => {
    if (game.turn !== 'player' || game.waitingForOpponentGuess) return;
    
    // Cards that require input
    const needsInput = ['calimero', 'jose', 'yakky', 'scrooge', 'henery', 'heckle', 'scuttle', 'flit'].includes(card.id);
    
    // Cards that cannot be used if opponent already guessed
    const blockedIfOpponentGuessed = ['zazu', 'scuttle'];
    if (game.opponent.hasGuessedCorrectly && blockedIfOpponentGuessed.includes(card.id)) {
      showNotification("No puedes usar esta carta: el oponente ya adivinó tu palabra.");
      return;
    }
    
    if (needsInput) {
      setEventModal({
        isOpen: true,
        type: 'input',
        title: `Usar: ${card.name}`,
        message: card.description,
        availableTiles: game.player.tiles, // Pass player tiles to modal
        onConfirm: (val) => resolveCardAction(card, val),
        onClose: closeEventModal
      });
    } else {
      resolveCardAction(card);
    }
  };

  const resolveCardAction = (card: CardType, input?: string) => {
    closeEventModal(); // Close input modal if open

    // Multiplayer mode: send card action to server
    if (game.roomCode && !game.opponent.isBot) {
      const cardIndex = game.activeCards.findIndex(c => c.id === card.id);
      if (cardIndex !== -1) {
        socketService.useCard(game.roomCode, cardIndex);
        showNotification(`Usando ${card.name}...`);
      }
      return;
    }

    // Bot demo mode: continue with local logic
    let cost = typeof card.cost === 'number' ? card.cost : 0;
    let resultMessage = '';
    const opponentWord = game.opponent.secretWord;
    let updatedPlayerTiles = [...game.player.tiles];
    let newOpponentRevealedLetters = [...game.opponent.revealedLetters];
    let newOpponentRevealedPositions = [...game.opponent.revealedPositions];
    let newPlayerRevealedLetters = [...game.player.revealedLetters];

    switch (card.id) {
      // ===== VANILLA CARDS =====
      case 'woody': 
        const firstLetter = opponentWord[0];
        resultMessage = `La primera letra es: **${firstLetter}**`;
        if (!newOpponentRevealedLetters.includes(firstLetter)) {
          newOpponentRevealedLetters.push(firstLetter);
        }
        newOpponentRevealedPositions.push({ letter: firstLetter, position: 0 });
        break;
        
      case 'woodstock': 
        const lastLetter = opponentWord[opponentWord.length - 1];
        resultMessage = `La última letra es: **${lastLetter}**`;
        if (!newOpponentRevealedLetters.includes(lastLetter)) {
          newOpponentRevealedLetters.push(lastLetter);
        }
        newOpponentRevealedPositions.push({ letter: lastLetter, position: opponentWord.length - 1 });
        break;
        
      case 'calimero': 
        if (!input) return;
        const diff = input.length - opponentWord.length;
        if (diff > 0) resultMessage = "Tu palabra es más **Larga** que la secreta.";
        else if (diff < 0) resultMessage = "Tu palabra es más **Corta** que la secreta.";
        else resultMessage = "¡Tienen la **misma longitud**!";
        break;
        
      case 'chilly':
        resultMessage = `La palabra tiene **${opponentWord.length}** letras.`;
        break;
        
      case 'jose':
        if (!input || input.length !== 1) return;
        const letter = input.toUpperCase();
        const exists = opponentWord.includes(letter);
        resultMessage = exists 
            ? `¡SÍ! La letra **"${letter}"** ESTÁ en la palabra.` 
            : `NO. La letra **"${letter}"** NO está en la palabra.`;
        if (exists && !newOpponentRevealedLetters.includes(letter)) {
          newOpponentRevealedLetters.push(letter);
        }
        break;
        
      case 'yakky':
        if (!input) return;
        const inputWord = input.toUpperCase();
        const badLetters = inputWord.split('').filter(char => !opponentWord.includes(char));
        // Disable tiles with bad letters
        updatedPlayerTiles = updatedPlayerTiles.map(tile => {
          if (inputWord.includes(tile.letter) && badLetters.includes(tile.letter)) {
            return { ...tile, disabled: true };
          }
          return tile;
        });
        resultMessage = badLetters.length > 0 
          ? `Letras **ELIMINADAS**: **${[...new Set(badLetters)].join(', ')}**` 
          : "¡Todas esas letras están en la palabra!";
        break;

      // ===== SPICY CARDS =====
      case 'foghorn': 
        const vowels = 'AEIOU';
        const unrevealedVowels = opponentWord.split('')
          .filter((c, i) => vowels.includes(c) && !newOpponentRevealedPositions.some(rp => rp.position === i));
        if (unrevealedVowels.length > 0) {
          const revealedVowel = unrevealedVowels[0];
          const position = opponentWord.indexOf(revealedVowel);
          resultMessage = `Hay una vocal: **${revealedVowel}** (posición ${position + 1})`;
          if (!newOpponentRevealedLetters.includes(revealedVowel)) {
            newOpponentRevealedLetters.push(revealedVowel);
          }
          newOpponentRevealedPositions.push({ letter: revealedVowel, position });
        } else {
          resultMessage = "No hay más vocales sin revelar.";
        }
        break;
        
      case 'beaky': 
        const vCount = opponentWord.split('').filter(c => 'AEIOU'.includes(c)).length;
        resultMessage = `Tiene **${vCount}** vocales.`;
        break;
        
      case 'daffy': 
        const cCount = opponentWord.split('').filter(c => !'AEIOU'.includes(c)).length;
        resultMessage = `Tiene **${cCount}** consonantes.`;
        break;
        
      case 'henery':
        if (!input || input.length !== 1) return;
        const letterH = input.toUpperCase();
        const existsH = opponentWord.includes(letterH);
        if (existsH) {
          const position = opponentWord.indexOf(letterH);
          resultMessage = `¡SÍ! La letra **"${letterH}"** está en la posición **${position + 1}**`;
          if (!newOpponentRevealedLetters.includes(letterH)) {
            newOpponentRevealedLetters.push(letterH);
          }
          newOpponentRevealedPositions.push({ letter: letterH, position });
        } else {
          resultMessage = `NO. La letra **"${letterH}"** NO está en la palabra.`;
        }
        break;
        
      case 'zazu':
        // Reveal one letter from each player's word
        const playerUnrevealed = game.player.secretWord.split('')
          .filter(c => !newPlayerRevealedLetters.includes(c));
        const opponentUnrevealed = opponentWord.split('')
          .filter(c => !newOpponentRevealedLetters.includes(c));
        
        if (playerUnrevealed.length > 0 && opponentUnrevealed.length > 0) {
          const playerReveal = playerUnrevealed[0];
          const opponentReveal = opponentUnrevealed[0];
          newPlayerRevealedLetters.push(playerReveal);
          newOpponentRevealedLetters.push(opponentReveal);
          resultMessage = `Tú revelaste: **${playerReveal}**. Bot reveló: **${opponentReveal}**`;
        } else {
          resultMessage = "No hay más letras sin revelar.";
        }
        break;
        
      case 'heckle':
        if (!input || input.length !== 1) return;
        const letterHJ = input.toUpperCase();
        const playerCount = game.player.tiles.filter(t => t.letter === letterHJ && !t.disabled).length;
        if (playerCount < 2) {
          showNotification("Debes elegir una letra que tengas al menos 2 veces.");
          return;
        }
        const opponentCount = opponentWord.split('').filter(c => c === letterHJ).length;
        resultMessage = `La letra **"${letterHJ}"** aparece **${opponentCount}** vez/veces en la palabra.`;
        if (opponentCount > 0 && !newOpponentRevealedLetters.includes(letterHJ)) {
          newOpponentRevealedLetters.push(letterHJ);
        }
        break;
        
      case 'scuttle':
        if (!input || input.length !== 1) return;
        const letterS = input.toUpperCase();
        const inPlayerTiles = game.player.tiles.some(t => t.letter === letterS && !t.disabled);
        const inOpponentTiles = game.opponent.tiles.some(t => t.letter === letterS);
        if (!inPlayerTiles || !inOpponentTiles) {
          showNotification("Debes elegir una letra presente en ambos conjuntos.");
          return;
        }
        const playerWordCount = game.player.secretWord.split('').filter(c => c === letterS).length;
        const opponentWordCount = opponentWord.split('').filter(c => c === letterS).length;
        resultMessage = `**"${letterS}"**: Tú tienes **${playerWordCount}**, Bot tiene **${opponentWordCount}**`;
        if (opponentWordCount > 0 && !newOpponentRevealedLetters.includes(letterS)) {
          newOpponentRevealedLetters.push(letterS);
        }
        break;
        
      case 'scrooge':
        if (!input) return;
        const inputWordScrooge = input.toUpperCase();
        const goodLetters = inputWordScrooge.split('').filter(char => opponentWord.includes(char));
        const badLettersScrooge = inputWordScrooge.split('').filter(char => !opponentWord.includes(char));
        
        // Disable tiles with bad letters
        updatedPlayerTiles = updatedPlayerTiles.map(tile => {
          if (inputWordScrooge.includes(tile.letter) && badLettersScrooge.includes(tile.letter)) {
            return { ...tile, disabled: true };
          }
          return tile;
        });
        
        // Cost is number of letters that remain (good letters)
        cost = [...new Set(goodLetters)].length;
        resultMessage = badLettersScrooge.length > 0 
          ? `Letras **ELIMINADAS**: **${[...new Set(badLettersScrooge)].join(', ')}**. Coste: **${cost}** tokens` 
          : `¡Todas las letras están! Coste: **${cost}** tokens`;
        break;
        
      case 'flit':
        if (!input || input.length !== 1) return;
        const rareLetter = input.toUpperCase();
        if (!['Z', 'J', 'Q', 'X', 'K'].includes(rareLetter)) {
          showNotification("Debes elegir una de estas letras: Z, J, Q, X, K");
          return;
        }
        const existsRare = opponentWord.includes(rareLetter);
        resultMessage = existsRare 
            ? `¡SÍ! La letra **"${rareLetter}"** ESTÁ en la palabra.` 
            : `NO. La letra **"${rareLetter}"** NO está en la palabra.`;
        if (existsRare && !newOpponentRevealedLetters.includes(rareLetter)) {
          newOpponentRevealedLetters.push(rareLetter);
        }
        break;
        
      case 'iago':
        // Bot provides a rhyming word (simplified: just provide a word)
        const rhyme = "PALABRA"; // In a real implementation, you'd find an actual rhyme
        resultMessage = `Bot dice que rima con: **${rhyme}**`;
        break;
        
      default:
        resultMessage = "Pista revelada.";
    }

    setGame(prev => {
      const newState = {
        ...prev,
        player: { 
          ...prev.player, 
          tiles: updatedPlayerTiles,
          revealedLetters: newPlayerRevealedLetters 
        },
        opponent: { 
          ...prev.opponent, 
          tokens: prev.opponent.tokens + cost,
          revealedLetters: newOpponentRevealedLetters,
          revealedPositions: newOpponentRevealedPositions
        },
        history: [`Usaste ${card.name} (${cost} tokens).`, `Respuesta: ${resultMessage.replace(/\*\*/g, '')}`, ...prev.history],
        turn: 'opponent'
      };
      return checkScenario2Victory(newState);
    });

    // Show Result Modal
    setTimeout(() => {
        setEventModal({
            isOpen: true,
            type: 'info',
            title: `Resultado: ${card.name}`,
            message: <span dangerouslySetInnerHTML={{__html: resultMessage.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700 text-xl">$1</strong>')}} />,
            onClose: closeEventModal
        });
    }, 300);
  };

  const handleGuessClick = () => {
      setEventModal({
          isOpen: true,
          type: 'input',
          title: 'Adivinar Palabra',
          message: 'Usa tus fichas para formar la palabra. Si fallas, el oponente gana 2 tokens.',
          availableTiles: game.player.tiles, // Pass player tiles
          confirmText: '¡Adivinar!',
          onConfirm: (val) => { closeEventModal(); handleGuessLogic(val); },
          onClose: closeEventModal
      });
  };

  const handleGuessLogic = (word: string) => {
    // Validate word first
    const validationError = getValidationMessage(word);
    if (validationError) {
      showNotification(validationError);
      setEventModal({
        isOpen: true,
        type: 'error',
        title: 'Palabra Inválida',
        message: validationError,
        onClose: closeEventModal
      });
      return;
    }
    
    // Multiplayer mode: send guess to server
    if (game.roomCode && !game.opponent.isBot) {
      socketService.guessWord(game.roomCode, word.toUpperCase());
      showNotification('Intento enviado...');
      return;
    }

    // Bot demo mode: continue with local logic
    const isCorrect = word.toUpperCase() === game.opponent.secretWord;
    
    if (isCorrect) {
      const playerMoreTokens = game.player.tokens > game.opponent.tokens;
      
      if (playerMoreTokens) {
        setGame(prev => ({
          ...prev,
          winner: 'player',
          winReason: '¡Adivinaste correctamente y tenías más tokens!',
          phase: GamePhase.GAME_OVER
        }));
      } else {
        setEventModal({
            isOpen: true,
            type: 'success',
            title: '¡Adivinaste!',
            message: 'Has acertado la palabra, pero no tienes suficientes tokens para ganar todavía. El oponente seguirá jugando (gastando tokens) hasta que le superes o él adivine tu palabra.',
            onClose: closeEventModal
        });
        setGame(prev => ({
          ...prev,
          player: { ...prev.player, hasGuessedCorrectly: true },
          waitingForOpponentGuess: true,
          history: ["¡Adivinaste! Esperando a superar tokens...", ...prev.history]
        }));
      }
    } else {
      setEventModal({
          isOpen: true,
          type: 'error',
          title: 'Incorrecto',
          message: `La palabra no es "${word}". Tu oponente gana 2 tokens.`,
          onClose: closeEventModal
      });
      setGame(prev => {
        const newState = {
          ...prev,
          opponent: { ...prev.opponent, tokens: prev.opponent.tokens + 2 },
          history: [`Intentaste "${word}" y fallaste.`, ...prev.history],
          turn: 'opponent'
        };
        return checkScenario2Victory(newState);
      });
    }
  };

  const executeBotTurn = () => {
    setGame(prev => {
      const turnCount = prev.history.length;
      const shouldGuess = Math.random() < (0.05 + (turnCount * 0.02)); 
      
      let nextState = { ...prev };
      let modalData: Partial<EventModalProps> | null = null;

      if (shouldGuess) {
        const correctGuess = Math.random() < 0.5; // Simplified bot logic
        if (correctGuess || turnCount > 25) {
           const botMoreTokens = prev.opponent.tokens > prev.player.tokens;
           if (prev.waitingForOpponentGuess || botMoreTokens) {
             return {
               ...prev,
               winner: 'opponent',
               winReason: 'El oponente adivinó y tenía más tokens.',
               phase: GamePhase.GAME_OVER
             };
           } else {
             // Bot correct but less tokens. 
             return {
                 ...prev,
                 winner: 'player',
                 winReason: 'El bot adivinó, ¡pero tú tenías más tokens!',
                 phase: GamePhase.GAME_OVER
             };
           }
        } else {
          // Bot Wrong - player gains 2 tokens
          nextState = {
            ...prev,
            player: { ...prev.player, tokens: prev.player.tokens + 2 },
            history: [`Bot falló al adivinar. Ganas 2 tokens.`, ...prev.history],
            turn: prev.waitingForOpponentGuess ? 'opponent' : 'player'
          };
          modalData = {
              type: 'info',
              title: 'Turno del Bot',
              message: 'El Bot intentó adivinar tu palabra y... ¡FALLÓ! Ganas 2 tokens.'
          };
          // Check scenario 2 victory after gaining tokens
          nextState = checkScenario2Victory(nextState);
        }
      } else {
        // Bot uses card - player gains tokens
        const card = prev.activeCards[Math.floor(Math.random() * prev.activeCards.length)];
        const cost = typeof card.cost === 'number' ? card.cost : 2;
        
        nextState = {
          ...prev,
          player: { ...prev.player, tokens: prev.player.tokens + cost },
          history: [`Bot usó ${card.name}. Ganaste ${cost} tokens.`, ...prev.history],
          turn: prev.waitingForOpponentGuess ? 'opponent' : 'player'
        };
        modalData = {
            type: 'bot_action',
            title: 'Turno del Bot',
            message: <div>El Bot usó la carta <strong>{card.name}</strong>.<br/><br/>¡Has ganado <strong className="text-green-600 text-xl">+{cost}</strong> tokens!</div>
        };
        // Check scenario 2 victory after gaining tokens
        nextState = checkScenario2Victory(nextState);
      }

      if (modalData && !nextState.winner) {
          // Use setTimeout to allow state update to process then show modal
          setTimeout(() => setEventModal({ ...modalData, isOpen: true, onClose: closeEventModal }), 100);
      }
      return nextState;
    });
  };

  // --- Render Helpers ---

  const renderLobby = () => {
    if (game.phase === GamePhase.MENU) {
      return (
        <>
          <MainMenu 
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
          <ManualModal isOpen={manualOpen} onClose={() => setManualOpen(false)} />
        </>
      );
    }
    
    if (game.phase === GamePhase.LOBBY) {
      return (
        <Lobby
          roomCode={game.roomCode || ''}
          players={players}
          isHost={isHost}
          localPlayerReady={localPlayerReady}
          onReady={handlePlayerReady}
          onLeave={handleLeaveRoom}
        />
      );
    }
    
    return null;
  };

  const renderSetup = () => (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg border border-slate-200 space-y-6 relative overflow-hidden transition-all duration-300">
           
           {/* Top Header */}
           <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-900">
                {isSwapping ? 'Cambiar Fichas' : 'Crea tu Palabra'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isSwapping 
                  ? `Selecciona hasta 2 fichas para reemplazar por nuevas (${swapsRemaining} restantes).` 
                  : 'Usa tus fichas para formar la palabra secreta.'}
              </p>
           </div>

           {/* Tile Pool */}
           <div className={`
             flex flex-wrap justify-center gap-2 p-4 rounded-xl border-2 transition-colors duration-300
             ${isSwapping ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}
           `}>
             {setupTiles.map(tile => (
               <Tile 
                  key={tile.id} 
                  tile={tile} 
                  small 
                  selected={isSwapping && selectedSwapTiles.includes(tile.id)}
                  onClick={() => handleTileClickInSetup(tile)}
                  disabled={!isSwapping && setupWord.split('').filter(l => l === tile.letter).length >= setupTiles.filter(t => t.letter === tile.letter).length}
                  highlight={isSwapping} // Visual cue
               />
             ))}
           </div>

           {/* Word Display or Swap Actions */}
           {!isSwapping ? (
             <>
               <div className="flex items-center gap-2">
                 <div className="flex-1 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold tracking-widest text-indigo-900 border-2 border-indigo-100">
                   {setupWord || <span className="text-slate-300 text-sm font-normal tracking-normal">Tu palabra...</span>}
                 </div>
                 <button onClick={() => setSetupWord(prev => prev.slice(0, -1))} className="p-4 bg-slate-200 rounded-xl hover:bg-slate-300 transition-colors">
                   <DeleteIcon />
                 </button>
               </div>

               <div className="flex gap-3">
                 {swapsRemaining > 0 && (
                    <Button variant="secondary" onClick={toggleSwapMode} className="flex-1" title="Cambiar Fichas">
                      <RefreshCw className="w-5 h-5 mx-auto text-orange-500" />
                    </Button>
                 )}
                 <Button onClick={confirmSetupWord} disabled={setupWord.length === 0} className={`py-4 text-lg ${swapsRemaining > 0 ? 'flex-[4]' : 'w-full'}`}>
                   Confirmar <ArrowRight className="inline ml-2" />
                 </Button>
               </div>
             </>
           ) : (
             <div className="flex gap-3 animate-in slide-in-from-bottom-2">
                <Button variant="ghost" onClick={toggleSwapMode} fullWidth>
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmSwap} 
                  disabled={selectedSwapTiles.length === 0} 
                  className="bg-orange-500 hover:bg-orange-600 border-orange-700 text-white" 
                  fullWidth
                >
                  Cambiar ({selectedSwapTiles.length})
                </Button>
             </div>
           )}
        </div>
    </div>
  );

  const renderGame = () => (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
       {/* Top Bar */}
       <header className="bg-indigo-900 text-white p-3 shadow-md z-20 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
             <div className="text-center">
                <div className="text-[10px] uppercase opacity-70 font-bold tracking-wider">Tú</div>
                <div className="text-2xl font-black leading-none">{game.player.tokens} <span className="text-sm">🍓</span></div>
             </div>
             <div className="h-8 w-px bg-indigo-700"></div>
             <div className="text-center">
                <div className="text-[10px] uppercase opacity-70 font-bold tracking-wider">Bot</div>
                <div className="text-2xl font-black leading-none">{game.opponent.tokens} <span className="text-sm">🍓</span></div>
             </div>
          </div>

          <div className="flex items-center gap-2">
             <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${game.turn === 'player' ? 'bg-green-500 text-white' : 'bg-indigo-800 text-indigo-300'}`}>
                {game.turn === 'player' ? 'Tu Turno' : 'Bot'}
             </div>
             <button onClick={() => setHistoryOpen(!historyOpen)} className="p-2 bg-indigo-800 rounded-full hover:bg-indigo-700 relative">
                <History className="w-5 h-5" />
                {game.history.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-indigo-900"></span>}
             </button>
             <button onClick={() => setManualOpen(true)} className="p-2 bg-indigo-800 rounded-full hover:bg-indigo-700">
                <BookOpen className="w-5 h-5" />
             </button>
          </div>
       </header>

       {/* History Drawer */}
       {historyOpen && (
         <div className="absolute top-16 left-0 right-0 bottom-0 bg-slate-900/50 z-30" onClick={() => setHistoryOpen(false)}>
            <div className="bg-white w-3/4 max-w-sm h-full shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-left" onClick={e => e.stopPropagation()}>
               <h3 className="font-bold text-lg mb-4 text-indigo-900 flex items-center gap-2"><History className="w-5 h-5"/> Historial</h3>
               <div className="space-y-2">
                 {game.history.map((h, i) => (
                    <div key={i} className="text-sm p-3 bg-slate-50 rounded-lg border border-slate-100 text-slate-700">
                       {h}
                    </div>
                 ))}
               </div>
            </div>
         </div>
       )}

       {/* Main Area */}
       <main className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-xs font-bold text-slate-400 uppercase mb-2 flex justify-between">
                <span>Fichas del Bot</span>
                <span>(Mis fichas originales)</span>
             </div>
             <div className="flex flex-wrap gap-1.5 justify-center opacity-70">
                {game.opponent.tiles.map((t, i) => <Tile key={i} tile={t} small faceDown />)}
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 shadow-md">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-indigo-900">Tus Fichas</h3>
                <Button 
                   onClick={handleGuessClick} 
                   disabled={game.turn !== 'player' || game.waitingForOpponentGuess}
                   className="text-sm px-4 py-1.5"
                >
                  Adivinar
                </Button>
             </div>
             <div className="flex flex-wrap gap-2 justify-center bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[80px]">
                {game.player.tiles.map(t => <Tile key={t.id} tile={t} />)}
             </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 px-1">Usar Pistas</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-8">
               {game.activeCards.map(card => (
                 <Card 
                    key={card.id} 
                    card={card} 
                    onClick={() => handleCardClick(card)}
                    disabled={game.turn !== 'player' || game.waitingForOpponentGuess}
                 />
               ))}
            </div>
          </div>
       </main>

       {game.waitingForOpponentGuess && (
         <div className="bg-yellow-100 border-t border-yellow-200 p-3 text-center text-yellow-800 text-sm font-medium z-10 animate-pulse">
            Has acertado. Esperando a superar tokens...
         </div>
       )}
    </div>
  );

  const renderGameOver = () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
       <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md text-center space-y-6 animate-in zoom-in">
          {game.winner === 'player' ? (
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Crown className="w-10 h-10 text-yellow-600" />
            </div>
          ) : (
            <div className="text-6xl mx-auto">💀</div>
          )}
          
          <h1 className="text-3xl font-black text-slate-800">
            {game.winner === 'player' ? '¡VICTORIA!' : 'DERROTA'}
          </h1>
          
          <p className="text-lg text-slate-600 leading-snug">
            {game.winReason}
          </p>

          <div className="py-4 border-y border-slate-100 grid grid-cols-2 gap-4">
             <div className="bg-indigo-50 p-3 rounded-xl">
               <div className="text-xs text-indigo-400 uppercase font-bold">Tú</div>
               <div className="text-3xl font-black text-indigo-700">{game.player.tokens}</div>
             </div>
             <div className="bg-slate-50 p-3 rounded-xl">
               <div className="text-xs text-slate-400 uppercase font-bold">Bot</div>
               <div className="text-3xl font-black text-slate-600">{game.opponent.tokens}</div>
             </div>
          </div>
          
          <div className="bg-slate-100 p-4 rounded-xl">
             <p className="text-xs text-slate-500 uppercase mb-1">Palabra Secreta del Bot</p>
             <p className="text-2xl font-black text-slate-800 tracking-widest">{game.opponent.secretWord}</p>
          </div>

          <Button fullWidth onClick={() => setGame(INITIAL_STATE)}>
            Volver al Menú
          </Button>
       </div>
    </div>
  );

  return (
    <>
      {game.phase === GamePhase.MENU || game.phase === GamePhase.LOBBY ? renderLobby() :
       game.phase === GamePhase.SETUP ? renderSetup() :
       game.phase === GamePhase.GAME_LOOP ? renderGame() :
       renderGameOver()}
      
      <ManualModal isOpen={manualOpen} onClose={() => setManualOpen(false)} />
      
      <EventModal 
        isOpen={!!eventModal.isOpen}
        type={eventModal.type || 'info'}
        title={eventModal.title || ''}
        message={eventModal.message}
        onClose={eventModal.onClose}
        onConfirm={eventModal.onConfirm}
        availableTiles={eventModal.availableTiles}
        confirmText={eventModal.confirmText}
      />
      
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl z-50 text-sm font-bold whitespace-nowrap animate-in slide-in-from-top-4">
          {notification}
        </div>
      )}
    </>
  );
}

// Simple internal component for the delete icon
const DeleteIcon = () => (
    <X className="w-6 h-6" />
);