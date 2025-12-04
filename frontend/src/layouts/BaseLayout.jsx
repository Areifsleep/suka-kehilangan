import { useState } from "react";
import { MobileHeader, MobileSidebar, DesktopSidebar, MainContent } from "@/layout";
import { useLayoutStore } from "@/stores/layoutStore";

export const BaseLayout = ({ menu = [] }) => {
  if (menu.length === 0) {
    throw new Error("Menu tidak boleh kosong. Silakan tambahkan item menu.");
  }

  const { collapsed, toggleCollapsed } = useLayoutStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleDesktopSidebarToggle = () => {
    toggleCollapsed();
  };

  return (
    <div className="min-h-screen flex">
      <MobileHeader onMenuToggle={handleMobileMenuToggle} />

      <MobileSidebar
        menu={menu}
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      />

      <DesktopSidebar
        menu={menu}
        collapsed={collapsed}
        onToggle={handleDesktopSidebarToggle}
      />

      <MainContent collapsed={collapsed} />
    </div>
  );
};
