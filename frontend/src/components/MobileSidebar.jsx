import { SidebarHeader } from "./SidebarHeader";
import { NavigationMenu } from "./NavigationMenu";
import { SidebarFooter } from "./SidebarFooter";

export const MobileSidebar = ({ menu, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Sheet Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Mobile Sheet */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-80 flex flex-col bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarHeader
          isMobile={true}
          onClose={onClose}
        />

        <NavigationMenu
          menu={menu}
          onItemClick={onClose}
        />

        <SidebarFooter onItemClick={onClose} />
      </aside>
    </>
  );
};
