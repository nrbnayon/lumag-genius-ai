// types/categories.types.ts

// Base category object from API
export interface Category {
  id: number;
  name: string;
}

// Reusable standard response wrapper
export interface CategoryApiResponse<T> {
  message: string;
  data: T;
}

// Request bodies
export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  id: number;
  name: string;
}

// Combined types for ease of use
export type GetAllCategoriesResponse = CategoryApiResponse<Category[]>;
export type SingleCategoryResponse = CategoryApiResponse<Category>;
export type DeleteCategoryResponse = CategoryApiResponse<null>;
