// types/ingredients.types.ts

export interface Ingredient {
  id: number;
  name: string;
  category: number; // This is the ID of the category
  category_name: string;
  outlet_type: string;
  unit: string;
  price_per_unit: string;
  current_stock: number;
  minimum_stock: number;
  is_special: boolean;
  status: string;
  approval_status: string;
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface PaginatedIngredientsResponse {
  message: string;
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  data: Ingredient[];
}

export interface IngredientsApiResponse {
  message: string;
  data: Ingredient[];
}

export interface SingleIngredientApiResponse {
  message: string;
  data: Ingredient;
}

export interface CreateIngredientPayload {
  name: string;
  category_id: number;
  unit: string;
  price_per_unit: string;
  current_stock: number;
  minimum_stock: number;
  outlet_type: string;
  is_special: boolean;
}

export interface UpdateIngredientPayload extends CreateIngredientPayload {
  id: number;
}

export interface ApproveRejectIngredientPayload {
  action: "approved" | "rejected";
}
