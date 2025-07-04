export type User = {
  id: string;
  name: string;
  email: string;
  stats: {
    totalDetections: number;
    mostCommonObject: string;
    detectionAccuracy: number;
    recentUploads: number;
  };
  role: "admin" | "user";
  status: "pending" | "approved" | "rejected";
  avatar?: string | null;
};

export type PendingUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
  getPendingUsers: () => PendingUser[];
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  getNotifications: () => import('./utils').Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateUserProfile: (data: { 
    name: string; 
    email: string;
    avatar?: string | null;
    currentPassword: string; 
    newPassword: string 
  }) => Promise<{ success: boolean }>;
}