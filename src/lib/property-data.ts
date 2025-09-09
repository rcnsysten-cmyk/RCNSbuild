import { PropertyPage, PropertySection } from "./types";

const dwAgiBasePropertySections: PropertySection[] = [
    {
        title: "Propriedade de Ataque",
        rows: [
            [6, 8, 15],
            [9, null, 10],
            [null, 10, null],
        ]
    },
    {
        title: "Propriedade de Defesa",
        rows: [
            [6, 1, 6],
            [5, 10, 5],
            [1, 1, 1],
        ]
    },
    {
        title: "Propriedade Comum",
        rows: [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]
    },
    {
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
    }
];

const dwAgiProperties: PropertyPage[] = Array.from({ length: 16 }, (_, i) => {
    const pageNum = i + 1;
    const startLevel = 290 + (i * 95);
    const endLevel = startLevel + 94;
    return {
      page: pageNum,
      title: `Parte ${pageNum} - Nível ${startLevel} a ${endLevel} (95 pontos)`,
      sections: JSON.parse(JSON.stringify(dwAgiBasePropertySections)) // Deep copy
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
