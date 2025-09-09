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
  
  export interface PropertyRow {
    left: number | null;
    middle: number | null;
    right: number | null;
  }

  export interface PropertySection {
    title: string;
    rows: PropertyRow[];
  }

  export interface PropertyPage {
    page: number;
    title: string;
    sections: PropertySection[];
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
  