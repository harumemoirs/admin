"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const refreshUser = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/kairos/v1/admin/auth/me`,
        { credentials: "include" }
      );

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

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
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
