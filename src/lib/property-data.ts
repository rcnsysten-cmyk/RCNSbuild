
import { PropertyPage, PropertySection } from "./types";

const attackSection: PropertySection = {
    title: "Propriedade de Ataque",
    rows: [
      [0, 0, 0],
      [0, null, 0],
      [null, 0, null],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, null, 0],
      [0, 0, 0],
      [0, null, 0],
      [0, null, 0],
    ]
};

const attackSectionPage12: PropertySection = {
    title: "Propriedade de Ataque",
    rows: [
        [0, 0, 0],
        [0, null, 0],
        [null, 0, null],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const defenseSection: PropertySection = {
    title: "Propriedade de Defesa",
    rows: [
      [0, 0, 0],
      [0, null, 0],
      [null, 0, null],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, null, 0],
      [0, null, 0],
      [0, null, 0],
      [0, null, 0],
    ],
};

const defenseSectionPage9: PropertySection = {
    title: "Propriedade de Defesa",
    rows: [
        [0, 0, 0],
        [0, null, 0],
        [null, 0, null],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const defenseSectionPage13: PropertySection = {
    title: "Propriedade de Defesa",
    rows: [
        [0, 0, 0],
        [0, null, 0],
        [null, 0, null],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const defenseSectionPage15: PropertySection = {
    title: "Propriedade de Defesa",
    rows: [
        [0, 0, 0],
        [0, null, 0],
        [null, 0, null],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};


const commonSection: PropertySection = {
    title: "Propriedade Comum",
    rows: [
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const commonSectionPage6: PropertySection = {
    title: "Propriedade Comum",
    rows: [
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
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
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const commonSectionPage14: PropertySection = {
    title: "Propriedade Comum",
    rows: [
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const commonSectionPage16: PropertySection = {
    title: "Propriedade Comum",
    rows: [
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
        [0, null, 0],
    ]
};

const elementalSection: PropertySection = {
    title: "Propriedade do Tipo Elemental",
    rows: [
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
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
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [0, null, 0],
        [0, 0, 0],
        [null, null, null],
        [null, null, null],
    ]
};

export const pageTypeMap: { [key: number]: "Ataque" | "Defesa" | "Comum" | "Elemental" } = {
    1: "Ataque",
    2: "Defesa",
    3: "Ataque",
    4: "Comum",
    5: "Defesa",
    6: "Comum",
    7: "Comum",
    8: "Ataque",
    9: "Defesa",
    10: "Elemental",
    11: "Elemental",
    12: "Ataque",
    13: "Defesa",
    14: "Comum",
    15: "Defesa",
    16: "Comum",
};

const pageSectionMap: { [key: number]: PropertySection[] } = {
    1: [attackSection], 
    2: [defenseSection],
    3: [attackSection], 
    4: [commonSection],
    5: [defenseSection],
    6: [commonSectionPage6],
    7: [commonSectionPage7],
    8: [attackSection], 
    9: [defenseSectionPage9],
    10: [elementalSection],
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
    13: "Parte 13 - Nível 986 a 997 (11 pontos)",
    14: "Parte 14 - Nível 997 a 1071 (74 pontos)",
    15: "Parte 15 - Nível 1071 a 1081 (10 pontos)",
    16: "Parte 16 - Nível 1081 a 1100 (19 pontos)",
}


const dwAgiProperties: PropertyPage[] = Array.from({ length: 16 }, (_, i) => {
    const pageNum = i + 1;
    
    let title = pageTitleMap[pageNum] || `Parte ${pageNum}`;

    const sectionsForPage = pageSectionMap[pageNum] || [];
    
    return {
      page: pageNum,
      title: title,
      sections: JSON.parse(JSON.stringify(sectionsForPage)) 
    };
});
  

export function getPropertyData(className: string, subClassName: string): PropertyPage[] {
    const lowerClassName = className.toLowerCase();
    const lowerSubClassName = subClassName.toLowerCase();

    if (lowerClassName === 'dark wizard' && lowerSubClassName === 'agi') {
        return JSON.parse(JSON.stringify(dwAgiProperties));
    }

    return [];
}
