"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";
import { fetchApi } from "@/utils/fetch-api";

const UserContext = createContext<{ userPromise: Promise<User | null>; refreshUser: () => void } | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function refreshUser() {
    const jwt = localStorage.getItem("jwt"); // ✅ Fetch JWT directly
    if (!jwt) {
      setUser(null);
      return;
    }

    try {
      const userData = await fetchApi("users/me", {
        headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
      });

      console.log("✅ Refreshed User Data:", userData); // Debugging log
      setUser(userData);
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUser(null);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return <UserContext.Provider value={{ userPromise: Promise.resolve(user), refreshUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
