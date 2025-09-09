import { PropertyPage } from "./types";

const dwAgiBasePropertyPage: Omit<PropertyPage, 'page' | 'title'> = {
    left: [
        0, 6, 8, 15, 9, 10, 10,
        0, 6, 1, 6,
        0, 5, 10, 5, 4
    ],
    middle: [
        null, null, null, null, null, null, null,
        null, null, null, null,
        null, null, null, null, null
    ],
    right: [
        null, 10, 10, 6, 1, 6, 5,
        null, 10, 5, 4,
        null, 1, null, null, null
    ]
};

const dwAgiProperties: PropertyPage[] = Array.from({ length: 16 }, (_, i) => {
    const pageNum = i + 1;
    const startLevel = 290 + (i * 95);
    const endLevel = startLevel + 94;
    return {
      ...dwAgiBasePropertyPage,
      page: pageNum,
      title: `Parte ${pageNum} - Nível ${startLevel} a ${endLevel} (95 pontos)`,
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
