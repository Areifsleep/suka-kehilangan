import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/utils/initials";

export const HeaderDashboard = ({ title = "dashboard", subtitle }) => {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex-1">
        <h2 className="relative w-max text-lg font-semibold pb-2">
          {title}
          <span className="absolute bottom-0 left-0 h-[4px] w-full rounded-full bg-green-700"></span>
        </h2>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 hidden md:block">
          {user.full_name ? user.full_name : "Nama Seorang Admin"}
        </div>
        <Avatar className="size-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-800">
          {getInitials(user.full_name)}
        </Avatar>
      </div>
    </header>
  );
};
