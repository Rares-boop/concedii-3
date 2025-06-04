"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getAllLeaveDays } from "@/utils/fetch-AllLeaveDays";

interface Props {
  users: { id: string; email: string; color?: string }[];
}

export default function MyDatePickerWithColours({ users }: Props) {
  const [selected, setSelected] = useState<Date>();
  const [highlightedDates, setHighlightedDates] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchDays() {
      try {
        const data = await getAllLeaveDays();
        const days: Record<string, string> = {};

        // Iterate through each user
        for (const user of data) {
          const userId = user.id;
          const userEmail = user.email;
          const userColor = users.find((u) => u.id === String(userId))?.color || "#888";

          const leaveDays = user.leave_days || [];

          for (const leave of leaveDays) {
            if (leave.statusRequest !== "Approved") continue;

            const start = new Date(leave.firstDay);
            const end = new Date(leave.lastDay);
            const current = new Date(start);

            while (current <= end) {
              const key = current.toDateString();
              days[key] = userColor;
              current.setDate(current.getDate() + 1);
            }
          }
        }

        console.log("✅ Highlighted days:", days);
        setHighlightedDates(days);
      } catch (err) {
        console.error("❌ Error fetching leave days:", err);
      }
    }

    fetchDays();
  }, [users]);

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      modifiers={{
        holidays: (date) => highlightedDates.hasOwnProperty(date.toDateString()),
      }}
      modifiersStyles={{
        holidays: {
          borderBottom: "3px solid red",
          backgroundColor: "transparent",
          borderRadius: "0px",
          color: "#000",
        },
      }}
      styles={{
        root: { width: "500px", height: "500px" },
        day: { fontSize: "1.2rem", padding: "10px" },
        head_cell: { width: "60px" },
      }}
    />
  );
}
