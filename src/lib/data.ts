export interface AttributeConfig {
  levelRange: string;
  str: number;
  agi: number;
  vit: number;
  ene: number;
}

export interface SubClass {
  name: string;
  runes: string[];
  skills: string[];
  properties: string[];
  config: AttributeConfig[];
  constellation: string[];
  sets: string[];
}

export interface Build {
  class: string;
  subclasses: SubClass[];
}

export const builds: Build[] = [
  {
    class: 'Dark Wizard',
    subclasses: [
      {
        name: 'ENE',
        runes: ['Runa de Energia Mística', 'Runa de Explosão Arcana', 'Runa de Mente Focada'],
        skills: ['Evil Spirit', 'Meteor', 'Ice Storm'],
        properties: ['Aumento de Dano Mágico: 20%', 'Redução de Custo de Mana: 15%', 'Velocidade de Conjuração: 10%'],
        config: [
          { levelRange: '1-200', str: 100, agi: 100, vit: 100, ene: 500 },
          { levelRange: '201-300', str: 150, agi: 150, vit: 150, ene: 800 },
          { levelRange: '301-400', str: 200, agi: 200, vit: 200, ene: 1200 },
          { levelRange: '401+', str: 250, agi: 250, vit: 250, ene: 2000 },
        ],
        constellation: [],
        sets: [],
      },
      {
        name: 'AGI',
        runes: ['Runa de Teleporte Rápido', 'Runa de Escudo de Mana Veloz', 'Runa de Reflexos'],
        skills: ['Aqua Beam', 'Teleport', 'Soul Barrier'],
        properties: ['Taxa de Defesa: +500', 'Velocidade de Ataque: +20', 'Evasão: 15%'],
        config: [
            { levelRange: '1-200', str: 100, agi: 500, vit: 100, ene: 100 },
            { levelRange: '201-300', str: 150, agi: 800, vit: 150, ene: 150 },
            { levelRange: '301-400', str: 200, agi: 1200, vit: 200, ene: 200 },
            { levelRange: '401+', str: 250, agi: 1800, vit: 250, ene: 250 },
        ],
        constellation: [],
        sets: [],
      },
    ],
  },
  {
    class: 'Dark Knight',
    subclasses: [
      {
        name: 'STR',
        runes: ['Runa da Fúria do Berserker', 'Runa de Golpe Mortal', 'Runa de Pele de Pedra'],
        skills: ['Death Stab', 'Twisting Slash', 'Rageful Blow'],
        properties: ['Dano de Ataque: +30%', 'Chance de Crítico: +10%', 'Aumento de HP: +1000'],
        config: [
            { levelRange: '1-200', str: 600, agi: 100, vit: 100, ene: 20 },
            { levelRange: '201-300', str: 1000, agi: 150, vit: 150, ene: 20 },
            { levelRange: '301-400', str: 1500, agi: 200, vit: 200, ene: 20 },
            { levelRange: '401+', str: 2200, agi: 300, vit: 250, ene: 20 },
        ],
        constellation: [],
        sets: [],
      },
      {
        name: 'ENE',
        runes: ['Runa de Aura de Resistência', 'Runa de Vitalidade Aumentada', 'Runa de Escudo Refletor'],
        skills: ['Swell Life', 'Great Fortitude', 'Defensive Aura'],
        properties: ['HP Máximo: +25%', 'Defesa: +15%', 'Redução de Dano: 10%'],
        config: [
            { levelRange: '1-200', str: 300, agi: 50, vit: 300, ene: 200 },
            { levelRange: '201-300', str: 500, agi: 50, vit: 500, ene: 400 },
            { levelRange: '301-400', str: 700, agi: 50, vit: 700, ene: 700 },
            { levelRange: '401+', str: 1000, agi: 50, vit: 1000, ene: 1000 },
        ],
        constellation: [],
        sets: [],
      },
    ],
  },
  {
    class: 'Elfa',
    subclasses: [
      {
        name: 'ENE',
        runes: ['Runa de Cura Abençoada', 'Runa de Escudo Divino', 'Runa de Aura de Dano'],
        skills: ['Greater Heal', 'Greater Defense', 'Greater Damage'],
        properties: ['Poder de Cura: +40%', 'Poder de Buff: +20%', 'Duração de Buff: +30s'],
        config: [
            { levelRange: '1-200', str: 100, agi: 100, vit: 100, ene: 600 },
            { levelRange: '201-300', str: 100, agi: 150, vit: 150, ene: 1000 },
            { levelRange: '301-400', str: 100, agi: 200, vit: 200, ene: 1600 },
            { levelRange: '401+', str: 100, agi: 300, vit: 200, ene: 2500 },
        ],
        constellation: [],
        sets: [],
      },
      {
        name: 'AGI',
        runes: ['Runa de Flecha de Gelo', 'Runa de Tiro Múltiplo', 'Runa de Precisão Élfica'],
        skills: ['Ice Arrow', 'Penetration', 'Multi-Shot'],
        properties: ['Velocidade de Ataque: +50', 'Dano a Distância: +25%', 'Chance de Congelar: 5%'],
        config: [
            { levelRange: '1-200', str: 150, agi: 600, vit: 100, ene: 20 },
            { levelRange: '201-300', str: 200, agi: 1000, vit: 150, ene: 20 },
            { levelRange: '301-400', str: 300, agi: 1600, vit: 200, ene: 20 },
            { levelRange: '401+', str: 400, agi: 2400, vit: 200, ene: 20 },
        ],
        constellation: [],
        sets: [],
      },
    ],
  },
  {
    class: 'Dark Lord',
    subclasses: [
      {
        name: 'STR',
        runes: ['Runa de Fúria do Lorde', 'Runa de Invocação de Corcel Sombrio', 'Runa de Terremoto'],
        skills: ['Fire Burst', 'Chaotic Diseier', 'Earthshake'],
        properties: ['Dano em Área: +20%', 'Dano Crítico: +50%', 'Dano do Pet: +15%'],
        config: [
            { levelRange: '1-200', str: 600, agi: 150, vit: 100, ene: 100 },
            { levelRange: '201-300', str: 1000, agi: 250, vit: 150, ene: 100 },
            { levelRange: '301-400', str: 1500, agi: 400, vit: 200, ene: 100 },
            { levelRange: '401+', str: 2000, agi: 500, vit: 200, ene: 100 },
        ],
        constellation: [],
        sets: [],
      },
      {
        name: 'ENE',
        runes: ['Runa de Aura de Comando', 'Runa de Espírito Protetor', 'Runa de Vínculo com Pet'],
        skills: ['Increase Critical Damage', 'Summon', 'Fire Scream'],
        properties: ['HP do Pet: +50%', 'Defesa do Pet: +30%', 'Dano recebido transferido para o Pet: 10%'],
        config: [
            { levelRange: '1-200', str: 200, agi: 100, vit: 100, ene: 500 },
            { levelRange: '201-300', str: 200, agi: 100, vit: 150, ene: 800 },
            { levelRange: '301-400', str: 300, agi: 100, vit: 200, ene: 1100 },
            { levelRange: '401+', str: 300, agi: 100, vit: 200, ene: 1500 },
        ],
        constellation: [],
        sets: [],
      },
    ],
  },
];
