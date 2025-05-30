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
      await refreshLeaveDays();

      alert("✅ Leave request submitted!");
      setSelected({ from: undefined, to: undefined });

    } catch (error) {
      alert(`❌ ${String((error as Error).message)}`);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6 w-full">
      <h2 className="text-xl font-semibold">Selectează perioada de concediu</h2>

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

      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition"
        >
          Reset Selection
        </button>
        <button
          onClick={handleAddSelection}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          Add Selection
        </button>
      </div>
    </div>
  );
}
