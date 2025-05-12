"use client";
import { useState, useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);


  return isLoading ? <LoadingPage /> : (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
