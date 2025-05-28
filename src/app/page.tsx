"use client"

import AuthGuard from "@/components/AuthGuard";
import MyDatePickerWithColours from "@/components/DatePickerWithColors";



export default function Home() {

  return (
    <AuthGuard>
      <div>
      <h1>Welcome to the Home Page</h1>
      <MyDatePickerWithColours />
    </div>
    </AuthGuard>
  );
}
