import { levelStats } from "./LevelStats";

export interface UpgradesData {
  uniqueName: string;
  name: string;
  polarity: string;
  rarity: string;
  codexSecret: boolean;
  baseDrain: number;
  fusionLimit: number;
  compatName?: string;
  type?: string;
  description?: string[];
  excludeFromCodex?: boolean;
  levelStats?: levelStats[];
  subtype?: string;
  upgradeEntries?: UpgradeEntries[];
  availableChallenges?: Challenges[];
}

export interface UpgradeEntries {
  tag: string;
  prefixTag: string;
  suffixTag: string;
  upgradeValues: UpgradeValues[];
}

export type UpgradeValues = {
  value: number;
  locTag?: string;
};

export interface Challenges {
  fullName: string;
  description: string;
  complications: Complications[];
}

export type Complications = {
  fullName: string;
  description: string;
  overrideTag?: string;
};
