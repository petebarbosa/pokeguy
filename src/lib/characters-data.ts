// Character data without image imports (for server-side use)

export interface CharacterData {
  name: string;
  color: string;
}

export const FAMILY_GUY_CHARACTERS_DATA: CharacterData[] = [
  { name: 'Peter Griffin', color: '#4A90D9' },
  { name: 'Lois Griffin', color: '#E74C3C' },
  { name: 'Stewie Griffin', color: '#F1C40F' },
  { name: 'Brian Griffin', color: '#ECF0F1' },
  { name: 'Chris Griffin', color: '#E67E22' },
  { name: 'Meg Griffin', color: '#9B59B6' },
  { name: 'Glenn Quagmire', color: '#2ECC71' },
  { name: 'Cleveland Brown', color: '#8B4513' },
  { name: 'Joe Swanson', color: '#3498DB' },
  { name: 'Herbert', color: '#95A5A6' },
  { name: 'Angry Monkey', color: '#8B4513' },
  { name: 'God', color: '#FFD700' },
];

export function getRandomCharacter(excludeList: string[] = []): CharacterData {
  const availableCharacters = FAMILY_GUY_CHARACTERS_DATA.filter(
    (char) => !excludeList.includes(char.name)
  );

  // If all characters are taken, allow duplicates
  const pool = availableCharacters.length > 0 ? availableCharacters : FAMILY_GUY_CHARACTERS_DATA;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function getCharacterByName(name: string): CharacterData | undefined {
  return FAMILY_GUY_CHARACTERS_DATA.find((char) => char.name === name);
}

export function getCharacterInitials(characterName: string): string {
  return characterName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function getCharacterColor(characterName: string): string {
  const character = getCharacterByName(characterName);
  return character?.color || '#6B7280';
}
