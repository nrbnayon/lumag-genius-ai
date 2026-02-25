"use client";

// Reusable primitive pulse block
function PulseBlock({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

// ── Stats Card Skeleton ──────────────────────────────────────────────────────
function StatsCardSkeleton() {
  return (
    <div className="bg-white px-5 py-5 rounded-xl flex items-start justify-between shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col gap-3 flex-1">
        <PulseBlock className="h-4 w-28" />
        <PulseBlock className="h-8 w-16" />
        <div className="flex items-center gap-2 mt-1">
          <PulseBlock className="h-3 w-3 rounded-full" />
          <PulseBlock className="h-3 w-32" />
        </div>
      </div>
      <PulseBlock className="w-14 h-14 rounded-2xl" />
    </div>
  );
}

// ── Chart Card Skeleton ──────────────────────────────────────────────────────
function ChartCardSkeleton({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <PulseBlock className="h-5 w-48" />
        <PulseBlock className="h-4 w-36" />
      </div>
      {/* Chart area */}
      <div
        className={`${height} w-full bg-gray-100 rounded-xl animate-pulse relative overflow-hidden`}
      >
        {/* Fake Y-axis ticks */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4 pl-2 gap-0">
          {[...Array(5)].map((_, i) => (
            <PulseBlock key={i} className="h-3 w-10 bg-gray-200" />
          ))}
        </div>
        {/* Fake line wave */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg
            viewBox="0 0 300 100"
            className="w-4/5 h-3/4"
            preserveAspectRatio="none"
          >
            <polyline
              points="0,70 60,50 120,57 180,35 240,40 300,28"
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="3"
            />
            <polyline
              points="0,85 60,80 120,75 180,72 240,68 300,60"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <PulseBlock className="w-2 h-2 rounded-full" />
            <PulseBlock className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── List Panel Skeleton (Budget Recipes / Menus) ─────────────────────────────
function ListPanelSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)]">
      {/* Header */}
      <div className="mb-5 space-y-2">
        <PulseBlock className="h-5 w-44" />
        <PulseBlock className="h-3 w-32" />
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <PulseBlock className="w-7 h-7 rounded-full" />
              <PulseBlock className="h-4 w-36" />
            </div>
            <div className="text-right space-y-1">
              <PulseBlock className="h-4 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Table Skeleton ───────────────────────────────────────────────────────────
function AnalyticsTableSkeleton({
  cols = 5,
  rows = 5,
  title,
}: {
  cols?: number;
  rows?: number;
  title?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_16px_0px_rgba(169,169,169,0.25)] overflow-hidden">
      {title && (
        <div className="p-6 pb-4 space-y-2">
          <PulseBlock className="h-5 w-56" />
          <PulseBlock className="h-3 w-28" />
        </div>
      )}
      <div className="overflow-x-auto">
        {/* Header row */}
        <div className="bg-[#EBF5FF] px-6 py-4 flex gap-4">
          {[...Array(cols)].map((_, i) => (
            <PulseBlock key={i} className="h-4 flex-1 bg-blue-100" />
          ))}
        </div>
        {/* Data rows */}
        <div className="divide-y divide-gray-50">
          {[...Array(rows)].map((_, r) => (
            <div key={r} className="px-6 py-4 flex gap-4">
              {[...Array(cols)].map((_, c) => (
                <PulseBlock
                  key={c}
                  className={`h-4 flex-1 ${c === 0 ? "bg-gray-300" : "bg-gray-200"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Full Analytics Page Skeleton ─────────────────────────────────────────────
export function AnalyticsSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Stats row – 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Revenue & Cost Trend + Top Budget Recipes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardSkeleton height="h-[300px]" />
        <ListPanelSkeleton rows={6} />
      </div>

      {/* Staff Attendance Trend + Top Budget Menus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCardSkeleton height="h-[280px]" />
        <ListPanelSkeleton rows={5} />
      </div>

      {/* Monthly Financial Summary table */}
      <AnalyticsTableSkeleton cols={5} rows={5} title />

      {/* Individual Staff Performance table */}
      <AnalyticsTableSkeleton cols={4} rows={5} title />
    </div>
  );
}
