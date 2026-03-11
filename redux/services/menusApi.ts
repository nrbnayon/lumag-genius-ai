import { apiSlice } from "../features/apiSlice";
import type {
  PaginatedMenusResponse,
  MenusApiResponse,
  MenuFormData,
  DishesResponse,
  DishResponse,
  Dish,
} from "@/types/menu";

interface GetMenusParams {
  page?: number;
  page_size?: number;
  search_term?: string;
}

export const menusApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── 1. GET ALL MENUS (Paginated / Searched) ──────────────────────────
    getAllMenus: builder.query<PaginatedMenusResponse, GetMenusParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.page_size) queryParams.append("page_size", params.page_size.toString());
        if (params.search_term) queryParams.append("search_term", params.search_term);
        
        return `/api/menus?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Menus" as const, id })),
              { type: "Menus", id: "LIST" },
            ]
          : [{ type: "Menus", id: "LIST" }],
    }),

    // ── 2. CREATE MENUS (Single or Bulk) ──────────────────────────────────
    createMenus: builder.mutation<MenusApiResponse, MenuFormData[]>({
      query: (body) => ({
        url: "/api/menus",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Menus", id: "LIST" }],
    }),

    // ── 3. UPDATE MENUS (Bulk) ──────────────────────────────────
    updateMenus: builder.mutation<MenusApiResponse, Partial<MenuFormData>[]>({
      query: (body) => ({
        url: "/api/menus",
        method: "POST", // Bulk edit via POST as requested
        body,
      }),
      invalidatesTags: (result, error, args) => [
        ...args.filter(m => m.id).map(({ id }) => ({ type: "Menus" as const, id: id! })),
        { type: "Menus", id: "LIST" },
      ],
    }),

    // ── 3.1 UPDATE MENU (Single) ──────────────────────────────────
    updateMenu: builder.mutation<DishResponse, { id: number; data: MenuFormData }>({
      query: ({ id, data }) => ({
        url: `/api/menus/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Menus", id }, { type: "Menus", id: "LIST" }],
    }),

    // ── 4. DELETE MENU ───────────────────────────────────────────────────
    deleteMenu: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/menus/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Menus", id },
        { type: "Menus", id: "LIST" },
      ],
    }),

    // ── 5. GET ALL DISHES ────────────────────────────────────────────────
    getDishes: builder.query<DishesResponse, void>({
      query: () => "/api/menus/dishes",
      providesTags: ["Menus"], // Overlapping tags for simplicity or separate if needed
    }),

    // ── 6. CREATE DISH ───────────────────────────────────────────────────
    createDish: builder.mutation<DishResponse, { name: string }>({
      query: (body) => ({
        url: "/api/menus/dishes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Menus"],
    }),

    // ── 7. DELETE DISH ───────────────────────────────────────────────────
    deleteDish: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/menus/dishes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Menus"],
    }),
  }),
});

export const {
  useGetAllMenusQuery,
  useCreateMenusMutation,
  useUpdateMenusMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetDishesQuery,
  useCreateDishMutation,
  useDeleteDishMutation,
} = menusApi;
