"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch current session on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch auth session", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [pathname]); // Refresh on navigation to sync state if cookies change

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Invalid email or password." };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: "A connection error occurred. Please try again." };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to create account." };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: "A connection error occurred. Please try again." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // Helper function to check if logged in. If not, redirects to login with callbackUrl and action.
  const requireAuth = (callbackUrl, action) => {
    if (!loading && !user) {
      const dest = callbackUrl || window.location.pathname + window.location.search;
      let loginUrl = `/login?callbackUrl=${encodeURIComponent(dest)}`;
      if (action) {
        loginUrl += `&action=${encodeURIComponent(action)}`;
      }
      router.push(loginUrl);
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
