"use client";

import { cn } from "@/lib/utils";

export function RecipeSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col gap-4 relative animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 bg-gray-100 rounded-full" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-3/4 bg-gray-100 rounded" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-gray-50 rounded" />
            <div className="h-4 w-12 bg-gray-50 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-gray-50 rounded" />
            <div className="h-4 w-12 bg-gray-50 rounded" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 w-16 bg-gray-100 rounded" />
            <div className="h-5 w-12 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <RecipeSkeleton key={i} />
      ))}
    </div>
  );
}
