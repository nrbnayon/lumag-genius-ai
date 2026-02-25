"use client";

import { cn } from "@/lib/utils";

export function StaffSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_0px_#A9A9A940] border-none animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-16 h-3 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded bg-gray-100" />
          <div className="w-8 h-8 rounded bg-gray-100" />
          <div className="w-8 h-8 rounded bg-gray-100" />
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <div className="w-12 h-3 bg-gray-100 rounded" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-between items-center">
          <div className="w-12 h-3 bg-gray-100 rounded" />
          <div className="w-32 h-3 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-full h-10 bg-gray-100 rounded-full" />
    </div>
  );
}

export function StaffGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <StaffSkeleton key={i} />
      ))}
    </div>
  );
}
