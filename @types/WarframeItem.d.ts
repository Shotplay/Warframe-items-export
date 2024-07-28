export interface RelayData {
  uniqueName: string;
  name: string;
  systemName: string;
}

export interface CustomsData {
  uniqueName: string;
  name: string;
  codexSecret: boolean;
  description: string;
  excludeFromCodex?: boolean;
}

export interface DronesData {
  uniqueName: string;
  name: string;
  description: string;
  binCount: number;
  binCapacity: number;
  fillRate: number;
  durability: number;
  repairRate: number;
  codexSecret: boolean;
  capacityMultiplier: number[];
  specialities: [];
}

export interface FlavourData {
  uniqueName: string;
  name: string;
  description: string;
  codexSecret: boolean;
  excludeFromCodex?: boolean;
  hexColours?: { value: string }[];
}

export interface FusionBundlesData {
  uniqueName: string;
  description: string;
  codexSecret: boolean;
  fusionPoints: number;
}

export interface GearData {
  uniqueName: string;
  name: string;
  description: string;
  codexSecret: boolean;
  parentName: string;
}

export interface KeysData {
  uniqueName: string;
  name: string;
  description: string;
  parentName: string;
  codexSecret: boolean;
}

export interface ManifestData {
  uniqueName: string;
  textureLocation: string;
}

export interface RecipesData {
  uniqueName: string;
  resultType: string;
  buildPrice: number;
  buildTime: number;
  skipBuildTimePrice: number;
  consumeOnUse: boolean;
  num: number;
  codexSecret: boolean;
  excludeFromCodex?: boolean;
  ingredients: RecipesIngridientsData[];
  secretIngredients: [];
}

export interface RecipesIngridientsData {
  ItemType: string;
  ItemCount: number;
  ProductCategory: string;
}

export interface RegionsData {
  uniqueName: string;
  name: string;
  systemIndex: number;
  systemName: string;
  nodeType: number;
  masteryReq: number;
  missionIndex: number;
  factionIndex: number;
  minEnemyLevel: number;
  maxEnemyLevel: number;
}

export interface RelicArcaneData {
  uniqueName: string;
  name: string;
  codexSecret: boolean;
  description?: string;
  relicRewards?: RelicRewardsData[];
  rarity?: string;
  levelStats?: levelStatsData[];
}

export interface RelicRewardsData {
  rewardName: string;
  rarity: string;
  tier: number;
  itemCount: number;
}

export interface levelStatsData {
  stats: string[];
}

export interface ResourcesData {
  uniqueName: string;
  name: string;
  description: string;
  codexSecret: boolean;
  parentName: string;
  excludeFromCodex?: boolean;
  longDescription?: string;
}

export interface SentinelsData {
  uniqueName: string;
  name: string;
  health: number;
  shield: number;
  armor: number;
  stamina: number;
  power: number;
  codexSecret: boolean;
  excludeFromCodex?: boolean;
  description: string;
  productCaregory: string;
}

export interface SortieRewardsData {
  rewardName: string;
  rarity: string;
  tier: number;
  itemCount: number;
  probability: number;
}

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
  levelStats?: levelStatsData[];
  subtype?: string;
  upgradeEntries?: UpgradeEntriesData[];
  availableChallenges?: ChallengesData[];
}

export interface UpgradeEntriesData {
  tag: string;
  prefixTag: string;
  suffixTag: string;
  upgradeValues: UpgradeValues[];
}

export interface UpgradeValues {
  value: number;
  locTag?: string;
}

export interface ChallengesData {
  fullName: string;
  description: string;
  complications: ComplicationsData[];
}

export interface ComplicationsData {
  fullName: string;
  description: string;
  overrideTag?: string;
}

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
  abilities: AbilitiesData[];
  productCategory: string;
  longDescription?: string;
  passiveDescription?: string;
}

export interface AbilitiesData {
  abilityUniqueName: string;
  abilityName: string;
  description: string;
}

export interface WeaponsData {
  name: string;
  uniqueName: string;
  codexSecret: boolean;
  damagePerShot: number[];
  totalDamage: number;
  description: string;
  criticalChance: number;
  criticalMultiplier: number;
  procChance: number;
  fireRate: number;
  masteryReq: number;
  productCategory: string;
  slot?: number;
  accuracy?: number;
  omegaAttenuation: number;
  noise?: string;
  blockingAngle?: number;
  comboDuration?: number;
  followThrough?: number;
  range?: number;
  slamAttack?: number;
  slamRadialAttack?: number;
  slamRadius?: number;
  slideAttack?: number;
  heavyAttackDamage?: number;
  heavySlamAttack?: number;
  heavySlamRadialDamage?: number;
  heavySlamRaduis?: number;
  windUp?: number;
  trigger?: string;
  magazineSize?: number;
  reloadTime?: number;
  multishot?: number;
}