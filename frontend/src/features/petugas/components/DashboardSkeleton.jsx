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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col flex-1 space-y-3">
          <SkeletonLine width="w-24" height="h-4" />
          <SkeletonLine width="w-16" height="h-8" />
        </div>
        <SkeletonBox width="w-14" height="h-14" />
      </div>
    </div>
  );
}

// Skeleton for Chart Card
function ChartCardSkeleton({ title }) {
  return (
    <Card className="shadow-sm border">
      <CardContent className="p-6">
        <div className="mb-4">
          <SkeletonLine width="w-48" height="h-6" />
        </div>
        <SkeletonBox width="w-full" height="h-64" />
      </CardContent>
    </Card>
  );
}

// Skeleton for Activity Item
function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-white hover:bg-gray-50 transition-colors">
      <SkeletonCircle size="w-10 h-10" />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="w-3/4" height="h-4" />
        <SkeletonLine width="w-full" height="h-3" />
        <SkeletonLine width="w-32" height="h-3" />
      </div>
    </div>
  );
}

// Main Dashboard Skeleton
export function DashboardSkeleton() {
  return (
    <>
      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Charts Section - Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCardSkeleton title="Distribusi per Kategori" />
        <ChartCardSkeleton title="Distribusi per Lokasi" />
      </div>

      {/* Charts Section - Bottom Row */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <ChartCardSkeleton title="Trend Barang Temuan" />
      </div>

      {/* Recent Activities Skeleton */}
      <Card className="shadow-sm border">
        <CardContent className="p-6">
          <div className="mb-4">
            <SkeletonLine width="w-40" height="h-6" />
          </div>
          <div className="space-y-1">
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
