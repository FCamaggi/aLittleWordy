import { CARDS, VOWELS, CONSONANTS, BOT_WORDS, VOWEL_POOL, CONSONANT_POOL } from '../constants';
import { Card, Tile, TileType } from '../types';

export const generateDeck = (): Card[] => {
  const vanilla = CARDS.filter(c => c.type === 'vanilla');
  const spicy = CARDS.filter(c => c.type === 'spicy');

  const shuffle = (array: any[]) => array.sort(() => 0.5 - Math.random());

  return [...shuffle(vanilla).slice(0, 4), ...shuffle(spicy).slice(0, 4)];
};

const getRandomChar = (pool: string) => pool.charAt(Math.floor(Math.random() * pool.length));

export const getNewTile = (type: TileType): Tile => {
  const pool = type === TileType.VOWEL ? VOWEL_POOL : CONSONANT_POOL;
  const letter = getRandomChar(pool);
  return {
    id: Math.random().toString(36).substr(2, 9),
    letter,
    type
  };
};

export const generateTiles = (forcedWord?: string): Tile[] => {
  let tiles: Tile[] = [];
  let vowelCount = 0;
  let consCount = 0;

  if (forcedWord) {
    for (const char of forcedWord) {
      const type = VOWELS.includes(char) ? TileType.VOWEL : TileType.CONSONANT;
      tiles.push({ id: Math.random().toString(36).substr(2, 9), letter: char, type });
      if (type === TileType.VOWEL) vowelCount++;
      else consCount++;
    }
  }

  // Adjusted for Spanish: 5 Vowels, 6 Consonants (Total 11)
  while (vowelCount < 5) {
    const l = getRandomChar(VOWEL_POOL);
    tiles.push({ id: Math.random().toString(36).substr(2, 9), letter: l, type: TileType.VOWEL });
    vowelCount++;
  }
  while (consCount < 6) {
    const l = getRandomChar(CONSONANT_POOL);
    tiles.push({ id: Math.random().toString(36).substr(2, 9), letter: l, type: TileType.CONSONANT });
    consCount++;
  }

  return tiles.sort(() => 0.5 - Math.random());
};

export const getBotWordAndTiles = () => {
  const word = BOT_WORDS[Math.floor(Math.random() * BOT_WORDS.length)];
  
  // Construct tiles specifically from the word to ensure it's playable
  const finalTiles: Tile[] = [];
  let v = 0;
  let c = 0;
  
  for(const char of word) {
    const isV = VOWELS.includes(char);
    finalTiles.push({ id: Math.random().toString(), letter: char, type: isV ? TileType.VOWEL : TileType.CONSONANT});
    if(isV) v++; else c++;
  }
  
  // Fill rest with weighted randoms to meet 5V / 6C quota
  while(v < 5) {
    const l = getRandomChar(VOWEL_POOL);
    finalTiles.push({ id: Math.random().toString(), letter: l, type: TileType.VOWEL});
    v++;
  }
  while(c < 6) {
    const l = getRandomChar(CONSONANT_POOL);
    finalTiles.push({ id: Math.random().toString(), letter: l, type: TileType.CONSONANT});
    c++;
  }
  
  return { word, tiles: finalTiles };
};

export const scrambleTiles = (tiles: Tile[]): Tile[] => {
  return [...tiles].sort(() => 0.5 - Math.random());
};