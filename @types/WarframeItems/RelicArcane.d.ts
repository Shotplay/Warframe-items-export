import { levelStats } from "./Upgrades";

export interface RelicArcaneData {
  uniqueName: string;
  name: string;
  codexSecret: boolean;
  description?: string;
  relicRewards?: RelicRewards[];
  rarity?: string;
  levelStats?: levelStats[];
}

export type RelicRewards = {
  rewardName: string;
  rarity: string;
  tier: number;
  itemCount: number;
}