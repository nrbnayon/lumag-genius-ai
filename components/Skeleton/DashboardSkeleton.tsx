"use client";

export function DashboardSkeleton() {
  return (
    <div className="pb-10 animate-pulse">
      {/* Header skeleton */}
      <div className="px-4 md:px-8 pt-6 pb-4 border-b border-gray-100">
        <div className="h-7 w-52 bg-gray-200 rounded-lg mb-2" />
        <div className="h-4 w-80 bg-gray-100 rounded-lg" />
      </div>

      <main className="p-4 md:p-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white px-5 py-5 rounded-xl shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                  <div className="h-9 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-36 bg-gray-100 rounded mt-1" />
                </div>
                <div className="w-14 h-14 bg-gray-200 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]"
            >
              <div className="mb-6">
                <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-52 bg-gray-100 rounded" />
              </div>
              <div className="h-[350px] w-full bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Budget Recipes */}
          <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
            <div className="mb-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-gray-200" />
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
            <div className="mb-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-44 bg-gray-100 rounded" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full" />
                    <div className="h-4 w-52 bg-gray-200 rounded" />
                  </div>
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
