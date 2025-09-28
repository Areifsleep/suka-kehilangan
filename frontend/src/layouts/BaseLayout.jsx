import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { FiMenu, FiSettings, FiLogOut } from "react-icons/fi";

import { useAuth } from "@/contexts/AuthContext";
import { LogoDashboard } from "@/components/user-management/LogoDashboard";

export const BaseLayout = ({ menu = [] }) => {
  if (menu.length === 0) {
    throw new Error("Menu tidak boleh kosong. Silakan tambahkan item menu.");
  }

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (key) => {
    return location.pathname === key;
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen flex flex-col bg-white border-r shadow-sm transition-all duration-200 z-40 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          {!collapsed && <LogoDashboard />}

          <button
            className="p-2 rounded hover:bg-gray-100"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="toggle sidebar"
          >
            <FiMenu />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menu.map((m) => {
            return (
              <Link
                key={m.key}
                to={m.key}
                className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 ${
                  isActive(m.key) ? "bg-green-200 text-black" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <span className="text-xl">{m.icon && typeof m.icon === "function" ? <m.icon /> : m.icon}</span>
                {!collapsed && <span className="font-medium">{m.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t flex-shrink-0 bg-white">
          <Link
            to="/settings"
            className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg transition-colors duration-150 ${
              location.pathname.startsWith("/settings") ? "bg-green-200 text-black" : "text-gray-700 hover:bg-green-100"
            }`}
          >
            <FiSettings className="text-xl" /> {!collapsed && <span>Settings</span>}
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-green-100 mt-2"
          >
            <FiLogOut className="text-xl" /> {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-200 ${collapsed ? "ml-16" : "ml-64"}`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
