import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, PendingUser, AuthContextType } from "@/services/auth/types";
import { 
  initializeLocalStorage, 
  getPendingUsersFromStorage, 
  updatePendingUserStatus,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "@/services/auth/utils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    initializeLocalStorage();
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (email === "admin@example.com" && password === "admin") {
      const adminUser: User = {
        id: "admin-123",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        status: "approved",
        stats: {
          totalDetections: 0,
          mostCommonObject: "-",
          detectionAccuracy: 0,
          recentUploads: 0
        }
      };
      
      localStorage.setItem("user", JSON.stringify(adminUser));
      setUser(adminUser);
      setIsLoading(false);
      return { success: true };
    }
    
    if (email === "demo@example.com" && password === "password") {
      const mockUser: User = {
        id: "user-123",
        name: "Demo User",
        email: "demo@example.com",
        role: "user",
        status: "approved",
        stats: {
          totalDetections: 152,
          mostCommonObject: "person",
          detectionAccuracy: 94.7,
          recentUploads: 12
        }
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsLoading(false);
      return { success: true };
    }
    
    const pendingUsers = getPendingUsersFromStorage();
    const pendingUser = pendingUsers.find(u => u.email === email);
    
    if (!pendingUser) {
      setIsLoading(false);
      return { 
        success: false,
        message: "Invalid email or password" 
      };
    }
    
    if (pendingUser.status === "pending") {
      setIsLoading(false);
      return { 
        success: false, 
        message: "Your account is waiting for admin approval." 
      };
    } else if (pendingUser.status === "rejected") {
      setIsLoading(false);
      return { 
        success: false, 
        message: "Your registration has been rejected. Please contact support." 
      };
    } else if (pendingUser.status === "approved") {
      const approvedUser: User = {
        id: pendingUser.id,
        name: pendingUser.name,
        email: pendingUser.email,
        role: "user",
        status: "approved",
        stats: {
          totalDetections: 0,
          mostCommonObject: "-",
          detectionAccuracy: 0,
          recentUploads: 0
        }
      };
      
      localStorage.setItem("user", JSON.stringify(approvedUser));
      setUser(approvedUser);
      return { success: true };
    }
    
    setIsLoading(false);
    return { 
      success: false,
      message: "Invalid email or password" 
    };
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPendingUser: PendingUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    
    const pendingUsers = getPendingUsersFromStorage();
    pendingUsers.push(newPendingUser);
    localStorage.setItem("pendingUsers", JSON.stringify(pendingUsers));
    
    setIsLoading(false);
    return {
      success: true,
      message: "Registration successful. Please wait for admin approval."
    };
  };

  const getPendingUsers = () => {
    return getPendingUsersFromStorage();
  };

  const approveUser = (userId: string) => {
    updatePendingUserStatus(userId, "approved");
  };

  const rejectUser = (userId: string) => {
    updatePendingUserStatus(userId, "rejected");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const updateUserProfile = async ({ 
    name, 
    email, 
    avatar,
    currentPassword, 
    newPassword 
  }: { 
    name: string; 
    email: string;
    avatar?: string | null;
    currentPassword: string; 
    newPassword: string 
  }) => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Only check password if user is attempting to change password
    if (newPassword) {
      // Validate current password if user is trying to change password
      if (user?.email === "admin@example.com" && currentPassword !== "admin") {
        setIsLoading(false);
        throw new Error("Invalid current password");
      } else if (user?.email === "demo@example.com" && currentPassword !== "password") {
        setIsLoading(false);
        throw new Error("Invalid current password");
      }
    }
    
    const updatedUser = {
      ...user!,
      name,
      email: email || user?.email,
      avatar
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsLoading(false);
    
    return { success: true };
  };

  // Add deleteUser function
  const deleteUser = (userId: string) => {
    const pendingUsers = getPendingUsersFromStorage();
    const filteredUsers = pendingUsers.filter(user => user.id !== userId);
    localStorage.setItem("pendingUsers", JSON.stringify(filteredUsers));
    
    // If the deleted user is currently logged in, force logout
    if (user?.id === userId) {
      logout();
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
    isLoading,
    getPendingUsers,
    approveUser,
    rejectUser,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateUserProfile,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;