import { useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm from "./signup";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // If user is logged in, redirect to main-page
    if (isLoggedIn) {
      router.replace("/main-page");
    }
  }, [isLoggedIn, router]);

  return <RegisterForm />;
}
