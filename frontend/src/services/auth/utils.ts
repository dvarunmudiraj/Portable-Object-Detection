
import { PendingUser } from "./types";

export const initializeLocalStorage = () => {
  // Initialize pending users if not exists
  const storedPendingUsers = localStorage.getItem("pendingUsers");
  if (!storedPendingUsers) {
    localStorage.setItem("pendingUsers", JSON.stringify([]));
  }
  
  // Initialize notifications if not exists
  const notifications = localStorage.getItem("adminNotifications");
  if (!notifications) {
    localStorage.setItem("adminNotifications", JSON.stringify([]));
  }
};

export const getPendingUsersFromStorage = (): PendingUser[] => {
  return JSON.parse(localStorage.getItem("pendingUsers") || "[]");
};

export const updatePendingUserStatus = (
  userId: string, 
  status: "approved" | "rejected"
): PendingUser[] => {
  const pendingUsers = getPendingUsersFromStorage();
  const updatedPendingUsers = pendingUsers.map((user) => {
    if (user.id === userId) {
      return { ...user, status };
    }
    return user;
  });
  
  localStorage.setItem("pendingUsers", JSON.stringify(updatedPendingUsers));
  
  // Add notification for this user status change
  addNotification({
    id: `notification-${Date.now()}`,
    userId,
    type: status,
    message: `User ${pendingUsers.find(u => u.id === userId)?.name} has been ${status}`,
    timestamp: new Date().toISOString(),
    read: false
  });
  
  return updatedPendingUsers;
};

// Add new notification types
export type Notification = {
  id: string;
  userId: string;
  type: "approved" | "rejected";
  message: string;
  timestamp: string;
  read: boolean;
};

// Add notification to storage
export const addNotification = (notification: Notification): void => {
  const notifications: Notification[] = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
  notifications.unshift(notification); // Add to beginning of array
  localStorage.setItem("adminNotifications", JSON.stringify(notifications));
};

// Get all notifications
export const getNotifications = (): Notification[] => {
  return JSON.parse(localStorage.getItem("adminNotifications") || "[]");
};

// Mark notification as read
export const markNotificationAsRead = (notificationId: string): Notification[] => {
  const notifications: Notification[] = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
  const updatedNotifications = notifications.map(notification => {
    if (notification.id === notificationId) {
      return { ...notification, read: true };
    }
    return notification;
  });
  localStorage.setItem("adminNotifications", JSON.stringify(updatedNotifications));
  return updatedNotifications;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (): Notification[] => {
  const notifications: Notification[] = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
  const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
  localStorage.setItem("adminNotifications", JSON.stringify(updatedNotifications));
  return updatedNotifications;
};