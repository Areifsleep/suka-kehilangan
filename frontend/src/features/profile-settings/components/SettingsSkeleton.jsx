import { Card, CardContent } from "@/components/ui/card";

const SkeletonLine = ({ width = "w-full", height = "h-4" }) => <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>;

const SkeletonButton = ({ width = "w-24", height = "h-10" }) => <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>;

const SkeletonInput = () => <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>;

export const SettingsSkeleton = () => {
  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Profile Card Skeleton */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <SkeletonLine
              width="w-32"
              height="h-6"
            />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mt-4">
              {/* Profile Photo Skeleton */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full animate-pulse"></div>
              </div>

              {/* Profile Info Skeleton */}
              <div className="flex-1 text-center md:text-left w-full">
                <SkeletonLine
                  width="w-48"
                  height="h-6"
                />

                <div className="space-y-2 mt-3">
                  <SkeletonLine
                    width="w-64"
                    height="h-4"
                  />
                  <SkeletonLine
                    width="w-56"
                    height="h-4"
                  />
                  <SkeletonLine
                    width="w-72"
                    height="h-4"
                  />
                  <SkeletonLine
                    width="w-80"
                    height="h-4"
                  />
                  <SkeletonLine
                    width="w-60"
                    height="h-4"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload Skeleton */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <SkeletonLine
              width="w-24"
              height="h-6"
            />

            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <SkeletonButton width="w-32" />
                <SkeletonButton width="w-28" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form Skeleton */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <SkeletonLine
              width="w-32"
              height="h-6"
            />

            <div className="space-y-4 sm:space-y-6 mt-4">
              {/* Form Fields */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4"
                >
                  <div className="sm:col-span-4 flex items-center">
                    <SkeletonLine
                      width="w-16"
                      height="h-4"
                    />
                  </div>
                  <div className="sm:col-span-8">
                    <SkeletonInput />
                  </div>
                </div>
              ))}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <SkeletonButton width="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Skeleton */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <SkeletonLine
              width="w-40"
              height="h-6"
            />

            <div className="space-y-4 sm:space-y-6 mt-4">
              {/* Password Fields */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4"
                >
                  <div className="sm:col-span-4 flex items-center">
                    <SkeletonLine
                      width="w-20"
                      height="h-4"
                    />
                  </div>
                  <div className="sm:col-span-8">
                    <SkeletonInput />
                  </div>
                </div>
              ))}

              {/* Last Updated Info */}
              <div className="text-sm text-gray-500">
                <SkeletonLine
                  width="w-48"
                  height="h-4"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <SkeletonButton width="w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
