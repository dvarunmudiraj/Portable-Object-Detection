
import { useAuth } from "@/contexts/AuthContext";
import { Camera, ChevronLeft, Home, LogOut, UploadCloud, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Live Detection", path: "/live-detection", icon: <Camera className="h-5 w-5" /> },
    { name: "Upload Image", path: "/upload", icon: <UploadCloud className="h-5 w-5" /> },
  ];

  // For mobile: sidebar is a drawer that slides from left
  // For desktop: sidebar is always visible but can be collapsed
  const sidebarClass = cn(
    "bg-white flex flex-col h-screen border-r border-slate-200 transition-all duration-300 z-20",
    isMobile
      ? "fixed top-0 left-0 w-64 transform" // Mobile styling
      : "relative", // Desktop styling
    isMobile && isOpen 
      ? "translate-x-0" 
      : isMobile && !isOpen 
        ? "-translate-x-full"
        : isOpen 
          ? "w-64" 
          : "w-20"
  );

  return (
    <aside className={sidebarClass}>
      {/* Header */}
      <div className="flex items-center h-16 px-4 border-b border-slate-200">
        {(isOpen || isMobile) ? (
          <div className="flex items-center justify-between w-full">
            <span className="font-bold text-xl">VisionDetect</span>
            {isMobile ? (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex justify-center w-full">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <span className="font-bold text-lg">V</span>
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors",
                    isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-slate-700"
                  )
                }
              >
                {item.icon}
                {(isOpen || isMobile) && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3 w-full hover:bg-slate-100 transition-colors"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          {(isOpen || isMobile) && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;