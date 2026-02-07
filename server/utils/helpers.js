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

/**
 * Get card action details for interactive gameplay
 * Returns { actionType, prompt } for the opponent to respond
 */
export function getCardActionDetails(cardId) {
  const actions = {
    // Vanilla cards
    yakky: {
      actionType: 'tiles_not_in_word',
      prompt: 'Tu oponente construyó una palabra. Escribe las LETRAS que NO están en tu palabra secreta (separadas por comas, ej: A, B, C).'
    },
    woody: {
      actionType: 'reveal_first_letter',
      prompt: 'Debes revelar la PRIMERA letra de tu palabra secreta. Selecciónala o escríbela.'
    },
    calimero: {
      actionType: 'compare_length',
      prompt: 'Tu oponente construyó una palabra. Responde: ¿Tu palabra es MÁS LARGA, MÁS CORTA o IGUAL?'
    },
    jose: {
      actionType: 'check_single_letter',
      prompt: 'Tu oponente eligió UNA letra. Responde: ¿Está esta letra en tu palabra? (SÍ o NO)'
    },
    chilly: {
      actionType: 'reveal_length',
      prompt: 'Escribe el NÚMERO de letras de tu palabra secreta (longitud exacta).'
    },
    woodstock: {
      actionType: 'reveal_last_letter',
      prompt: 'Debes revelar la ÚLTIMA letra de tu palabra secreta. Selecciónala o escríbela.'
    },

    // Spicy cards
    foghorn: {
      actionType: 'reveal_vowel',
      prompt: 'Debes revelar UNA vocal de tu palabra que aún NO haya sido revelada. Si no quedan vocales, escribe "NINGUNA".'
    },
    beaky: {
      actionType: 'count_vowels',
      prompt: 'Escribe cuántas VOCALES tiene tu palabra secreta (número).'
    },
    daffy: {
      actionType: 'count_consonants',
      prompt: 'Escribe cuántas CONSONANTES tiene tu palabra secreta (número).'
    },
    henery: {
      actionType: 'letter_position',
      prompt: 'Tu oponente eligió UNA letra. Si está en tu palabra, responde la POSICIÓN de UN ejemplar (1=primera letra, 2=segunda...). Si NO está, escribe "NO ESTÁ".'
    },
    zazu: {
      actionType: 'mutual_reveal',
      prompt: 'Tu oponente reveló una letra de su palabra. Ahora TÚ debes revelar UNA letra NO REVELADA de tu palabra secreta.'
    },
    heckle: {
      actionType: 'count_duplicates',
      prompt: 'Tu oponente eligió una letra que ÉL tiene 2+ veces. Escribe cuántas veces aparece en TU palabra secreta (número, puede ser 0).'
    },
    scuttle: {
      actionType: 'shared_letter_count',
      prompt: 'Tu oponente eligió una letra que está en AMBOS conjuntos. Escribe cuántas veces aparece en TU palabra secreta (número).'
    },
    scrooge: {
      actionType: 'tiles_not_in_word_dynamic',
      prompt: 'Tu oponente construyó una palabra (coste dinámico). Escribe las LETRAS que NO están en tu palabra secreta (separadas por comas).'
    },
    flit: {
      actionType: 'check_rare_letter',
      prompt: 'Tu oponente eligió una letra rara (Z, J, Q, X o K). Responde: ¿Está en tu palabra? (SÍ o NO)'
    },
    iago: {
      actionType: 'rhyme',
      prompt: 'Debes decir una palabra que RIME con tu palabra secreta. Puede ser inventada si no existe ninguna.'
    }
  };

  return actions[cardId] || {
    actionType: 'generic',
    prompt: 'Responde a la acción de la carta.'
  };
}

