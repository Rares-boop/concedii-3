"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { DateRange } from "react-day-picker";
import { getUser } from "@/utils/fetch-user";
import { connect } from "http2";


export default function MyDatePicker() {
  const [selected, setSelected] = useState<DateRange>({ from: undefined, to: undefined });

  const handleReset = () => {
    setSelected({ from: undefined, to: undefined });
  };


  /*async function handleAddSelection() {
    if (!selected.from || !selected.to) {
      alert("⚠️ Please select a date range first!");
      return;
    }

    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) throw new Error("❌ No JWT found! User might not be authenticated.");

      const today = new Date().toLocaleDateString("en-CA");

      const { user } = await getUser();
      if (!user) throw new Error("❌ Failed to retrieve user data!");

      console.log("🟢 Authenticated user:", user);

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

      const leaveRequestId = leaveRequestData.data.documentId;

      console.log("✅ Leave request created:", leaveRequestData);

      const updatedLeaveDays = [{ documentId: leaveRequestId }]; 

      console.log("LEAVE REQUEST ID ",leaveRequestId);
      console.log("UPDATE LEAVE DAYS enwc ",updatedLeaveDays);

      const updateUserResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            leave_days: { connect: updatedLeaveDays } 
          }
        }),
      });

      const responseData = await updateUserResponse.json();
      console.log("User id ",responseData.id);
      console.log("✅ User updated:", responseData);


      console.log("✅ User leaveDays updated successfully!");
      alert("✅ Leave request added and linked to user!");

      setSelected({ from: undefined, to: undefined });

    } catch (error) {
      console.error("❌ Error adding leave request:", error);
      alert(`❌ Failed to add leave request: ${(error as Error).message}`);
    }
  }*/

  async function handleAddSelection() {
    if (!selected.from || !selected.to) {
      alert("⚠️ Please select a date range first!");
      return;
    }

    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) throw new Error("❌ No JWT found! User might not be authenticated.");

      const { user } = await getUser();
      if (!user) throw new Error("❌ Failed to retrieve user data!");

      console.log("🟢 Authenticated user:", user);

      const leaveRequestResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/leave-days/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstDay: selected.from.toLocaleDateString("en-CA"),
          lastDay: selected.to.toLocaleDateString("en-CA"),
        }),
      });

      if (!leaveRequestResponse.ok) {
        const errorText = await leaveRequestResponse.text();
        throw new Error(`❌ Failed to create leave request: ${leaveRequestResponse.status} - ${errorText}`);
      }

      const result = await leaveRequestResponse.json();
      console.log("✅ Leave request created & linked:", result);

      alert("✅ Leave request successfully submitted!");
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
        selected={selected}
        onSelect={(range) => setSelected(range || { from: undefined, to: undefined })}
        footer={
          selected.from && selected.to
            ? `Selected range: ${selected.from.toLocaleDateString()} → ${selected.to.toLocaleDateString()}`
            : "Pick a date range."
        }
        required
        min={2}
        max={14}
      />

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
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

        <button onClick={handleAddSelection} style={{
          padding: "8px 16px",
          backgroundColor: "#28a745",
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
