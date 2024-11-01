import { useState, useEffect } from "react";
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

  const [text, setText] = useState("");
  const fullText =
    "Find your perfect studymate to make learning easier and more enjoyable!";

  //for typo animation
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  //for login
  const handleSubmit = async (event) => {
    event.preventDefault();
    // 로그인 성공 처리 (상태 업데이트 및 리디렉션)
    setIsLoading(true);
    setIsLoggedIn(true);
    // Here you would typically handle the login logic
    console.log("Login attempted with:", email, password);
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    navigate("/chatinterface");

    setIsLoading(false);
  };

  return (
    <div className="container max-w-full min-h-screen flex flex-col lg:flex-row p-0">
      <div className="flex flex-col items-center justify-center w-full lg:w-3/5 min-h-screen bg-gray-900 overflow-y-auto p-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff6c0f] to-[#8dc63f] animate-pulse">
            Perfect StudyMate
          </span>
        </h1>
        <div className="w-24 h-px bg-gradient-to-r from-[#ff6c0f] to-[#8dc63f] my-4"></div>
        <p className="text-xl md:text-2xl mb-10 text-center h-20 md:h-16 text-white mx-4 md:mx-8 lg:mx-16">
          {text}
        </p>
        <p className="text-xm md:text-sm text-gray-300 text-opacity-75">
          Team Kapstone from SKKU
        </p>
      </div>
      <div className="w-full lg:w-2/5 min-h-screen bg-gray-100 flex flex-col items-center justify-center overflow-y-auto">
        <div className="p-8 w-full max-w-md">
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
              className="text-[#8dc63f] hover:underline block"
              aria-label="Forgot password"
            >
              Forgot Password?
            </Link>
            <p className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-[#8dc63f] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
