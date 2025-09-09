export interface ConstellationData {
    level: number;
    left: string;
    right: string;
}

const dwAgiConstellation: ConstellationData[] = [
    // Page 1
    { level: 25, left: "DEF +3%", right: "Redução de Espera 2%" },
    { level: 29, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 33, left: "ATQ +3%", right: "Redução de Espera 2%" },
    { level: 37, left: "DANO E. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 41, left: "DEF +3%", right: "Redução de Espera 2%" },
    { level: 45, left: "Velocidade de ATQ +7", right: "Aumento de DANO de Veneno 10%" },
    { level: 49, left: "Taxa de RES Crítica +5%", right: "Redução de Espera 2%" },
    { level: 53, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 57, left: "Taxa de RES E. +5%", right: "Redução de Espera 2%" },
    { level: 61, left: "DANO E. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 65, left: "Dano Crít. (-) +10%", right: "Redução de Espera 2%" },
    { level: 69, left: "Velocidade de ATQ +7", right: "Aumento de DANO de Veneno 10%" },
    { level: 73, left: "Dano Elemental (-) +10%", right: "Redução de Espera 2%" },
    { level: 77, left: "DEF Ignorada +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 81, left: "Taxa de RES Crítica +5%", right: "Redução de Espera 2%" },
    { level: 85, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 89, left: "Taxa de RES E. +5%", right: "Redução de Espera 2%" },
    // Page 2
    { level: 93, left: "Velocidade de ATQ +7", right: "Aumento de DANO de Veneno 10%" },
    { level: 97, left: "DANO E. (+) +10%", right: "Redução de Espera 2%" },
    { level: 101, left: "DEF Ignorada +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 105, left: "Dano Crít. (-) +10%", right: "Redução de Espera 2%" },
    { level: 109, left: "Dano Crít. (+) +10%", right: "Aumento de DANO de Veneno 10%" },
    { level: 113, left: "Velocidade de ATQ +7", right: "Redução de Espera 2%" },
    { level: 117, left: "Taxa de RES E. +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 121, left: "DANO E. (+) +10%", right: "Redução de Espera 2%" },
    { level: 125, left: "Taxa de RES Crítica +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 129, left: "Dano Elemental (-) +10%", right: "Redução de Espera 2%" },
    { level: 133, left: "DEF Ignorada +5%", right: "Aumento de DANO de Veneno 10%" },
    { level: 148, left: "DEF Ignorada +6%", right: "Aumentar DANO de Habilidade +15%" },
    { level: 163, left: "HP máximo +2%", right: "Aumento de DANO de Veneno 10%" },
    { level: 178, left: "ATQ +2%", right: "Redução de Espera 2%" },
    { level: 193, left: "Taxa de RES E. +5%", right: "Aumentar DANO de Habilidade +15%" },
    { level: 208, left: "DEF Ignorada +5%", right: "DANO Crítico (-) +5%" },
    { level: 223, left: "DEF Ignorada +5%", right: "Taxa de RES E. +5%" },
      // Page 3
    { level: 238, left: "ATQ +2%", right: "Redução de Espera 2%" },
    { level: 253, left: "HP máximo +2%", right: "Taxa de RES Crítica +5%" },
    { level: 268, left: "Dano Elemental (-) +5%", right: "DEF Ignorada +5%" },
    { level: 283, left: "Dano Elemental (-) +5%", right: "DEF Ignorada +5%" },
    { level: 298, left: "DEF +2%", right: "Taxa de RES Crítica +5%" },
    { level: 313, left: "DEF +2%", right: "Aumentar DANO de Habilidade +15%" },
];

// In the future, you can add more constellation data here
// const dkStrConstellation: ConstellationData[] = [ ... ];
// const elfaEneConstellation: ConstellationData[] = [ ... ];

export function getConstellationData(className: string, subClassName: string): ConstellationData[] {
    const lowerClassName = className.toLowerCase();
    const lowerSubClassName = subClassName.toLowerCase();

    if (lowerClassName === 'dark wizard' && lowerSubClassName === 'agi') {
        return dwAgiConstellation;
    }

    // Add more conditions here for other classes and subclasses
    // if (lowerClassName === 'dark knight' && lowerSubClassName === 'str') {
    //     return dkStrConstellation;
    // }

    // Return empty array if no match is found
    return [];
}
