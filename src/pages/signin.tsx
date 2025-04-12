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

export default function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    console.log("Submitting Form Data:", data);
    setLoading(true);

    data.action = "login"; 

    try {
      const response = await fetch(
        "https://3v0fycd0ac.execute-api.us-east-1.amazonaws.com/prod/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(data), 
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("user_name", result.user_name);
        toast.success(`Welcome, ${result.user_name}! Redirecting...`);
        setTimeout(() => {
          router.push("/dashboard"); 
        }, 1500);
      } else {
        toast.error(result.message || "Invalid credentials, try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Server error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Card className="p-12 rounded-xl w-[350px] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
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
                <p className="text-red-400">{(errors.password as any).message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex flex-col items-center gap-2">
          <div className="text-sm">
            New User?{" "}
            <Link href="/signup" className="text-blue-400">
              Register
            </Link>
          </div>
          {/* Use form submission using handleSubmit */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
