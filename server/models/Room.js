import mongoose from 'mongoose';

const TileSchema = new mongoose.Schema({
  id: String,
  letter: String,
  type: { type: String, enum: ['VOWEL', 'CONSONANT'] },
  revealed: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
}, { _id: false });

const PlayerSchema = new mongoose.Schema({
  socketId: String,
  name: String,
  isReady: { type: Boolean, default: false },
  tiles: [TileSchema],
  secretWord: String,
  originalTiles: [TileSchema],
  tokens: { type: Number, default: 0 },
  guesses: [String],
  hasGuessedCorrectly: { type: Boolean, default: false },
  revealedLetters: [String],
  revealedPositions: [{
    letter: String,
    position: Number
  }]
}, { _id: false });

const CardSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  flavor: String,
  cost: mongoose.Schema.Types.Mixed, // number or 'variable'
  type: { type: String, enum: ['vanilla', 'spicy'] }
}, { _id: false });

const RoomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 4
  },
  players: {
    type: [PlayerSchema],
    validate: {
      validator: function(v) {
        return v.length <= 2;
      },
      message: 'A room can have a maximum of 2 players'
    }
  },
  gameState: {
    phase: {
      type: String,
      enum: ['LOBBY', 'SETUP', 'GAME_LOOP', 'GAME_OVER'],
      default: 'LOBBY'
    },
    turn: String, // socketId of the player whose turn it is
    activeCards: [CardSchema],
    history: [String],
    winner: String,
    winReason: String,
    waitingForOpponentGuess: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Index for faster lookups
RoomSchema.index({ code: 1 });
RoomSchema.index({ lastActivity: 1 });

// Update lastActivity on any modification
RoomSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

export default mongoose.model('Room', RoomSchema);
