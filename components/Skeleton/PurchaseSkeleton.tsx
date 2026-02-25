"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PurchaseTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2 mb-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_16px_0px_#A9A9A940] overflow-hidden">
        <div className="w-full h-12 bg-gray-50 flex items-center px-4 gap-4 mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center px-4 py-3 gap-4 border-b border-gray-100 last:border-0"
            >
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PurchaseSkeleton() {
  return (
    <div className="pb-10">
      <div className="p-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-8 w-48" />
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Skeleton className="h-10 w-72 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>

        {/* Tables Skeletons */}
        <div className="space-y-12">
          <PurchaseTableSkeleton />
          <PurchaseTableSkeleton />
        </div>
      </div>
    </div>
  );
}
