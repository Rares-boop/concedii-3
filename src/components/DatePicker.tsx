"use client";

import { Dispatch, SetStateAction } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getUser } from "@/utils/fetch-user";

interface Props {
  selected: DateRange;
  setSelected: Dispatch<SetStateAction<DateRange>>;
  refreshLeaveDays: () => void;
}

export default function MyDatePicker({ selected, setSelected, refreshLeaveDays }: Props) {
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
      if (!jwt) throw new Error("❌ No JWT found!");

      const { user } = await getUser();
      if (!user) throw new Error("❌ Failed to retrieve user data!");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/leave-days/add`, {
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`❌ Failed to create leave request: ${response.status} - ${errorText}`);
      }

      await response.json();
      await refreshLeaveDays(); // ✅ full refresh

      alert("✅ Leave request submitted!");
      setSelected({ from: undefined, to: undefined });

    } catch (error) {
      alert(`❌ ${String((error as Error).message)}`);
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
        <button onClick={handleReset} style={resetStyle}>Reset Selection</button>
        <button onClick={handleAddSelection} style={addStyle}>Add Selection</button>
      </div>
    </div>
  );
}

const resetStyle = {
  padding: "8px 16px",
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const addStyle = {
  padding: "8px 16px",
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
