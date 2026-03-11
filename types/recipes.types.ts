export interface RecipeIngredient {
  id?: number;
  ingredient: string;
  quantity: string | number;
  unit: string;
  cost: string | number;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string | null;
  avg_time: number;
  instruction: string;
  selling_cost: string;
  total_cost: string;
  outlet_type: "bar" | "restaurant" | string;
  approval_status: "approved" | "rejected" | "pending" | string;
  approved_by?: string | null;
  approved_at?: string | null;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  ingredients: RecipeIngredient[];
}

export interface PaginatedRecipesResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: Recipe[];
}

export interface RecipesApiResponse {
  message: string;
  data: Recipe[];
}

export interface SingleRecipeApiResponse {
  message: string;
  data: Recipe;
}

export interface RecipeIngredientPayload {
  id?: number; // Backend supports passing IDs during update
  ingredient: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface CreateRecipePayload {
  name: string;
  description?: string;
  avg_time: number;
  instruction: string;
  selling_cost: number;
  outlet_type: string;
  ingredients: RecipeIngredientPayload[];
}

export interface UpdateRecipePayload extends Partial<CreateRecipePayload> {
  id: number;
}

export interface ApproveRejectRecipePayload {
  action: "approved" | "rejected";
}
