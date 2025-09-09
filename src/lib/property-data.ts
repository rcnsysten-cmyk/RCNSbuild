import { PropertyPage } from "./types";

const dwAgiPropertyPage1: PropertyPage = {
    page: 1,
    title: "Parte 1 - Nível 290 a 384 (95 pontos)",
    left: [
        "Propriedade de Ataque",
        6, 8, 15, 9, 10, 10,
        "Propriedade de Veneno",
        6, 1, 6,
        "Propriedade de Aprimoramento",
        5, 10, 5, 4
    ],
    middle: [
        null, // Spacer for header
        null, null, null, null, null, null,
        null, // Spacer for header
        null, null, null,
        null, // Spacer for header
        null, null, null, null
    ],
    right: [
        null, // Spacer for header
        10, 10, 6, 1, 6, 5,
        null, // Spacer for header
        10, 5, 4,
        null, // Spacer for header
        1, null, null, null
    ]
};

const dwAgiProperties: PropertyPage[] = [
    dwAgiPropertyPage1,
    // Add other pages here in the future
];

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
