"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import MyDatePickerWithColours from "@/components/DatePickerWithColors";
import LeaveCalendar from "@/components/LeaveCalendar";

type LeaveDay = {
  id: number;
  firstDay: string;
  lastDay: string;
  statusRequest: string;
};

type User = {
  id: string;
  email: string;
  leave_days: LeaveDay[];
  color: string;
};

// Keep this function for future use
/*
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}
*/

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserLeaves, setSelectedUserLeaves] = useState<LeaveDay[]>([]);
  const [colorModalUserId, setColorModalUserId] = useState<string | null>(null);
  const [tempColor, setTempColor] = useState<string>("");

  useEffect(() => {
    async function fetchUsersAndLeaves() {
      try {
        const jwt = localStorage.getItem("jwt");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users?populate=leave_days`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Unexpected response format from /users");
          return;
        }

        const coloredUsers: User[] = data.map((user: any) => ({
          ...user,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        }));

        setUsers(coloredUsers);
      } catch (err) {
        console.error("❌ Failed to fetch users with leave days:", err);
      }
    }

    fetchUsersAndLeaves();
  }, []);

  const handleUserClick = (user: User) => {
    if (selectedUserId === user.id) {
      setSelectedUserId(null);
      setSelectedUserLeaves([]);
    } else {
      setSelectedUserId(user.id);
      const approved = user.leave_days?.filter((entry) => entry.statusRequest === "Approved") || [];
      setSelectedUserLeaves(approved);
    }
  };

  const handleOpenColorPicker = (userId: string, currentColor: string) => {
    setColorModalUserId(userId);
    setTempColor(currentColor);
  };

  const handleSaveColor = () => {
    if (!colorModalUserId) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === colorModalUserId ? { ...u, color: tempColor } : u
      )
    );
    setColorModalUserId(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome to the Home Page
        </h1>

        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
          {/* Calendar Section */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow overflow-hidden">
            <LeaveCalendar users={users} />
          </div>

          {/* User List + Leave Info */}
          <div className="w-full lg:w-[360px] bg-white p-4 rounded-xl shadow max-h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              👥 All Users
            </h2>

            <ul className="space-y-2 mb-4">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="px-4 py-2 border rounded-md text-sm text-gray-800 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 relative"
                >
                  <span className="mr-2 truncate">{user.email}</span>
                  <div
                    className="w-5 h-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: user.color }}
                    title={user.color}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenColorPicker(user.id, user.color);
                    }}
                  />
                  {colorModalUserId === user.id && (
                    <div className="absolute top-10 right-0 bg-white border rounded-lg p-4 shadow-lg z-50 w-52">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        🎨 Choose a Color
                      </label>
                      <input
                        type="color"
                        value={tempColor}
                        onChange={(e) => setTempColor(e.target.value)}
                        className="w-full h-10 rounded mb-3 border"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setColorModalUserId(null)}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-200"
                        >
                          Close
                        </button>
                        <button
                          onClick={handleSaveColor}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {selectedUserId && (
              <>
                <h3 className="text-lg font-bold mt-4 mb-2 text-gray-700">
                  ✅ Approved Leave Days
                </h3>
                <ul className="text-sm space-y-1">
                  {selectedUserLeaves.length > 0 ? (
                    selectedUserLeaves.map((leave) => (
                      <li key={leave.id} className="text-gray-600">
                        {leave.firstDay} → {leave.lastDay}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No approved leave days.</li>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
