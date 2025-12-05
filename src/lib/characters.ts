// Client-side characters with images
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
import {
  FAMILY_GUY_CHARACTERS_DATA,
  getCharacterInitials as getInitials,
  getCharacterColor as getColor,
} from './characters-data';

export interface Character {
  name: string;
  image: StaticImageData;
  color: string;
}

// Map character names to their imported images
const characterImages: Record<string, StaticImageData> = {
  'Peter Griffin': PeterGriffin,
  'Lois Griffin': LoisGriffin,
  'Stewie Griffin': StewieGriffin,
  'Brian Griffin': BrianGriffin,
  'Chris Griffin': ChrisGriffin,
  'Meg Griffin': MegGriffin,
  'Glenn Quagmire': GlennQuagmire,
  'Cleveland Brown': ClevelandBrown,
  'Joe Swanson': JoeSwanson,
  'Herbert': Herbert,
  'Angry Monkey': AngryMonkey,
  'God': God,
};

// Combine character data with images
export const FAMILY_GUY_CHARACTERS: Character[] = FAMILY_GUY_CHARACTERS_DATA.map((char) => ({
  ...char,
  image: characterImages[char.name],
}));

export function getCharacterByName(name: string): Character | undefined {
  return FAMILY_GUY_CHARACTERS.find((char) => char.name === name);
}

// Re-export utility functions from characters-data
export { getInitials as getCharacterInitials, getColor as getCharacterColor };
