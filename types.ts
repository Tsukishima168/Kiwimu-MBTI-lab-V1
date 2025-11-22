export type CategoryKey = 'ANALYSTS' | 'DIPLOMATS' | 'SENTINELS' | 'EXPLORERS';
export type MbtiCode = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface CategoryData {
  name: string;
  color: string;
  border: string;
  hex: string;
}

export interface LifeThemes {
  love: string;
  workplace: string;
  relationships: string;
  wealth: string;
  health: string;
}

export interface MbtiProfile {
  code: MbtiCode;
  name: string;
  category: CategoryKey;
  slogan: string;
  desc: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  characters: string[];
  functions: string[];
  lifeThemes: LifeThemes;
}

export interface Question {
  id: number;
  dim: string;
  q: string;
  a: string;
  b: string;
}