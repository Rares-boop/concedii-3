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
      
      {/* ✅ Reset Button */}
      <button onClick={handleReset} style={{
        marginTop: "10px",
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
    </div>
  );
}
