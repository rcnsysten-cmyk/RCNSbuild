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


const dwRunes: AvailableRune[] = [
    // Raras (Vermelho)
    { name: "Fumaça Infernal", rarity: "rare" },
    { name: "Tempestade de Partículas de Gelo", rarity: "rare" },
    { name: "Infiltração Ilimitada", rarity: "rare" },
    { name: "Geada Feroz", rarity: "rare" },
    { name: "Fragmento de Habilidade de Veneno", rarity: "rare" },
    { name: "Fragmento do Tempo", rarity: "rare" },
    { name: "Fragmento do Mensageiro", rarity: "rare" },
    { name: "Fragmento de Separação", rarity: "rare" },
    { name: "Fragmento de Prazer Perverso", rarity: "rare" },
    { name: "Fragmento de Gelo", rarity: "rare" },
    { name: "Fragmento de Iluminação", rarity: "rare" },
    { name: "Fragmento de Injeção", rarity: "rare" },
    { name: "Fragmento de Melodia Venenosa", rarity: "rare" },
    { name: "Fragmento de Gelo Estilhaçado", rarity: "rare" },
    { name: "Visão Aprimorada", rarity: "rare" },
    { name: "Mundo de Gelo", rarity: "rare" },
    { name: "Fragmento Divino Celestial", rarity: "rare" },

    // Mágicas (Roxo)
    { name: "Fumaça", rarity: "magic" },
    { name: "Tempestade", rarity: "magic" },
    { name: "Infiltração", rarity: "magic" },
    { name: "Nevasca", rarity: "magic" },
    { name: "Percepção", rarity: "magic" },
    { name: "Habilidade de Veneno", rarity: "magic" },
    { name: "Habilidade de Gelo", rarity: "magic" },
    { name: "Prazer", rarity: "magic" },
    { name: "Tempo", rarity: "magic" },
    { name: "Separação", rarity: "magic" },
    { name: "Injeção", rarity: "magic" },
    { name: "Iluminação", rarity: "magic" },
    { name: "Melodia", rarity: "magic" },
    { name: "Divindade", rarity: "magic" },
    { name: "Visão", rarity: "magic" },
    { name: "Explosão", rarity: "magic" },
    { name: "Gelo Estilhaçado", rarity: "magic" },
    { name: "Celestial", rarity: "magic" },
    
    // Especiais (Verde)
    { name: "Fragmento de Fumaça", rarity: "special" },
    { name: "Fragmento de Tempestade", rarity: "special" },
    { name: "Fragmento de Infiltração", rarity: "special" },
    { name: "Fragmento de Nevasca", rarity: "special" },
    { name: "Fragmento de Percepção", rarity: "special" },
    { name: "Fragmento de Prazer", rarity: "special" },

    // Comuns (Amarelo)
    { name: "Fragmento de Runa do Escalão", rarity: "common" },
];


export function getAvailableRunes(className: string): AvailableRune[] {
    const lowerClassName = className.toLowerCase();

    if (lowerClassName === 'dark wizard') {
        return dwRunes;
    }

    // In the future, add other classes here
    // if (lowerClassName === 'dark knight') {
    //   return dkRunes;
    // }

    return [];
}
