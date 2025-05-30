"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import MyDatePickerWithColours from "@/components/DatePickerWithColors";
import { getAllUsers } from "@/utils/fetch-AllUsers";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await getAllUsers();
        setUsers(res);
      } catch (e) {
        console.error("❌ Failed to fetch users:", e);
      }
    }
    loadUsers();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 flex items-start justify-center gap-6 px-6 py-10">
        {/* Calendar box */}
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome to the Home Page
          </h1>
          <div className="flex justify-center">
            <MyDatePickerWithColours />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-sm h-[550px] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">👥 All Users</h2>
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="px-4 py-2 border rounded-md text-sm text-gray-800 bg-gray-50"
              >
                {user.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
}
