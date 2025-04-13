import { useEffect } from "react";
import { useRouter } from "next/router";
import RegisterForm from "./signup";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        // If user is logged in, redirect to main-page
        router.replace("/main-page");
      }
    }
  }, [router]);

  return <RegisterForm />;
}
