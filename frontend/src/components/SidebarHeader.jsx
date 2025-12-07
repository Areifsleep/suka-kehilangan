import { FiMenu, FiX } from "react-icons/fi";
import { LogoDashboard } from "@/features/admin-management/components/user/LogoDashboard";

export const SidebarHeader = ({ collapsed = false, isMobile = false, onToggle, onClose }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
      {!collapsed && <LogoDashboard />}

      {isMobile ? (
        <div>
          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close mobile menu"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      ) : (
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={onToggle}
          aria-label="toggle sidebar"
        >
          <FiMenu />
        </button>
      )}
    </div>
  );
};
