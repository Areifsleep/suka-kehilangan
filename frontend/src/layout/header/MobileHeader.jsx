import { FiMenu } from "react-icons/fi";
import { LogoDashboard } from "@/features/admin-management/components/user/LogoDashboard";

export const MobileHeader = ({ onMenuToggle }) => {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-40 flex items-center justify-between px-4">
      <LogoDashboard />
      <div className="bg-[#035D37] rounded-full">
        <button
          className="p-2 rounded-lg  transition-colors"
          onClick={onMenuToggle}
          aria-label="Open mobile menu"
        >
          <FiMenu className="text-xl text-white " />
        </button>
      </div>
    </header>
  );
};
