"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { DateRange } from "react-day-picker";

export default function MyDatePicker() {
  const [selected, setSelected] = useState<DateRange>({ from: undefined, to: undefined });

  // ✅ Reset function to clear the selection
  const handleReset = () => {
    setSelected({ from: undefined, to: undefined });
  };

  // ✅ Add selection function
  const handleAddSelection = () => {
    if (selected.from && selected.to) {
      console.log("Selected range added:", selected);
      alert(`Added selection: ${selected.from.toLocaleDateString()} → ${selected.to.toLocaleDateString()}`);
    } else {
      alert("Please select a valid date range before adding.");
    }
  };

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
