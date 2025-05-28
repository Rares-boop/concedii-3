"use client";

import { DateRange } from "react-day-picker";
import { LeaveDays } from "@/types";

interface Props {
  selectedRange: DateRange;
  leaveDays: LeaveDays[];
}

export default function ListaConcedii({ selectedRange, leaveDays }: Props) {
  const normalize = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const filtered = leaveDays.filter((leave) => {
    if (!selectedRange.from || !selectedRange.to) return true;

    const start = normalize(new Date(leave.firstDay));
    const end = normalize(new Date(leave.lastDay));
    const from = normalize(new Date(selectedRange.from));
    const to = normalize(new Date(selectedRange.to));

    return start >= from && end <= to;
  });

  return (
    <div>
      <h1>Lista Concedii</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((leave, i) => (
          <li key={i} style={{ marginBottom: "10px" }}>
            <span>
              {new Date(leave.firstDay).toLocaleDateString()} –{" "}
              {new Date(leave.lastDay).toLocaleDateString()}
            </span>{" "}
            <span style={{
              padding: "4px 8px",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "0.85rem",
              color: "white",
              backgroundColor:
                leave.statusRequest === "Approved"
                  ? "#28a745"
                  : leave.statusRequest === "Rejected"
                  ? "#dc3545"
                  : "#ffc107"
            }}>
              {leave.statusRequest || "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
