"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type Admin = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: Admin | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch /me from backend
  const refreshUser = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/kairos/v1/admin/auth/me`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        setUser(null);

        if (pathname !== "/auth/login") {
          router.push("/auth/login");
        }

        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);

      if (pathname !== "/auth/login") {
        router.push("/auth/login");
      }
    }
  };

  // Run on first load
  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  const logout = async () => {
    await fetch(`${API_URL}/api/kairos/v1/admin/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
