export interface SubClass {
  name: string;
  runes: string[];
  skills: string[];
  properties: string[];
  config: string[];
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
        config: ['Pontos em Energia: 2000', 'Pontos em Agilidade: 400', 'Pontos em Vitalidade: 600', 'Pontos em Força: Base'],
      },
      {
        name: 'AGI',
        runes: ['Runa de Teleporte Rápido', 'Runa de Escudo de Mana Veloz', 'Runa de Reflexos'],
        skills: ['Aqua Beam', 'Teleport', 'Soul Barrier'],
        properties: ['Taxa de Defesa: +500', 'Velocidade de Ataque: +20', 'Evasão: 15%'],
        config: ['Pontos em Agilidade: 1800', 'Pontos em Energia: 800', 'Pontos em Vitalidade: 400', 'Pontos em Força: Base'],
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
        config: ['Pontos em Força: 2200', 'Pontos em Agilidade: 300', 'Pontos em Vitalidade: 500', 'Pontos em Energia: Base'],
      },
      {
        name: 'ENE',
        runes: ['Runa de Aura de Resistência', 'Runa de Vitalidade Aumentada', 'Runa de Escudo Refletor'],
        skills: ['Swell Life', 'Great Fortitude', 'Defensive Aura'],
        properties: ['HP Máximo: +25%', 'Defesa: +15%', 'Redução de Dano: 10%'],
        config: ['Pontos em Energia: 1000', 'Pontos em Força: 1000', 'Pontos em Vitalidade: 1000', 'Pontos em Agilidade: Base'],
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
        config: ['Pontos em Energia: 2500', 'Pontos em Agilidade: 300', 'Pontos em Vitalidade: 200', 'Pontos em Força: Base'],
      },
      {
        name: 'AGI',
        runes: ['Runa de Flecha de Gelo', 'Runa de Tiro Múltiplo', 'Runa de Precisão Élfica'],
        skills: ['Ice Arrow', 'Penetration', 'Multi-Shot'],
        properties: ['Velocidade de Ataque: +50', 'Dano a Distância: +25%', 'Chance de Congelar: 5%'],
        config: ['Pontos em Agilidade: 2400', 'Pontos em Força: 400', 'Pontos em Vitalidade: 200', 'Pontos em Energia: Base'],
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
        config: ['Pontos em Força: 2000', 'Pontos em Agilidade: 500', 'Pontos em Comando: 300', 'Pontos em Vitalidade: 200'],
      },
      {
        name: 'ENE',
        runes: ['Runa de Aura de Comando', 'Runa de Espírito Protetor', 'Runa de Vínculo com Pet'],
        skills: ['Increase Critical Damage', 'Summon', 'Fire Scream'],
        properties: ['HP do Pet: +50%', 'Defesa do Pet: +30%', 'Dano recebido transferido para o Pet: 10%'],
        config: ['Pontos em Energia: 1500', 'Pontos em Comando: 1000', 'Pontos em Força: 300', 'Pontos em Vitalidade: 200'],
      },
    ],
  },
];
