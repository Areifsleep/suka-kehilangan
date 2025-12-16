import { Card, CardContent } from "@/components/ui/card";

// Skeleton component helpers
const SkeletonLine = ({ width = "w-full", height = "h-4" }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>
);

const SkeletonCircle = ({ size = "w-12 h-12" }) => (
  <div className={`${size} bg-gray-200 rounded-full animate-pulse`}></div>
);

const SkeletonBox = ({ width = "w-full", height = "h-48" }) => (
  <div
    className={`${width} ${height} bg-gray-200 rounded-lg animate-pulse`}
  ></div>
);

// Skeleton for StatCard
function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <SkeletonLine width="w-20" height="h-3" />
        <SkeletonBox width="w-5" height="h-5" />
      </div>
      <div className="mt-4">
        <SkeletonLine width="w-16" height="h-8" />
      </div>
    </div>
  );
}

// Skeleton for Activity Item
function ActivityItemSkeleton() {
  return (
    <div className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0">
      <SkeletonBox width="w-10" height="h-10" />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="w-3/4" height="h-4" />
        <SkeletonLine width="w-full" height="h-3" />
        <SkeletonLine width="w-32" height="h-3" />
      </div>
    </div>
  );
}

// Main Admin Dashboard Skeleton
export function AdminDashboardSkeleton() {
  return (
    <>
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Trend Bulanan - Line Chart Skeleton */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <SkeletonLine width="w-48" height="h-5" />
            <div className="mt-4">
              <SkeletonBox width="w-full" height="h-72" />
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution - Doughnut Chart Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <SkeletonLine width="w-36" height="h-5" />
            <div className="mt-4 flex items-center justify-center">
              <SkeletonBox width="w-full" height="h-72" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution - Bar Chart Skeleton */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <SkeletonLine width="w-56" height="h-5" />
          <div className="mt-4">
            <SkeletonBox width="w-full" height="h-80" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities Skeleton */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-6">
          <SkeletonLine width="w-40" height="h-6" />
          <div className="space-y-4 mt-6">
            <ActivityItemSkeleton />
            <ActivityItemSkeleton />
            <ActivityItemSkeleton />
            <ActivityItemSkeleton />
            <ActivityItemSkeleton />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
