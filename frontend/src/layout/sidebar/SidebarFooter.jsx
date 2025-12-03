import { Link, useLocation } from "react-router";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

export const SidebarFooter = ({ collapsed = false, onItemClick }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    onItemClick?.();
  };

  // Generate initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const fullName = user?.full_name || "User";
  const initials = getInitials(fullName);

  return (
    <div className="border-t flex-shrink-0 bg-white">
      {/* User Info Section */}
      <div className={`px-3 py-4 border-b ${collapsed ? "flex justify-center" : ""}`}>
        {collapsed ? (
          <div
            className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-sm"
            title={fullName}
          >
            {initials}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.nim || user?.nip || user?.email || ""}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-3 py-4">
        <Link
          to="/settings"
          onClick={onItemClick}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-150 ${
            location.pathname.startsWith("/settings") ? "bg-green-200 text-black" : "text-gray-700 hover:bg-green-100"
          } ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Pengaturan" : undefined}
        >
          <FiSettings className="text-xl" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-green-100 mt-2 ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <FiLogOut className="text-xl" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};
