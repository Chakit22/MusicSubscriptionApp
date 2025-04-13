import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/router";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;
  login: (email: string, userName?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  // Check localStorage on initial load
  useEffect(() => {
    // Need to use this check because localStorage is not available during SSR
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      const name = localStorage.getItem("user_name");
      if (email) {
        setIsLoggedIn(true);
        setUserEmail(email);
        if (name) {
          setUserName(name);
        }
      }
    }
  }, []);

  const login = (email: string, userName?: string) => {
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
    setUserEmail(email);

    if (userName) {
      localStorage.setItem("user_name", userName);
      setUserName(userName);
    }
  };

  const logout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("user_name");
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userEmail, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
