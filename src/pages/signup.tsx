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
import axios from "axios";

export default function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      username: data.username,
      action: "register",
    };

    setLoading(true);

    try {
      const lambdaUrl = process.env.NEXT_PUBLIC_SIGN_UP_LOGIN_LAMBDA_URL!;

      const response = await axios.post(lambdaUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Store username in localStorage for main page to use
        localStorage.setItem("user_name", data.username);
        toast.success("User registered successfully! Redirecting to login...");
        setTimeout(() => {
          router.replace("/signin");
        }, 1500);
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Try again later."
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="w-screen min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Card className="p-12 rounded-xl w-[400px] shadow-2xl border-indigo-100">
        <CardHeader>
          <CardTitle className="text-center text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2 justify-center">
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
              {errors.email && (
                <p className="text-red-400">{errors.email.message as string}</p>
              )}
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2 justify-center">
              <Label htmlFor="username" className="text-bold">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <p className="text-red-400">
                  {errors.username.message as string}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 justify-center">
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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <div onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? (
                    <FaEye className="absolute top-1/2 transform -translate-y-1/2 right-2" />
                  ) : (
                    <FaEyeSlash className="absolute top-1/2 transform -translate-y-1/2 right-2" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-400">
                  {errors.password.message as string}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex flex-col items-center justify-center gap-2">
          <div className="text-sm">
            Already have an account?{" "}
            <Link
              href={"/signin"}
              className="text-indigo-600 hover:text-purple-600 transition-colors"
            >
              Login
            </Link>
          </div>
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md transition-all duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
