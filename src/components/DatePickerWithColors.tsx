"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function MyDatePickerWithColours() {
  const [selected, setSelected] = useState<Date>();
  const [holidayDates, setHolidayDates] = useState<Date[]>([]);

  useEffect(() => {
    async function fetchPublicHolidays() {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/public-holidays`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const data = await res.json();
        const dates: Date[] = data.data.map((item: any) => new Date(item.date));
        setHolidayDates(dates);
      } catch (err) {
        console.error("❌ Error fetching public holidays:", err);
      }
    }

    fetchPublicHolidays();
  }, []);

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={setSelected}
      modifiers={{
        holidays: holidayDates,
      }}
      modifiersStyles={{
        holidays: {
          backgroundColor: "#ff4d4f",
          color: "white",
          borderRadius: "0px",   
        },
      }}
      styles={{
        root: { width: "500px", height: "400px" },
        day: { fontSize: "1.2rem", padding: "10px" },
        head_cell: { width: "60px" },
      }}
    />
  );
}
