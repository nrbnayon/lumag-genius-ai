import { apiSlice } from "../features/apiSlice";
import type { DashboardOverviewResponse } from "@/types/dashboard";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── GET DASHBOARD OVERVIEW ──────────────────────────────────────────────
    getDashboardOverview: builder.query<DashboardOverviewResponse, void>({
      query: () => "/api/dashboard/overview",
      providesTags: [{ type: "Dashboard", id: "OVERVIEW" }],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;
