import { Link, useLocation } from "react-router";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";

export const SidebarFooter = ({ collapsed = false, onItemClick }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onItemClick?.();
  };

  return (
    <div className="px-3 py-4 border-t flex-shrink-0 bg-white">
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
        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-green-100 mt-2 ${
          collapsed ? "justify-center" : ""
        }`}
        title={collapsed ? "Logout" : undefined}
      >
        <FiLogOut className="text-xl" />
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
};