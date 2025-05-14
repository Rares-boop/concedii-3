"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt"); // ✅ Check standalone JWT

    if (!jwt) {
      router.push("/login"); // ✅ Redirect if JWT is missing
    }
  }, [router]);

  return children;
}
