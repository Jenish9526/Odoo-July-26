import React from 'react';

const DashboardSkeleton = () => {
  // Let's create an array of 10 items for the Stats cards skeleton
  const statSkeletons = Array.from({ length: 10 });
  // Let's create an array of 6 items for the Widgets skeleton
  const widgetSkeletons = Array.from({ length: 6 });

  return (
    <div className="space-y-6 animate-pulse font-sans w-full">
      {/* Page Header skeleton */}
      <div className="flex justify-between items-center flex-wrap gap-4 pb-5 border-b border-gray-100 dark:border-dark-border/40">
        <div className="space-y-2">
          <div className="h-6 w-56 bg-gray-200 dark:bg-dark-border rounded"></div>
          <div className="h-3.5 w-80 bg-gray-100 dark:bg-dark-border/50 rounded"></div>
        </div>
        <div className="h-8 w-44 bg-gray-200 dark:bg-dark-border rounded-lg"></div>
      </div>

      {/* Stats Cards grid skeleton (10 items) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statSkeletons.map((_, idx) => (
          <div
            key={idx}
            className="glass-card rounded-xl p-5 border-glow flex flex-col justify-between min-h-[160px]"
          >
            <div className="flex justify-between items-start">
              <div className="h-3 w-16 bg-gray-200 dark:bg-dark-border rounded"></div>
              <div className="w-7 h-7 bg-gray-100 dark:bg-dark-border/50 rounded-lg"></div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-6 w-24 bg-gray-200 dark:bg-dark-border rounded"></div>
              <div className="h-8 w-full bg-gray-100 dark:bg-dark-border/30 rounded mt-3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets & Timeline grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - 4 Widgets */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {widgetSkeletons.map((_, idx) => (
            <div
              key={idx}
              className="glass-card rounded-xl p-5 border-glow min-h-[220px] flex flex-col justify-between"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 bg-gray-200 dark:bg-dark-border rounded"></div>
                <div className="h-3 w-12 bg-gray-100 dark:bg-dark-border/50 rounded"></div>
              </div>
              <div className="space-y-3 my-4 flex-1 justify-center flex flex-col">
                <div className="h-4 w-full bg-gray-100 dark:bg-dark-border/40 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-100 dark:bg-dark-border/40 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-100 dark:bg-dark-border/40 rounded"></div>
              </div>
              <div className="h-3 w-20 bg-gray-200 dark:bg-dark-border rounded"></div>
            </div>
          ))}
        </div>

        {/* Right Column - Actions & Timeline skeleton */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-5 border-glow min-h-[220px] flex flex-col justify-between">
            <div className="h-3 w-24 bg-gray-200 dark:bg-dark-border rounded"></div>
            <div className="grid grid-cols-2 gap-2.5 my-4">
              <div className="h-16 bg-gray-100 dark:bg-dark-border/40 rounded-lg"></div>
              <div className="h-16 bg-gray-100 dark:bg-dark-border/40 rounded-lg"></div>
              <div className="h-16 bg-gray-100 dark:bg-dark-border/40 rounded-lg"></div>
              <div className="h-16 bg-gray-100 dark:bg-dark-border/40 rounded-lg"></div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5 border-glow min-h-[260px] flex flex-col justify-between">
            <div className="h-3 w-32 bg-gray-200 dark:bg-dark-border rounded"></div>
            <div className="space-y-4 my-4 flex-1">
              <div className="h-8 bg-gray-100 dark:bg-dark-border/40 rounded"></div>
              <div className="h-8 bg-gray-100 dark:bg-dark-border/40 rounded"></div>
              <div className="h-8 bg-gray-100 dark:bg-dark-border/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
