/**
 * Generate a random 4-character room code
 */
export function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Get random character from a string pool
 */
export function getRandomChar(pool) {
  return pool.charAt(Math.floor(Math.random() * pool.length));
}

/**
 * Shuffle an array
 */
export function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Generate tiles for a player
 */
export function generateTiles() {
  const VOWEL_POOL = "AAAAAAAAAAAEEEEEEEEEEEEIIIIIIOOOOOOOOOUUUUU";
  const CONSONANT_POOL = "LLLLNNNNNRRRRRSSSSSSTTTTDDDDDGGBBCCCCMMPPFFHHVYQJÑXZ";

  const tiles = [];

  // Generate 5 vowels
  for (let i = 0; i < 5; i++) {
    tiles.push({
      id: Math.random().toString(36).substr(2, 9),
      letter: getRandomChar(VOWEL_POOL),
      type: 'VOWEL',
      revealed: false,
      disabled: false
    });
  }

  // Generate 6 consonants
  for (let i = 0; i < 6; i++) {
    tiles.push({
      id: Math.random().toString(36).substr(2, 9),
      letter: getRandomChar(CONSONANT_POOL),
      type: 'CONSONANT',
      revealed: false,
      disabled: false
    });
  }

  return shuffleArray(tiles);
}

/**
 * Generate deck of cards (4 vanilla + 4 spicy)
 */
export function generateDeck() {
  const CARDS = [
    // Vanilla
    { id: 'yakky', name: 'Yakky Doodle', flavor: 'Generador de palabras', description: 'Construye una palabra. El oponente "apaga" las letras que NO están.', cost: 4, type: 'vanilla' },
    { id: 'woody', name: 'Woody Woodpecker', flavor: 'Primera letra', description: 'Revela la primera letra.', cost: 4, type: 'vanilla' },
    { id: 'calimero', name: 'Calimero', flavor: 'Longitud relativa', description: 'Construye palabra. Dice si es más larga, corta o igual.', cost: 1, type: 'vanilla' },
    { id: 'jose', name: 'José Carioca', flavor: 'Letra a revisar', description: 'Elige letra. Dice si está en la palabra.', cost: 2, type: 'vanilla' },
    { id: 'chilly', name: 'Chilly Willy', flavor: 'Longitud exacta', description: 'Indica longitud exacta.', cost: 3, type: 'vanilla' },
    { id: 'woodstock', name: 'Woodstock', flavor: 'Última letra', description: 'Revela última letra.', cost: 1, type: 'vanilla' },

    // Spicy
    { id: 'foghorn', name: 'Foghorn Leghorn', flavor: 'Compra vocal', description: 'Revela una vocal no revelada.', cost: 1, type: 'spicy' },
    { id: 'beaky', name: 'Beaky Buzzard', flavor: 'Número vocales', description: 'Dice cuántas vocales.', cost: 2, type: 'spicy' },
    { id: 'daffy', name: 'Daffy Duck', flavor: 'Número consonantes', description: 'Dice cuántas consonantes.', cost: 3, type: 'spicy' },
    { id: 'henery', name: 'Henery Hawk', flavor: 'Superjugada', description: 'Elige letra. Si está, revela posición.', cost: 3, type: 'spicy' },
    { id: 'zazu', name: 'Zazu', flavor: 'Dar y recibir', description: 'Ambos revelan letra no revelada.', cost: 1, type: 'spicy' },
    { id: 'heckle', name: 'Heckle and Jeckle', flavor: 'Ejemplares', description: 'Letra que tengas 2+. Dice cuántas veces.', cost: 2, type: 'spicy' },
    { id: 'scuttle', name: 'Scuttle', flavor: 'Compartamos', description: 'Letra en ambos sets. Dice cuántas cada uno.', cost: 1, type: 'spicy' },
    { id: 'scrooge', name: 'Scrooge McDuck', flavor: 'Dinámico', description: 'Como Yakky, coste = letras que quedan.', cost: 'variable', type: 'spicy' },
    { id: 'flit', name: 'Flit', flavor: 'Perla rara', description: 'Elige Z,J,Q,X,K. Dice si está.', cost: 1, type: 'spicy' },
    { id: 'iago', name: 'Iago', flavor: 'Rima', description: 'Dice palabra que rime.', cost: 5, type: 'spicy' }
  ];

  const vanilla = CARDS.filter(c => c.type === 'vanilla');
  const spicy = CARDS.filter(c => c.type === 'spicy');

  return [
    ...shuffleArray(vanilla).slice(0, 4),
    ...shuffleArray(spicy).slice(0, 4)
  ];
}
