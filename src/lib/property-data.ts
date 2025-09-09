import { PropertyPage, PropertySection } from "./types";

const attackSection: PropertySection = {
  title: "Propriedade de Ataque",
  rows: [
      [6, 8, 15],
      [9, null, 10],
      [null, 10, null],
  ]
};

const defenseSection: PropertySection = {
  title: "Propriedade de Defesa",
  rows: [
      [6, 1, 6],
      [5, 10, 5],
      [1, 1, 1],
  ]
};

const commonSection: PropertySection = {
  title: "Propriedade Comum",
  rows: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
  ]
};

const elementalSection: PropertySection = {
  title: "Propriedade Elemental",
  rows: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
  ]
};

const pageTypeMap: { [key: number]: PropertySection[] } = {
    1: [attackSection], 3: [attackSection], 8: [attackSection], 12: [attackSection],
    2: [defenseSection], 5: [defenseSection], 9: [defenseSection], 13: [defenseSection], 15: [defenseSection],
    4: [commonSection], 6: [commonSection], 7: [commonSection], 14: [commonSection], 16: [commonSection],
    10: [elementalSection], 11: [elementalSection],
};


const dwAgiProperties: PropertyPage[] = Array.from({ length: 16 }, (_, i) => {
    const pageNum = i + 1;
    const startLevel = 290 + (i * 95);
    const endLevel = startLevel + 94;

    const sectionsForPage = pageTypeMap[pageNum] || [];
    
    return {
      page: pageNum,
      title: `Parte ${pageNum} - Nível ${startLevel} a ${endLevel} (95 pontos)`,
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
