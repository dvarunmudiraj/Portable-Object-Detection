
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ProtectedRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user is approved
  if (user?.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your account is pending approval. You will be notified via email once an admin reviews your registration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (user?.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your registration has been rejected. Please contact support for more information.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;