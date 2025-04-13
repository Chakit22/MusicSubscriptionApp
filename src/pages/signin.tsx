"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/context/AuthContext";

export default function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    console.log("Submitting Form Data:", data);
    setLoading(true);
    console.log("data", data);

    data.action = "login";

    try {
      const lambdaUrl =
        process.env.NEXT_PUBLIC_SIGN_UP_LOGIN_LAMBDA_URL ||
        "https://j6mawlyukf.execute-api.us-east-1.amazonaws.com/default/signup_login";

      const response = await axios.post(lambdaUrl, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 200) {
        login(data.email, response.data.user_name);
        toast.success(`Welcome, ${response.data.user_name}! Redirecting...`);
        setTimeout(() => {
          router.replace("/main-page");
        }, 1500);
      } else {
        toast.error(response.data.message || "Invalid credentials, try again.");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message || "Server error, please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Card className="p-12 rounded-xl w-[350px] shadow-2xl border-indigo-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-bold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required!",
                })}
              />
              {errors.email?.message && (
                <p className="text-red-400">{(errors.email as any).message}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-bold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="absolute top-1/2 transform -translate-y-1/2 right-2"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password?.message && (
                <p className="text-red-400">
                  {(errors.password as any).message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex flex-col items-center gap-2">
          <div className="text-sm">
            New User?{" "}
            <Link
              href="/signup"
              className="text-indigo-600 hover:text-purple-600 transition-colors"
            >
              Register
            </Link>
          </div>
          {/* Use form submission using handleSubmit */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
