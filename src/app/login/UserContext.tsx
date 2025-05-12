"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  jwt: string;
}

const UserContext = createContext<{ userPromise: Promise<User | null>; refreshUser: () => void } | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function refreshUser() {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return <UserContext.Provider value={{ userPromise: Promise.resolve(user), refreshUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
