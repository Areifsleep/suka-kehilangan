import { cn } from "@/lib/utils";
import { Outlet } from "react-router";

export const MainContent = ({ collapsed }) => {
  return (
    <main className={cn("flex-1 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8 transition-all duration-200 overflow-x-hidden", collapsed ? "lg:ml-16" : "lg:ml-64")}>
      <div className="w-full max-w-7xl mx-auto">
        <Outlet />
      </div>
    </main>
  );
};
