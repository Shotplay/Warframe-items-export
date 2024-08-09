export interface WarframesData {
  uniqueName: string;
  name: string;
  parentName: string;
  description: string;
  health: number;
  shield: number;
  armor: number;
  stamina: number;
  power: number;
  codexSecret: boolean;
  masteryReq: number;
  sprintSpeed: number;
  abilities: Abilities[];
  productCategory: string;
  longDescription?: string;
  passiveDescription?: string;
}

export type Abilities = {
  abilityUniqueName: string;
  abilityName: string;
  description: string;
};
