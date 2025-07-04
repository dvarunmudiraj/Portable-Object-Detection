
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")} className="inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
