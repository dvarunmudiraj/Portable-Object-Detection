import { useAuth } from "@/contexts/AuthContext";
import { Bell, Menu, CheckCircle, XCircle, Users, Settings, User, UserCircle, ContactRound, Contact, Smile, Meh, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Notification } from "@/services/auth/utils";
import UpdateProfileForm from "@/components/profile/UpdateProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, getPendingUsers, getNotifications, markAllNotificationsAsRead, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Get pending users that need approval (only for admin)
  const pendingUsersCount = isAdmin 
    ? getPendingUsers().filter(user => user.status === "pending").length 
    : 0;
    
  // Get approved users with their names
  const approvedUsers = isAdmin
    ? getPendingUsers().filter(user => user.status === "approved")
    : [];

  // Update notifications when they change
  useEffect(() => {
    if (isAdmin) {
      setNotifications(getNotifications());
    }
  }, [isAdmin, getNotifications]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  };

  // Get the appropriate icon based on avatar type
  const getAvatarIcon = (avatarType: string) => {
    switch(avatarType) {
      case 'user': return <User className="h-5 w-5" />;
      case 'user-circle': return <UserCircle className="h-5 w-5" />;
      case 'contact': return <Contact className="h-5 w-5" />;
      case 'contact-round': return <ContactRound className="h-5 w-5" />;
      case 'smile': return <Smile className="h-5 w-5" />;
      case 'meh': return <Meh className="h-5 w-5" />;
      case 'frown': return <Frown className="h-5 w-5" />;
      case 'users': return <Users className="h-5 w-5" />;
      default: return user?.name.charAt(0).toUpperCase() || 'U';
    }
  }

  // Helper function to render avatar content
  const renderAvatarContent = () => {
    if (user?.avatar && user.avatar.startsWith("data:image")) {
      return <AvatarImage src={user.avatar} alt={user.name} />;
    } else if (user?.avatar && user.avatar.startsWith("default:")) {
      const avatarType = user.avatar.split(":")[1];
      
      return (
        <AvatarFallback className="bg-primary/10 text-primary">
          {getAvatarIcon(avatarType)}
        </AvatarFallback>
      );
    }
    
    return (
      <AvatarFallback className="bg-primary/10 text-primary">
        {user?.name.charAt(0).toUpperCase()}
      </AvatarFallback>
    );
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="md:hidden mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-lg hidden md:block">VisionDetect</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Only show users count and bell notification to admins */}
          {isAdmin && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Users className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {approvedUsers.length}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="p-2">
                    <h4 className="font-semibold">Registered Users</h4>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-4 space-y-2">
                    {approvedUsers.length > 0 ? (
                      approvedUsers.map((user) => (
                        <div key={user.id} className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm">{user.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center">
                        No registered users yet
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {(unreadCount > 0 || pendingUsersCount > 0) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <div className="p-2">
                    <h4 className="font-semibold">Notifications</h4>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {pendingUsersCount > 0 && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer">
                      <div className="flex items-center gap-2 py-1">
                        <div className="bg-amber-100 rounded-full p-1">
                          <Bell className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{pendingUsersCount} new user {pendingUsersCount > 1 ? 'requests' : 'request'}</p>
                          <p className="text-muted-foreground">Click to review registrations</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )}
                  
                  {notifications.length > 0 ? (
                    <>
                      {notifications.slice(0, 5).map((notification) => (
                        <DropdownMenuItem key={notification.id} className="cursor-pointer focus:bg-accent/5">
                          <div className="flex items-center gap-2 py-1">
                            <div className={`rounded-full p-1 ${notification.type === 'approved' ? 'bg-green-100' : 'bg-red-100'}`}>
                              {notification.type === 'approved' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div className="text-sm">
                              <p className={`${!notification.read ? 'font-medium' : ''}`}>{notification.message}</p>
                              <p className="text-muted-foreground text-xs">
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleMarkAllAsRead} className="justify-center text-sm cursor-pointer">
                        Mark all as read
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="justify-center text-sm cursor-pointer">
                        See all notifications
                      </DropdownMenuItem>
                    </>
                  ) : pendingUsersCount === 0 && (
                    <div className="py-4 px-2 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          {/* User Profile Section - Avatar and Name */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <Avatar className="h-8 w-8 cursor-pointer">
                {renderAvatarContent()}
              </Avatar>
              <span className="font-medium hover:text-[#9b87f5] hover:underline cursor-pointer transition-colors duration-300 ease-in-out">
                {user?.name}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dialog */}
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Profile</DialogTitle>
              </DialogHeader>
              <UpdateProfileForm onSuccess={() => setIsProfileOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Navbar;