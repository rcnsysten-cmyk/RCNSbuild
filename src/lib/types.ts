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
  
  export interface SubClass {
    name: string;
    runes: string[];
    skills: SkillConfig[];
    properties: string[];
    config: AttributeConfig[];
    constellation: string[];
    sets: string[];
  }
  
  export interface Build {
    id: string; // Document ID from Firestore
    class: string;
    subclasses: SubClass[];
  }
  