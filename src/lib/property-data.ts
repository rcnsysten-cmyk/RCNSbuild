import { PropertyPage } from "./types";

const dwAgiPropertyPage1: PropertyPage = {
    page: 1,
    title: "Parte 1 - Nível 290 a 384 (95 pontos)",
    left: [
        "Ignorar Taxa de Redução de DANO", 6,
        "Aumento de DANO de Habilidade", 8,
        "DANO Crítico", 15,
        "DANO Excelente", 9,
        "Ataque PvP", 10,
        "Ataque PvM", 10,
        "Aumento de DANO de Veneno", 6,
        "Chance de Veneno", 1,
        "Duração do Veneno", 6,
        "DANO da Besta", 5,
        "Ataque Mágico", 10,
        "Aumento de DANO de Água", 5,
        "Ataque bem sucedido", 4,
    ],
    middle: [
        10, 10, 6, 1, 6, 5, 10, 5, 4, 1,
    ],
    right: [
        6, 8, 15, 9, 10, 10, 6, 1, 6, 5, 10, 5, 4,
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
