export interface ResourcesData {
  uniqueName: string;
  name: string;
  description: string;
  codexSecret: boolean;
  parentName: string;
  excludeFromCodex?: boolean;
  longDescription?: string;
}