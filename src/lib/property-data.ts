import { PropertyPage, PropertySection } from "./types";

const attackSection: PropertySection = {
  title: "Propriedade de Ataque",
  rows: [
      [6, 8, 15],
      [9, null, 10],
      [null, 10, null],
      [6, 1, 6],
      [5, 10, 5],
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
  ]
};

const defenseSection: PropertySection = {
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

const commonSection: PropertySection = {
  title: "Propriedade Comum",
  rows: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
  ]
};

const elementalSection: PropertySection = {
  title: "Propriedade Elemental",
  rows: [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
  ]
};

const pageTypeMap: { [key: number]: PropertySection[] } = {
    1: [{ ...attackSection, rows: [
        [6, 8, 15],
        [9, null, 10],
        [null, 10, null],
        [6, 1, 6],
        [5, 10, 5],
        [1, 1, 1],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]}], 
    2: [{ ...defenseSection, rows: [
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
    ]}],
    3: [{ ...attackSection, rows: [
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
    ]}], 
    4: [commonSection],
    5: [defenseSection],
    6: [commonSection],
    7: [commonSection],
    8: [attackSection], 
    9: [defenseSection],
    10: [elementalSection],
    11: [elementalSection],
    12: [attackSection], 
    13: [defenseSection],
    14: [commonSection],
    15: [defenseSection],
    16: [commonSection],
};

const pageTitleMap: { [key: number]: string } = {
    1: "Parte 1 - Nível 290 a 384 (95 pontos)",
    2: "Parte 2 - Nível 385 a 479 (95 pontos)",
    3: "Parte 3 - Nível 517 a 597 (80 pontos)",
    // Add other titles as they become available
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
