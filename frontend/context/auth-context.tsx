"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { User, AuthTokens, LoginCredentials, RegisterPayload, Role } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ── Hydrate from localStorage on mount ─────────────────────────
  useEffect(() => {
    const storedTokens = localStorage.getItem("tokens");
    const storedUser = localStorage.getItem("user");
    if (storedTokens && storedUser) {
      setTokens(JSON.parse(storedTokens));
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // ── Fetch fresh user profile ───────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/accounts/profile/");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch {
      logout();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ──────────────────────────────────────────────────────
  const login = async (credentials: LoginCredentials) => {
    const { data } = await api.post("/accounts/login/", credentials);
    const newTokens: AuthTokens = { access: data.access, refresh: data.refresh };
    setTokens(newTokens);
    localStorage.setItem("tokens", JSON.stringify(newTokens));

    // Fetch user profile
    const profileRes = await api.get("/accounts/profile/", {
      headers: { Authorization: `Bearer ${data.access}` },
    });
    setUser(profileRes.data);
    localStorage.setItem("user", JSON.stringify(profileRes.data));

    // Redirect based on role
    redirectByRole(profileRes.data.role);
  };

  // ── Register ───────────────────────────────────────────────────
  const register = async (payload: RegisterPayload) => {
    await api.post("/accounts/register/", payload);
    router.push("/auth/login?registered=true");
  };

  // ── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
  }, []);

  // ── Role-based redirect ────────────────────────────────────────
  const redirectByRole = (role: Role) => {
    switch (role) {
      case "admin":
        router.push("/admin");
        break;
      case "staff":
        router.push("/staff");
        break;
      case "resident":
      default:
        router.push("/resident/dashboard");
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isLoading,
        isAuthenticated: !!user && !!tokens,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
