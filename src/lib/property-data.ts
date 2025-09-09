import { PropertyPage, PropertySection } from "./types";

const attackSectionPage1: PropertySection = {
  title: "Propriedade de Ataque",
  rows: [
      [6, 8, 15],
      [9, null, 10],
      [null, 10, null],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
  ]
};

const defenseSectionPage2: PropertySection = {
  title: "Propriedade de Defesa",
  rows: [
      [9, 10, 10],
      [9, null, 15],
      [null, 1, null],
      [6, 0, 10],
      [5, 1, 5],
      [1, 10, 1],
      [10, null, 0],
      [10, null, 0],
      [10, null, 0],
      [10, null, 0],
  ]
};

const attackSectionPage3: PropertySection = {
    title: "Propriedade de Ataque",
    rows: [
        [6, 8, 15],
        [9, null, 10],
        [null, 10, null],
        [6, 1, 6],
        [5, 10, 5],
        [1, 1, 1],
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, null, 10],
    ]
  };

const commonSectionPage4: PropertySection = {
    title: "Propriedade Comum",
    rows: [
        [0, null, 6],
        [0, 0, 6],
        [0, null, 9],
        [0, null, 9],
        [0, null, 15],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const defenseSectionPage5: PropertySection = {
    title: "Propriedade de Defesa",
    rows: [
        [9, 10, 10],
        [9, null, 15],
        [null, 1, null],
        [6, 0, 10],
        [5, 1, 5],
        [1, 10, 1],
        [10, null, 10],
        [10, null, 10],
        [10, null, 10],
        [10, null, 10],
    ]
};

const commonSectionPage6: PropertySection = {
    title: "Propriedade Comum",
    rows: [
        [9, null, 6],
        [15, 1, 6],
        [9, null, 9],
        [15, null, 15],
        [0, null, 15],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const attackSectionDefault: PropertySection = {
    title: "Propriedade de Ataque",
    rows: Array(10).fill([0, 0, 0]),
};

const defenseSectionDefault: PropertySection = {
  title: "Propriedade de Defesa",
  rows: Array(10).fill([0, 0, 0]),
};

const commonSectionDefault: PropertySection = {
  title: "Propriedade Comum",
  rows: Array(10).fill([0, 0, 0]),
};

const elementalSectionDefault: PropertySection = {
  title: "Propriedade Elemental",
  rows: Array(10).fill([0, 0, 0]),
};

const pageTypeMap: { [key: number]: PropertySection[] } = {
    1: [attackSectionPage1], 
    2: [defenseSectionPage2],
    3: [attackSectionPage3], 
    4: [commonSectionPage4],
    5: [defenseSectionPage5],
    6: [commonSectionPage6],
    7: [commonSectionDefault],
    8: [attackSectionDefault], 
    9: [defenseSectionDefault],
    10: [elementalSectionDefault],
    11: [elementalSectionDefault],
    12: [attackSectionDefault], 
    13: [defenseSectionDefault],
    14: [commonSectionDefault],
    15: [defenseSectionDefault],
    16: [commonSectionDefault],
};

const pageTitleMap: { [key: number]: string } = {
    1: "Parte 1 - Nível 290 a 384 (95 pontos)",
    2: "Parte 2 - Nível 385 a 479 (95 pontos)",
    3: "Parte 3 - Nível 517 a 597 (80 pontos)",
    4: "Parte 4 - Nível 597 a 642 (45 pontos)",
    5: "Parte 5 - Nível 642 a 682 (40 pontos)",
    6: "Parte 6 - Nível 682 a 737 (55 pontos)",
}

const pageClassMap: { [key: number]: 'attack' | 'defense' | 'common' | 'elemental' } = {
    1: 'attack', 3: 'attack', 8: 'attack', 12: 'attack',
    2: 'defense', 5: 'defense', 9: 'defense', 13: 'defense', 15: 'defense',
    4: 'common', 6: 'common', 7: 'common', 14: 'common', 16: 'common',
    10: 'elemental', 11: 'elemental',
}


const dwAgiProperties: PropertyPage[] = Array.from({ length: 16 }, (_, i) => {
    const pageNum = i + 1;
    
    // Default title generation
    let title = pageTitleMap[pageNum] || `Parte ${pageNum}`;

    const sectionsForPage = pageTypeMap[pageNum] || [];
    
    return {
      page: pageNum,
      title: title,
      // Deep copy to prevent mutations across pages
      sections: JSON.parse(JSON.stringify(sectionsForPage)) 
    };
});
  

export function getPropertyData(className: string, subClassName: string): PropertyPage[] {
    const lowerClassName = className.toLowerCase();
    const lowerSubClassName = subClassName.toLowerCase();

    if (lowerClassName === 'dark wizard' && lowerSubClassName === 'agi') {
        // Deep copy to prevent mutations from affecting the original data
        return JSON.parse(JSON.stringify(dwAgiProperties));
    }

    // Return empty array if no match is found
    return [];
}
