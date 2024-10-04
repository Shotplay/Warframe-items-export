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
  ingredients: RecipesIngridients[];
  secretIngredients: [];
}

export interface RecipesIngridients {
  ItemType: string;
  ItemCount: number;
  ProductCategory: string;
}
