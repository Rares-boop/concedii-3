"use client"

import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import MyDatePicker from "@/components/DatePicker";



export default function Home() {

  return (
    <AuthGuard>
      <div>
      <h1>Welcome to the Home Page</h1>
      <p>Select a date below:</p>
      <MyDatePicker></MyDatePicker>
      {/* Date Picker Component */}
    </div>
    </AuthGuard>
  );
}
