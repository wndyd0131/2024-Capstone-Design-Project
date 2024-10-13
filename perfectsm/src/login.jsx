import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginScreen({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // 로그인 성공 처리 (상태 업데이트 및 리디렉션)
    setIsLoading(true);
    setIsLoggedIn(true);
    // Here you would typically handle the login logic
    console.log("Login attempted with:", email, password);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate("/"); // 로그인 후 채팅 화면으로 리디렉션

    setIsLoading(false);
  };

  return (
    <div className="container bg-gray-100 max-w-full mx-auto p-6">
      <div className="p-8 bg-white rounded-lg shadow-md w-110">
        <h1 className="mb-6 text-2xl font-bold text-center">
          Welcome to Perfect Studymate
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center bg-transparent focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-center space-y-2">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline block"
            aria-label="Forgot password"
          >
            Forgot Password?
          </Link>
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
