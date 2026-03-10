// redux/services/categoriesApi.ts
import { apiSlice } from "../features/apiSlice";
import type {
  GetAllCategoriesResponse,
  SingleCategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryResponse,
} from "@/types/categories.types";

export const categoriesApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. GET ALL CATEGORIES ────────────────────────────────────────────────
    getAllCategories: builder.query<GetAllCategoriesResponse, void>({
      query: () => "/api/ingredients/categories",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Categories" as const, id })),
              { type: "Categories", id: "LIST" },
            ]
          : [{ type: "Categories", id: "LIST" }],
    }),

    // ── 2. CREATE CATEGORY ───────────────────────────────────────────────────
    createCategory: builder.mutation<SingleCategoryResponse, CreateCategoryRequest>({
      query: (body) => ({
        url: "/api/ingredients/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }], // Invalidate the list to re-fetch
    }),

    // ── 3. UPDATE CATEGORY ───────────────────────────────────────────────────
    updateCategory: builder.mutation<SingleCategoryResponse, UpdateCategoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/ingredients/categories/${id}`,
        method: "PATCH",
        body,
      }),
      // Invalidate the specific item and the list
      invalidatesTags: (result, error, { id }) => [
        { type: "Categories", id },
        { type: "Categories", id: "LIST" },
      ],
    }),

    // ── 4. DELETE CATEGORY ───────────────────────────────────────────────────
    deleteCategory: builder.mutation<DeleteCategoryResponse, number>({
      query: (id) => ({
        url: `/api/ingredients/categories/${id}`,
        method: "DELETE",
      }),
      // Invalidate the specific item and the list
      invalidatesTags: (result, error, id) => [
        { type: "Categories", id },
        { type: "Categories", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
