import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, ArrowLeft, Clock } from "lucide-react";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signUp(email, password, fullName);
      toast({
        title: "Account created successfully",
        description:
          "Welcome to Badger Padel Community! Please check your email to verify your account.",
        duration: 5000,
      });
      navigate("/membership-card");
    } catch (error) {
      setError(
        "Error creating account. Please check your information and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative bg-white rounded-2xl shadow-sm w-full max-w-md mx-auto p-6 sm:p-8">
        <Link to="/">
          <Button
            variant="ghost"
            className="absolute left-4 top-4 p-2 h-auto flex items-center text-gray-600 hover:text-black hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-6">
          <img
            src="/images/White Badger Logo.PNG"
            alt="Badger Padel Logo"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Join Badger Padel Community
          </h1>
          <p className="text-gray-500 mt-2">
            Create your free membership account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-11 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-11 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 8 characters
            </p>
          </div>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium mt-2"
          >
            {isLoading ? "Creating account..." : "Create Free Account"}
          </Button>

          <div className="flex items-center justify-center space-x-2 mt-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-xs text-gray-500">
              Free membership, no credit card required
            </p>
          </div>

          <div className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
