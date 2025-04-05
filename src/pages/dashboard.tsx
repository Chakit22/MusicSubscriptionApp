"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    // const storedUser = localStorage.getItem("user_name");
    // if (storedUser) {
    //   setUserName(storedUser);
    // } else {
    //   toast.error("Unauthorized access! Redirecting to login...");
    //   router.push("/signin");
    // }
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user_name");
    toast.success("Logged out successfully!");
    router.replace("/signin");
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Card className="p-12 rounded-xl w-[400px] shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <h2 className="text-lg">Welcome Back, {userName} 🎉</h2>
          <p className="text-gray-500">You have successfully logged in.</p>
          <Button onClick={handleLogout} className="mt-4">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
