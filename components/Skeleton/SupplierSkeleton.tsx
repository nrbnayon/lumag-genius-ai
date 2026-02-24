"use client";

export function SupplierSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_0px_#A9A9A940] border-none flex flex-col gap-4 animate-pulse">
      <div className="h-6 w-3/4 bg-gray-100 rounded" />
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <div className="h-4 w-1/2 bg-gray-50 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <div className="h-4 w-1/2 bg-gray-50 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <div className="h-4 w-1/2 bg-gray-50 rounded" />
        </div>
      </div>
      <div className="mt-2 h-10 w-full bg-blue-50/50 rounded-xl" />
    </div>
  );
}

export function SupplierGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 2xl:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SupplierSkeleton key={i} />
      ))}
    </div>
  );
}
