import { apiSlice } from "../features/apiSlice";
import type { AnalyticsResponse } from "@/types/analytics";

export const analyticsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ── GET ANALYTICS OVERVIEW ──────────────────────────────────────────────
    getAnalyticsOverview: builder.query<AnalyticsResponse, void>({
      query: () => "/api/dashboard/analytics",
      providesTags: [{ type: "Analytics", id: "OVERVIEW" }],
    }),
  }),
});

export const { useGetAnalyticsOverviewQuery } = analyticsApi;
