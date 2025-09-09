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

const commonSectionPage7: PropertySection = {
    title: "Propriedade Comum",
    rows: [
        [9, null, 6],
        [15, 1, 6],
        [9, null, 9],
        [15, null, 15],
        [0, null, 15],
        [0, null, 15],
        [0, null, 10],
        [0, null, 10],
        [0, null, 10],
        [0, null, 10],
    ]
};

const attackSectionPage8: PropertySection = {
    title: "Propriedade de Ataque",
    rows: [
        [6, 8, 15],
        [9, null, 10],
        [null, 10, null],
        [6, 1, 6],
        [5, 10, 5],
        [1, 10, 1],
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, null, 10],
    ]
};

const defenseSectionPage9: PropertySection = {
    title: "Propriedade de Defesa",
    rows: [
        [9, 10, 10],
        [9, null, 15],
        [null, 10, null],
        [6, 0, 10],
        [5, 1, 5],
        [1, 10, 1],
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, null, 10],
    ]
};

const elementalSectionPage10: PropertySection = {
    title: "Propriedade do Tipo Elemental",
    rows: [
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, 0, 10],
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [null, null, null],
        [null, null, null],
    ]
};

const elementalSectionPage11: PropertySection = {
    title: "Propriedade do Tipo Elemental",
    rows: [
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, 0, 10],
        [null, null, null],
        [null, null, null],
    ]
};

const attackSectionPage12: PropertySection = {
    title: "Propriedade de Ataque",
    rows: [
        [10, 10, 15],
        [15, null, 10],
        [null, 10, null],
        [10, 1, 6],
        [5, 10, 5],
        [1, 10, 1],
        [10, null, 10],
        [10, 0, 10],
        [10, null, 10],
        [10, null, 10],
    ]
};

const defenseSectionPage13: PropertySection = {
    title: "Propriedade de Defesa",
    rows: Array(10).fill([0, 0, 0]).map(() => [0, 0, 0])
};

const commonSectionPage14: PropertySection = {
    title: "Propriedade Comum",
    rows: Array(10).fill([0, 0, 0]).map(() => [0, 0, 0])
};

const defenseSectionPage15: PropertySection = {
    title: "Propriedade de Defesa",
    rows: Array(10).fill([0, 0, 0]).map(() => [0, 0, 0])
};

const commonSectionPage16: PropertySection = {
    title: "Propriedade Comum",
    rows: Array(10).fill([0, 0, 0]).map(() => [0, 0, 0])
};

const pageTypeMap: { [key: number]: PropertySection[] } = {
    1: [attackSectionPage1], 
    2: [defenseSectionPage2],
    3: [attackSectionPage3], 
    4: [commonSectionPage4],
    5: [defenseSectionPage5],
    6: [commonSectionPage6],
    7: [commonSectionPage7],
    8: [attackSectionPage8], 
    9: [defenseSectionPage9],
    10: [elementalSectionPage10],
    11: [elementalSectionPage11],
    12: [attackSectionPage12], 
    13: [defenseSectionPage13],
    14: [commonSectionPage14],
    15: [defenseSectionPage15],
    16: [commonSectionPage16],
};

const pageTitleMap: { [key: number]: string } = {
    1: "Parte 1 - Nível 290 a 384 (95 pontos)",
    2: "Parte 2 - Nível 385 a 479 (95 pontos)",
    3: "Parte 3 - Nível 517 a 597 (80 pontos)",
    4: "Parte 4 - Nível 597 a 642 (45 pontos)",
    5: "Parte 5 - Nível 642 a 682 (40 pontos)",
    6: "Parte 6 - Nível 682 a 737 (55 pontos)",
    7: "Parte 7 - Nível 737 a 792 (55 pontos)",
    8: "Parte 8 - Nível 792 a 801 (9 pontos)",
    9: "Parte 9 - Nível 801 a 810 (9 pontos)",
    10: "Parte 10 - Nível 810 a 890 (80 pontos)",
    11: "Parte 11 - Nível 890 a 970 (80 pontos)",
    12: "Parte 12 - Nível 970 a 986 (16 pontos)",
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
