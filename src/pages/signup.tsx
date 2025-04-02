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

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    console.log("Form data : ", data);

    try {
     
      const response = await fetch('https://br7w7xmjgh.execute-api.us-east-1.amazonaws.com/prod/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
      });

      const result = await response.json();

      if (!result.success) {
        
        toast.error(result.message || "An error occurred during registration.");
      } else {
       
        toast.success("User registered successfully!");
        setTimeout(() => window.location.replace('/signin'), 2000); 
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Failed to register. Please try again.");
    }
  });

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Card className="p-12 rounded-xl w-[400px] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Register</CardTitle>
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
                  type={isPasswordVisible ? "password" : "text"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
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
            Already have an account ?{" "}
            <span>
              <Link href={"/signin"} replace={true} className="text-blue-400">
                Login
              </Link>
            </span>
          </div>
          <Button onClick={onSubmit}>Register</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
