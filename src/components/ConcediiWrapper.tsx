"use client";

import { useState, useEffect } from "react";
import MyDatePicker from "./DatePicker";
import ListaConcedii from "./layout/ListaConcedii";
import { DateRange } from "react-day-picker";
import { LeaveDays } from "@/types";
import { getLeaveDays } from "@/utils/fetch-leaveDays";

export default function ConcediiWrapper() {
  const [selectedRange, setSelectedRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [filterRange, setFilterRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [leaveDays, setLeaveDays] = useState<LeaveDays[]>([]);

  const refreshLeaveDays = async (clearFilter = false) => {
    try {
      const { leaveDays } = await getLeaveDays();
      setLeaveDays(leaveDays || []);

      if (clearFilter) {
        // ✅ Show all after adding
        setFilterRange({ from: undefined, to: undefined });
      }
    } catch (err) {
      console.error("❌ Error refreshing leave days:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    refreshLeaveDays();
  }, []);

  return (
    <div className="container">
      <div className="calendar">
        <MyDatePicker
          selected={selectedRange}
          setSelected={setSelectedRange}
          refreshLeaveDays={() => refreshLeaveDays(true)}
        />
      </div>
      <div className="leave-list">
        <ListaConcedii selectedRange={filterRange} leaveDays={leaveDays} />
      </div>
    </div>
  );
}
