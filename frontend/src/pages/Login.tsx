
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Lock, Mail, User } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    if (isLogin) {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Failed to login");
      }
    } else {
      const result = await signup(email, password, name);
      if (result.success) {
        setMessage(
          "Registration successful! Please wait for admin approval. You will be notified when your account is approved."
        );
        // Reset form
        setEmail("");
        setPassword("");
        setName("");
      } else {
        setError(result.message || "Failed to register");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100">
      <div className="w-full max-w-md p-8 mx-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="gradient-blue-purple p-6 text-center">
            <h1 className="text-2xl font-bold text-white">VisionDetect</h1>
            <p className="text-blue-100 mt-2">
              Real-time object detection platform
            </p>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-center mb-6">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin-slow mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    {isLogin ? "Logging in..." : "Signing up..."}
                  </span>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setMessage("");
                  }}
                  className="ml-1 text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </p>
            </div>

            {isLogin && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  <strong>Demo credentials</strong>
                </p>
                <p className="text-xs text-gray-500">
                  User Email: demo@example.com<br />
                  User Password: password<br /><br />
                  Admin Email: admin@example.com<br />
                  Admin Password: admin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;