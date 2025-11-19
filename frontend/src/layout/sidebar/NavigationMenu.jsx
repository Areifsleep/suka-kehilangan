import { Link, useLocation } from "react-router";

export const NavigationMenu = ({ menu, collapsed = false, onItemClick }) => {
  const location = useLocation();

  const isActive = (key) => {
    return location.pathname === key;
  };

  return (
    <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
      {menu.map((m) => {
        return (
          <Link
            key={m.key}
            to={m.key}
            onClick={onItemClick}
            className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 ${
              isActive(m.key) ? "bg-green-200 text-black" : "text-gray-700 hover:bg-green-100"
            } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? m.label : undefined}
          >
            <span className="text-xl">{m.icon && typeof m.icon === "function" ? <m.icon /> : m.icon}</span>
            {!collapsed && <span className="font-medium">{m.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
};