export type Rarity = "rare" | "magic" | "special" | "common";

export interface AvailableRune {
    name: string;
    rarity: Rarity;
}

export const rarityOrder: Rarity[] = ["rare", "magic", "special", "common"];

export const rarityColors: { [key in Rarity]: string } = {
    rare: "text-red-400",
    magic: "text-purple-400",
    special: "text-green-400",
    common: "text-yellow-400",
};


const dwRunesByTier: { [tier: number]: AvailableRune[] } = {
    1: [
        { name: "Fumaça Infernal", rarity: "rare" },
        { name: "Tempestade de Partículas de Gelo", rarity: "rare" },
        { name: "Fumaça", rarity: "magic" },
        { name: "Tempestade", rarity: "magic" },
        { name: "Fragmento de Fumaça", rarity: "special" },
        { name: "Fragmento de Tempestade", rarity: "special" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    2: [
        { name: "Infiltração Ilimitada", rarity: "rare" },
        { name: "Geada Feroz", rarity: "rare" },
        { name: "Fragmento de Habilidade de Veneno", rarity: "rare" },
        { name: "Fragmento do Tempo", rarity: "rare" },
        { name: "Infiltração", rarity: "magic" },
        { name: "Nevasca", rarity: "magic" },
        { name: "Habilidade de Veneno", rarity: "magic" },
        { name: "Tempo", rarity: "magic" },
        { name: "Fragmento de Infiltração", rarity: "special" },
        { name: "Fragmento de Nevasca", rarity: "special" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    3: [
        { name: "Fragmento do Mensageiro", rarity: "rare" },
        { name: "Percepção", rarity: "magic" },
        { name: "Fragmento de Percepção", rarity: "special" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    4: [
        { name: "Fragmento de Separação", rarity: "rare" },
        { name: "Separação", rarity: "magic" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    5: [
        { name: "Fragmento de Prazer Perverso", rarity: "rare" },
        { name: "Fragmento de Gelo", rarity: "rare" },
        { name: "Prazer", rarity: "magic" },
        { name: "Habilidade de Gelo", rarity: "magic" },
        { name: "Fragmento de Prazer", rarity: "special" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    6: [
        { name: "Fragmento de Iluminação", rarity: "rare" },
        { name: "Fragmento de Injeção", rarity: "rare" },
        { name: "Iluminação", rarity: "magic" },
        { name: "Injeção", rarity: "magic" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    7: [
        { name: "Fragmento de Melodia Venenosa", rarity: "rare" },
        { name: "Fragmento de Gelo Estilhaçado", rarity: "rare" },
        { name: "Melodia", rarity: "magic" },
        { name: "Gelo Estilhaçado", rarity: "magic" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    8: [
        { name: "Visão Aprimorada", rarity: "rare" },
        { name: "Mundo de Gelo", rarity: "rare" },
        { name: "Visão", rarity: "magic" },
        { name: "Explosão", rarity: "magic" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    9: [
        { name: "Fragmento Divino Celestial", rarity: "rare" },
        { name: "Divindade", rarity: "magic" },
        { name: "Celestial", rarity: "magic" },
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ],
    10: [
        // Adicionar runas do Tier 10 quando disponíveis
        { name: "Fragmento de Runa do Escalão", rarity: "common" },
    ]
};


export function getAvailableRunes(className: string, tier: number): AvailableRune[] {
    const lowerClassName = className.toLowerCase();

    if (lowerClassName === 'dark wizard') {
        return dwRunesByTier[tier] || [];
    }

    // In the future, add other classes here
    // if (lowerClassName === 'dark knight') {
    //   return dkRunesByTier[tier] || [];
    // }

    return [];
}
