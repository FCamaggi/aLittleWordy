import { Card } from './types';

export const VOWELS = ['A', 'E', 'I', 'O', 'U'];
// Added Ñ. Removed K and W from standard distribution logic but kept in list for validity checks if needed.
export const CONSONANTS = [
  'B',
  'C',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'M',
  'N',
  'Ñ',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

// Distribution strings based on Spanish Scrabble quantities
// A:12, E:12, I:6, O:9, U:5
export const VOWEL_POOL = 'AAAAAAAAAAAEEEEEEEEEEEEIIIIIIOOOOOOOOOUUUUU';

// L:4, N:5, R:5, S:6, T:4, D:5, G:2, B:2, C:4, M:2, P:2, F:1, H:2, V:1, Y:1, Q:1, J:1, Ñ:1, X:1, Z:1
// Note: Digraphs (CH, LL, RR) are represented by their constituent letters in this digital version for input compatibility.
// K and W are excluded from generation as per Spanish Scrabble sets.
export const CONSONANT_POOL =
  'LLLLNNNNNRRRRRSSSSSSTTTTDDDDDGGBBCCCCMMPPFFHHVYQJÑXZ';

export const MANUAL_TEXT = `
# Manual de Reglas: A Little Wordy

## Objetivo del Juego
Ser el jugador que descifre la Palabra Secreta de su oponente teniendo más Berry Tokens (Fichas de Baya) que él al final de la partida.

## 1. Preparación de la Mesa (Setup)
**Las Pistas (Clues):**
- Se barajan los mazos Vanilla (Fáciles) y Spicy (Difíciles).
- Se sacan 4 de cada uno (8 en total).
**El Banco:**
- Todas las fichas comienzan en el banco.
**Los Jugadores:**
- Cada jugador recibe 5 Vocales y 6 Consonantes al azar.

## 2. Creación de la Palabra
**Formar la Palabra:**
- Usa tus 11 fichas para crear una Palabra Secreta.
- Longitud: 1 a 11 letras.
- Debe ser una palabra válida.
**El Intercambio:**
- Escribe tu palabra.
- Mezcla tus fichas.
- ¡Intercambia todas tus fichas con el oponente!
- Ahora intentas adivinar la palabra que el oponente hizo con las fichas que tienes frente a ti.

## 3. Cómo Jugar (Turnos)
En tu turno, realizas UNA acción:

**Opción A: Activar una Pista**
1. Elige una carta.
2. Tu oponente gana Tokens igual al coste de la carta.
3. Resuelve el efecto de la carta.

**Opción B: Adivinar la Palabra**
1. Anuncia tu intento.
2. **Si fallas**: Tu oponente gana 2 Tokens. Tu turno termina.
3. **Si aciertas**:
    - **Escenario 1 (Tienes MÁS fichas)**: ¡Ganas inmediatamente!
    - **Escenario 2 (Tienes MENOS o IGUAL fichas)**: Dejas de jugar. Tu oponente sigue jugando solo intentando adivinar tu palabra y gastando pistas (dándote tokens) hasta que superes su cantidad de tokens o él adivine tu palabra.

## 4. Fin del Juego
- Si adivinas y tienes más puntos -> VICTORIA.
- Si tu oponente adivina tu palabra antes de que tú superes sus puntos -> DERROTA.
`;

export const CARDS: Card[] = [
  // --- VANILLA CARDS (Las 6 indicadas) ---
  {
    id: 'yakky',
    name: 'Yakky Doodle',
    flavor: 'Generador de palabras',
    description:
      'Construye una palabra. El oponente "apaga" (voltea) las letras que usaste que NO están en su palabra.',
    cost: 4,
    type: 'vanilla',
  },
  {
    id: 'woody',
    name: 'Woody Woodpecker',
    flavor: 'Primera letra',
    description: 'Tu oponente revela la primera letra de su Palabra Secreta.',
    cost: 4,
    type: 'vanilla',
  },
  {
    id: 'calimero',
    name: 'Calimero',
    flavor: 'Longitud relativa',
    description:
      'Construye una palabra. Tu oponente dice si su palabra es más larga, corta o igual.',
    cost: 1,
    type: 'vanilla',
  },
  {
    id: 'jose',
    name: 'José Carioca',
    flavor: 'Letra a revisar',
    description:
      'Elige una ficha. Tu oponente revela si esta letra está en su Palabra Secreta.',
    cost: 2,
    type: 'vanilla',
  },
  {
    id: 'chilly',
    name: 'Chilly Willy',
    flavor: 'Longitud exacta',
    description:
      'Tu oponente te indica la longitud exacta de su Palabra Secreta.',
    cost: 3,
    type: 'vanilla',
  },
  {
    id: 'woodstock',
    name: 'Woodstock',
    flavor: 'Última letra',
    description: 'Tu oponente revela la última letra de su Palabra Secreta.',
    cost: 1,
    type: 'vanilla',
  },

  // --- SPICY CARDS (El resto) ---
  {
    id: 'foghorn',
    name: 'Foghorn Leghorn',
    flavor: 'Compra una vocal',
    description:
      'Tu oponente revela una ficha de Vocal en su Palabra Secreta que aún no haya sido revelada.',
    cost: 1,
    type: 'spicy',
  },
  {
    id: 'beaky',
    name: 'Beaky Buzzard',
    flavor: 'Número de vocales',
    description:
      'Tu oponente te indica el número de Vocales en su Palabra Secreta.',
    cost: 2,
    type: 'spicy',
  },
  {
    id: 'daffy',
    name: 'Daffy Duck',
    flavor: 'Número de consonantes',
    description:
      'Tu oponente te indica el número de Consonantes en su Palabra Secreta.',
    cost: 3,
    type: 'spicy',
  },
  {
    id: 'henery',
    name: 'Henery Hawk',
    flavor: 'Superjugada',
    description:
      'Elige una letra. Si está, el oponente revela la posición de un solo ejemplar.',
    cost: 3,
    type: 'spicy',
  },
  {
    id: 'zazu',
    name: 'Zazu',
    flavor: 'Dar y recibir',
    description: 'Ambos revelan una ficha de letra no revelada.',
    cost: 1,
    type: 'spicy',
  },
  {
    id: 'heckle',
    name: 'Heckle and Jeckle',
    flavor: 'Destruir ejemplares',
    description:
      'Elige una letra que tengas 2+ veces. Oponente dice cuántas veces aparece en su palabra.',
    cost: 2,
    type: 'spicy',
  },
  {
    id: 'scuttle',
    name: 'Scuttle',
    flavor: 'Compartamos',
    description:
      'Elige una letra presente en ambos sets. Se dice cuántas veces aparece en cada palabra.',
    cost: 1,
    type: 'spicy',
  },
  {
    id: 'scrooge',
    name: 'Scrooge McDuck',
    flavor: 'Dinámico',
    description:
      'Construye palabra. Oponente apaga las que no están. Coste = letras que quedan encendidas.',
    cost: 'variable',
    type: 'spicy',
  },
  {
    id: 'flit',
    name: 'Flit',
    flavor: 'Perla rara',
    description: 'Elige Z, J, Q, X o K. Tu oponente dice si aparece.',
    cost: 1,
    type: 'spicy',
  },
  {
    id: 'iago',
    name: 'Iago',
    flavor: 'Rima',
    description: 'Tu oponente debe decir una palabra que rime con su palabra secreta.',
    cost: 5,
    type: 'spicy',
  },
];

export const BOT_WORDS = [
  // Palabras cortas (3-5 letras)
  'SOL',
  'MAR',
  'PAN',
  'LUZ',
  'VOZ',
  'RED',
  'FIN',
  'SER',
  'VER',
  'DAR',
  'CASA',
  'MESA',
  'PISO',
  'AGUA',
  'AIRE',
  'VIDA',
  'AMOR',
  'EDAD',
  'ZONA',
  'IDEA',
  'GATO',
  'PERRO',
  'SILLA',
  'LAPIZ',
  'RELOJ',
  'CIELO',
  'FUEGO',
  'PLAYA',
  'NOCHE',
  'TARDE',

  // Palabras medianas (6-7 letras)
  'MANZANA',
  'NARANJA',
  'PLATANO',
  'VENTANA',
  'PUERTA',
  'CAMINO',
  'BOSQUE',
  'CIUDAD',
  'LIBRO',
  'MUNDO',
  'FELIZ',
  'GRANDE',
  'VERDE',
  'AZUL',
  'NEGRO',
  'BLANCO',
  'TIEMPO',
  'ESPACIO',
  'MUSICA',
  'BAILE',
  'JUEGO',
  'DEPORTE',
  'FIESTA',
  'AMIGO',
  'PERSONA',
  'FAMILIA',
  'MADRE',
  'PADRE',
  'HERMANO',
  'ESCUELA',
  'TRABAJO',
  'DINERO',

  // Palabras largas (8+ letras)
  'COMPUTADORA',
  'TELEFONO',
  'TELEVISION',
  'INTERNET',
  'DOCUMENTO',
  'MEDICINA',
  'AVENTURA',
  'HISTORIA',
  'GEOGRAFIA',
  'CIENCIA',
  'UNIVERSO',
  'PLANETA',

  // Palabras con Ñ
  'NIÑO',
  'NIÑA',
  'España',
  'MONTAÑA',
  'SUEÑO',
  'MAÑANA',
  'CABAÑA',
  'PIÑA',
  'AÑO',
  'UÑA',
  'ENSEÑAR',
  'DISEÑO',
  'PEQUEÑO',
  'TAMAÑO',
  'BAÑO',
  'SEÑOR',
  'SEÑAL',

  // Palabras con vocales repetidas
  'CASA',
  'MAMA',
  'PAPA',
  'TAZA',
  'SALA',
  'MAPA',
  'LAVA',
  'MASA',
  'BEBE',
  'TELE',
  'PELE',
  'NENE',
  'SEDE',
  'KILO',
  'VINO',
  'PINO',
  'FILA',
  'MINA',
  'RISA',
  'LISTA',
  'PISTA',
  'VISTA',
  'COCO',
  'LOBO',
  'TORO',
  'BOCA',
  'ROPA',
  'COLA',
  'COPA',
  'HORA',
  'SOPA',
  'TUBO',
  'LUJO',
  'ZUMO',
  'MURO',
  'PURO',

  // Variedad adicional
  'BERRY',
  'LOBBY',
  'CARTA',
  'JUGAR',
  'PASAR',
  'LETRA',
  'PALABRA',
  'SECRETO',
  'RONDA',
  'TURNO',
  'PUNTO',
  'FICHA',
  'RIVAL',
  'GANAR',
  'PERDER',
  'ARBOL',
  'FLOR',
  'HOJA',
  'RAMA',
  'RAIZ',
  'FRUTO',
  'SEMILLA',
  'ESTRELLA',
  'COMETA',
  'SATELITE',
  'COHETE',
  'ESPACIO',
  'DRAGON',
  'PRINCIPE',
  'CASTILLO',
  'CORONA',
  'REINO',
  'BATALLA',
  'OCEANO',
  'VALLE',
  'COLINA',
  'DESIERTO',
  'SELVA',
  'PRADERA',
  'CALLE',
  'AVENIDA',
  'CARRETERA',
  'PUENTE',
  'EDIFICIO',
  'TORRE',
  'COMIDA',
  'CENA',
  'ALMUERZO',
  'POSTRE',
  'HELADO',
  'PASTEL',
  'MUSICA',
  'CANCION',
  'RITMO',
  'MELODIA',
  'ORQUESTA',
  'GUITARRA',
  'PINTURA',
  'ESCULTURA',
  'ARTE',
  'MUSEO',
  'GALERIA',
  'TEATRO',
];
