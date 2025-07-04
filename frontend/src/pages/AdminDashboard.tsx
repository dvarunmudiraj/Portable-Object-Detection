
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Bell, 
  User, 
  UserCheck,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { PendingUser } from "@/services/auth/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AdminDashboard = () => {
  const { user, getPendingUsers, approveUser, rejectUser, deleteUser } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<PendingUser | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }

    const users = getPendingUsers().filter(user => user.status === "pending");
    setPendingUsers(users);
    setShowNotification(users.length > 0);
  }, [user, navigate, getPendingUsers]);

  const handleApprove = (userId: string) => {
    approveUser(userId);
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    toast.success("User has been approved successfully", {
      description: "The user can now log in to the application.",
      duration: 5000,
    });
    setIsDialogOpen(false);
  };

  const handleReject = (userId: string) => {
    rejectUser(userId);
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    toast.error("User has been rejected", {
      description: "The user will be notified about their rejected status.",
      duration: 5000,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (userId: string) => {
    deleteUser(userId);
    toast.success("User has been deleted successfully", {
      description: "The user will no longer be able to access the application.",
      duration: 5000,
    });
    setPendingUsers(prev => prev.filter(user => user.id !== userId));
    setUserToDelete(null);
  };

  const openUserDialog = (user: PendingUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="relative">
          <Bell className="h-6 w-6" />
          {showNotification && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {pendingUsers.length}
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Pending User Approvals</h2>
            {pendingUsers.length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingUsers.length} new
              </span>
            )}
          </div>
          
          {pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-gray-500">No pending approvals</p>
              <p className="text-xs text-gray-400">All user registrations have been processed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => openUserDialog(user)}
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      Requested: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(user.id);
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(user.id);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCheck className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold">Approved Users</h2>
          </div>
          
          <div className="flex flex-col py-4">
            {getPendingUsers()
              .filter(user => user.status === "approved")
              .map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Approved
                    </span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUserToDelete(user);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                            The user will no longer be able to access the application.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Registration Request</DialogTitle>
            <DialogDescription>
              Review the registration details before approving or rejecting.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p>{selectedUser.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Registration Date</h4>
                  <p>{new Date(selectedUser.createdAt).toLocaleString()}</p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    onClick={() => handleApprove(selectedUser.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(selectedUser.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;