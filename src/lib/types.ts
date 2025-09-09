export interface AttributeConfig {
    levelRange: string;
    str: number;
    agi: number;
    vit: number;
    ene: number;
  }

  export interface SkillConfig {
    name: string;
    points: number;
  }

  export interface PropertyPage {
    page: number;
    title: string;
    left: (string | number | null)[];
    middle: (string | number | null)[];
    right: (string | number | null)[];
  }
  
  export interface SubClass {
    name: string;
    runes: string[];
    skills: SkillConfig[];
    properties: PropertyPage[];
    config: AttributeConfig[];
    constellation: string[];
    sets: string[];
  }
  
  export interface Build {
    id: string; // Document ID from Firestore
    class: string;
    subclasses: SubClass[];
  }
  