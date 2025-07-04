
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;