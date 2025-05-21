"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { DateRange } from "react-day-picker";
import { getUser } from "@/utils/fetch-user";
import { connect } from "http2";


/*async function getUserIdFromLocalStorage() {
    try {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) throw new Error("❌ No JWT found! User might not be authenticated.");

        const response = await fetch("http://localhost:1337/api/users/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("❌ Failed to fetch user!");

        const userData = await response.json();
        return userData.id; // ✅ Get authenticated user's ID

    } catch (error) {
        console.error("❌ Error fetching user:", error);
        return null;
    }
}*/


export default function MyDatePicker() {
  const [selected, setSelected] = useState<DateRange>({ from: undefined, to: undefined });

  // ✅ Reset function to clear the selection
  const handleReset = () => {
    setSelected({ from: undefined, to: undefined });
  };


  async function handleAddSelection() {
    if (!selected.from || !selected.to) {
      alert("⚠️ Please select a date range first!");
      return;
    }

    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) throw new Error("❌ No JWT found! User might not be authenticated.");

      const today = new Date().toLocaleDateString("en-CA");

      // ✅ Step 1: Fetch the authenticated user
      const { user } = await getUser();
      if (!user) throw new Error("❌ Failed to retrieve user data!");

      console.log("🟢 Authenticated user:", user);

      // ✅ Step 2: Create the leave request
      const leaveRequestResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/leave-days`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            firstDay: selected.from.toLocaleDateString("en-CA"),
            lastDay: selected.to.toLocaleDateString("en-CA"),
            addedAt: today,
            statusRequest: "Pending",
          },
        }),
      });

      if (!leaveRequestResponse.ok) {
        const errorText = await leaveRequestResponse.text();
        throw new Error(`❌ Failed to create leave request: ${leaveRequestResponse.status} - ${errorText}`);
      }

      const leaveRequestData = await leaveRequestResponse.json();

      const leaveRequestId = leaveRequestData.data.id; // ✅ Get leave request ID

      console.log("✅ Leave request created:", leaveRequestData);

      //const updatedLeaveDays = Array.isArray(user.leaveDays) ? [...user.leaveDays, leaveRequestId] : [leaveRequestId];
      const updatedLeaveDays = [leaveRequestId];

      const updateUserResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            leave_days: { connect: updatedLeaveDays },
          }
        }),
      });

      if (!updateUserResponse.ok) {
        const errorText = await updateUserResponse.text();
        throw new Error(`❌ Failed to update user leaveDays: ${updateUserResponse.status} - ${errorText}`);
      }

      console.log("✅ User leaveDays updated successfully!");
      alert("✅ Leave request added and linked to user!");

      setSelected({ from: undefined, to: undefined });

    } catch (error) {
      console.error("❌ Error adding leave request:", error);
      alert(`❌ Failed to add leave request: ${(error as Error).message}`);
    }
  }


  return (
    <div>
      <DayPicker
        mode="range"
        selected={selected} // ✅ Use the predefined DateRange type correctly
        onSelect={(range) => setSelected(range || { from: undefined, to: undefined })} // ✅ Handles undefined safely
        footer={
          selected.from && selected.to
            ? `Selected range: ${selected.from.toLocaleDateString()} → ${selected.to.toLocaleDateString()}`
            : "Pick a date range."
        }
        required
        min={2} // ✅ Minimum nights in range
        max={14} // ✅ Maximum nights in range
      />

      {/* ✅ Button Container for Side-by-Side Layout */}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        {/* ✅ Reset Button */}
        <button onClick={handleReset} style={{
          padding: "8px 16px",
          backgroundColor: "#ff4d4d",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Reset Selection
        </button>

        {/* ✅ Add Selection Button */}
        <button onClick={handleAddSelection} style={{
          padding: "8px 16px",
          backgroundColor: "#28a745", // ✅ Green color
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}>
          Add Selection
        </button>
      </div>
    </div>
  );
}
