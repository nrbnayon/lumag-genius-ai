export type RecipeStatus = "Approved" | "Pending";

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
  cost: string;
}

export interface Recipe {
  id: string;
  name: string;
  cookingTime: string;
  ingredientsCount: number;
  ingredients: RecipeIngredient[];
  cost: string;
  sellingPrice: string;
  status: RecipeStatus;
  instruction: string;
  image?: string;
}

export interface RecipeFormData {
  name: string;
  cookingTime: string;
  sellingPrice: string;
  instruction: string;
  ingredients: RecipeIngredient[];
  image: File | null;
}

export interface RecipeStats {
  totalRecipes: number;
  avgFoodCost: number;
  highMarginItems: number;
  pendingApproval: number;
}
