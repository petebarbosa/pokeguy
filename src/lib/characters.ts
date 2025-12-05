import PeterGriffin from '@/assets/Peter_Griffin.png';
import LoisGriffin from '@/assets/Lois_Griffin.png';
import StewieGriffin from '@/assets/Stewie_Griffin.png';
import BrianGriffin from '@/assets/Brian_Griffin.png';
import ChrisGriffin from '@/assets/Chris_Griffin.png';
import MegGriffin from '@/assets/Meg_Griffin.png';
import GlennQuagmire from '@/assets/Glenn_Quagmire.png';
import ClevelandBrown from '@/assets/Cleveland_Brown.png';
import JoeSwanson from '@/assets/Jow_Swanson.png';
import Herbert from '@/assets/Herbert.png';
import AngryMonkey from '@/assets/Angry_monkey.png';
import God from '@/assets/God.png';
import { StaticImageData } from 'next/image';

export interface Character {
  name: string;
  image: StaticImageData;
  color: string;
}

export const FAMILY_GUY_CHARACTERS: Character[] = [
  { name: 'Peter Griffin', image: PeterGriffin, color: '#4A90D9' },
  { name: 'Lois Griffin', image: LoisGriffin, color: '#E74C3C' },
  { name: 'Stewie Griffin', image: StewieGriffin, color: '#F1C40F' },
  { name: 'Brian Griffin', image: BrianGriffin, color: '#ECF0F1' },
  { name: 'Chris Griffin', image: ChrisGriffin, color: '#E67E22' },
  { name: 'Meg Griffin', image: MegGriffin, color: '#9B59B6' },
  { name: 'Glenn Quagmire', image: GlennQuagmire, color: '#2ECC71' },
  { name: 'Cleveland Brown', image: ClevelandBrown, color: '#8B4513' },
  { name: 'Joe Swanson', image: JoeSwanson, color: '#3498DB' },
  { name: 'Herbert', image: Herbert, color: '#95A5A6' },
  { name: 'Angry Monkey', image: AngryMonkey, color: '#8B4513' },
  { name: 'God', image: God, color: '#FFD700' },
];

export function getRandomCharacter(excludeList: string[] = []): Character {
  const availableCharacters = FAMILY_GUY_CHARACTERS.filter(
    (char) => !excludeList.includes(char.name)
  );

  // If all characters are taken, allow duplicates
  const pool = availableCharacters.length > 0 ? availableCharacters : FAMILY_GUY_CHARACTERS;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function getCharacterByName(name: string): Character | undefined {
  return FAMILY_GUY_CHARACTERS.find((char) => char.name === name);
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
