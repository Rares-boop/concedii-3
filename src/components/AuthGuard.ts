"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
  
    useEffect(() => {
      const user = localStorage.getItem("user");
  
      if (!user) {
        router.push("/login");
      }
    }, []);
  
    return children; 
  }
  
