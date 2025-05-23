"use client"

import AuthGuard from "@/components/AuthGuard";
import MyDatePickerNoButtons from "@/components/DatePickerNoButtons";



export default function Home() {

  return (
    <AuthGuard>
      <div>
      <h1>Welcome to the Home Page</h1>
      <MyDatePickerNoButtons />
      {/* Date Picker Component */}
    </div>
    </AuthGuard>
  );
}
