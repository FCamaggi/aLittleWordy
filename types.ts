export enum GamePhase {
  MENU = 'MENU',
  LOBBY = 'LOBBY',
  SETUP = 'SETUP',
  GAME_LOOP = 'GAME_LOOP',
  GAME_OVER = 'GAME_OVER'
}

export enum TileType {
  VOWEL = 'VOWEL',
  CONSONANT = 'CONSONANT'
}

export interface Tile {
  id: string;
  letter: string;
  type: TileType;
  revealed?: boolean; // Si esta ficha fue revelada por una pista
  disabled?: boolean; // Si esta ficha fue "apagada" por Yakky/Scrooge
}

export interface Card {
  id: string;
  name: string;
  description: string;
  flavor: string;
  cost: number | 'variable';
  type: 'vanilla' | 'spicy';
}

export interface PlayerState {
  name: string;
  isBot: boolean;
  tiles: Tile[];      // The tiles currently in front of this player (swapped in phase 2)
  secretWord: string; // The word this player CREATED (which the opponent holds the tiles for)
  originalTiles: Tile[]; // The tiles this player originally drew
  tokens: number;
  guesses: string[];
  hasGuessedCorrectly: boolean;
  revealedLetters: string[]; // Letters that have been revealed from this player's word
  revealedPositions: { letter: string; position: number }[]; // Specific positions revealed
}

export interface GameState {
  phase: GamePhase;
  roomCode: string | null;
  turn: 'player' | 'opponent';
  player: PlayerState;
  opponent: PlayerState;
  activeCards: Card[];
  history: string[];
  winner: string | null;
  winReason: string | null;
  waitingForOpponentGuess: boolean; // Scenario 2 logic
}
