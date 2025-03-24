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
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInForm() {
  // const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data) => {
    console.log("Form data : ", data);

    toast.success("User LoggedIn sucessfully. Redirecting to Main Page.");
  });

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Card className="p-12 rounded-xl w-[350px] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Sign In</CardTitle>
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
            New User ?{" "}
            <span>
              <Link href={"/signup"} replace={true} className="text-blue-400">
                Register
              </Link>
            </span>
          </div>
          <Button onClick={onSubmit}>Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
