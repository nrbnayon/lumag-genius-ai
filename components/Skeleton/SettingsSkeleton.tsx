"use client";

function PulseBlock({ className }: { className: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

export function SettingsSkeleton() {
  return (
    <div className="pb-10 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="bg-white py-4 px-4 md:px-8 border-b border-border flex justify-between items-center">
        <div className="space-y-2">
          <PulseBlock className="h-8 w-32 md:w-48" />
          <PulseBlock className="h-4 w-48 md:w-64" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <PulseBlock className="w-10 h-10 rounded-full" />
          <div className="flex items-center gap-3">
            <PulseBlock className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <PulseBlock className="h-4 w-20" />
              <PulseBlock className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 md:px-8 space-y-6 mx-auto mt-5">
        {/* Account Information Section Skeleton */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <PulseBlock className="h-6 w-44" />
              <PulseBlock className="h-4 w-32" />
            </div>
            <PulseBlock className="w-8 h-8 rounded-lg" />
          </div>
          <div className="pt-6 border-t border-gray-100 space-y-6">
            {/* Profile Image Skeleton */}
            <div className="flex items-center gap-6">
              <PulseBlock className="w-24 h-24 rounded-full" />
              <div className="space-y-2">
                <PulseBlock className="h-10 w-32 rounded-xl" />
                <PulseBlock className="h-3 w-48" />
              </div>
            </div>
            <div className="grid gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <PulseBlock className="h-4 w-24" />
                  <PulseBlock className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Section Skeleton */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <PulseBlock className="h-6 w-24" />
              <PulseBlock className="h-4 w-48" />
            </div>
            <PulseBlock className="w-8 h-8 rounded-lg" />
          </div>
          <div className="pt-6 border-t border-gray-100 space-y-6">
            <div className="space-y-2">
              <PulseBlock className="h-4 w-24" />
              <PulseBlock className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Language Section Skeleton */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <PulseBlock className="h-6 w-24" />
              <PulseBlock className="h-4 w-48" />
            </div>
            <PulseBlock className="w-8 h-8 rounded-lg" />
          </div>
          <div className="pt-6 border-t border-gray-100 space-y-6">
            <div className="space-y-2">
              <PulseBlock className="h-4 w-32" />
              <PulseBlock className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
