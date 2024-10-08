export type WeaponsData = {
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
};
