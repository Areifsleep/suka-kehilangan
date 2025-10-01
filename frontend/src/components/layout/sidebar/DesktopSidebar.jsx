import { SidebarHeader } from "./SidebarHeader";
import { NavigationMenu } from "./NavigationMenu";
import { SidebarFooter } from "./SidebarFooter";

export const DesktopSidebar = ({ menu, collapsed, onToggle }) => {
  return (
    <aside
      className={`hidden lg:flex fixed left-0 top-0 h-screen flex-col bg-white border-r shadow-sm transition-all duration-200 z-40 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggle={onToggle}
      />

      <NavigationMenu
        menu={menu}
        collapsed={collapsed}
      />

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
};
