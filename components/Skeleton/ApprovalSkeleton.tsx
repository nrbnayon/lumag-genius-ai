"use client";

import { cn } from "@/lib/utils";

export function ApprovalSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-[0px_4px_16px_0px_#A9A9A940] flex items-center justify-between animate-pulse">
      <div className="flex items-start gap-4 flex-1">
        <div className="w-10 h-10 rounded-lg bg-gray-200 shadow-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-16 h-5 bg-gray-200 rounded" />
            <div className="w-40 h-5 bg-gray-200 rounded" />
          </div>
          <div className="w-32 h-4 bg-gray-100 rounded" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-16 h-4 bg-gray-100 rounded" />
        <div className="flex items-center gap-3">
          <div className="w-24 h-9 bg-gray-100 rounded-lg" />
          <div className="w-24 h-9 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ApprovalListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <ApprovalSkeleton key={i} />
      ))}
    </div>
  );
}
