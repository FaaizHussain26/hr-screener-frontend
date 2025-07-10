import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginFormData, loginSchema } from "@/utils/validations/login-schema";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");
    if (token && expiry && Date.now() < parseInt(expiry)) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (message) {
        setMessage(null);
        setMessageType(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, message]);

  const onSubmit = async (data: LoginFormData) => {
    setMessage(null);
    setMessageType(null);

    try {
      if (data.email === "demo@example.com" && data.password === "demo123") {
        const expiry = Date.now() + 30 * 60 * 1000; // 30 min
        localStorage.setItem("token", "demo-token");
        localStorage.setItem("tokenExpiry", expiry.toString());

        setMessage("Login successful!");
        setMessageType("success");

        setTimeout(() => navigate("/dashboard/home", { replace: true }), 1000);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const result = await response.json();

      if (result.accessToken) {
        const expiry = Date.now() + 30 * 60 * 1000;
        localStorage.setItem("token", result.accessToken);
        localStorage.setItem("tokenExpiry", expiry.toString());

        setMessage("Login successful!");
        setMessageType("success");

        setTimeout(() => navigate("/dashboard/home", { replace: true }), 1000);
      } else {
        throw new Error("Login failed");
      }
    } catch {
      setMessage("Login failed. Please check your credentials.");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-sm bg-card-back">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login Page
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {message && (
            <div
              className={`mb-4 rounded-md border p-3 text-sm w-full ${
                messageType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white placeholder:text-sm"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="p-0">Password</FormLabel>
                      <Link
                        className="text-sm hover:underline"
                        to="/forgot-password"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 bg-white placeholder:text-sm"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0  hover:text-gray-600 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full mt-6 bg-card-box">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
