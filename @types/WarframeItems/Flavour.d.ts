export interface FlavourData {
  uniqueName: string;
  name: string;
  description: string;
  codexSecret: boolean;
  excludeFromCodex?: boolean;
  hexColours?: { value: string }[];
}