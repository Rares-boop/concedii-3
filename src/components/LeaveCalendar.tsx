"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";

type LeaveDay = {
  firstDay: string;
  lastDay: string;
  statusRequest: string;
};

type User = {
  id: string;
  email: string;
  color: string;
  leave_days: LeaveDay[];
};

interface Props {
  users: User[];
}

export default function LeaveCalendar({ users }: Props) {
  const [dateToColors, setDateToColors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const map: Record<string, string[]> = {};

    users.forEach((user) => {
      const color = user.color || "#888";
      user.leave_days?.forEach((leave) => {
        if (leave.statusRequest !== "Approved") return;

        const start = new Date(leave.firstDay);
        const end = new Date(leave.lastDay);
        const current = new Date(start);

        while (current <= end) {
          const key = current.toISOString().split("T")[0];
          if (!map[key]) map[key] = [];
          if (!map[key].includes(color)) map[key].push(color);
          current.setDate(current.getDate() + 1);
        }
      });
    });

    setDateToColors(map);
  }, [users]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={[]} // visual only
        height="auto"
        dayCellContent={(arg) => {
          const dateKey = arg.date.toISOString().split("T")[0];
          const colors = dateToColors[dateKey] || [];

          return (
            <div className="relative w-full h-full flex flex-col items-center pt-3 pb-2">
              <span className="text-[1.4rem] font-bold z-10">{arg.dayNumberText}</span>
              <div className="mt-[12px] flex flex-col gap-[4px] w-full px-[10%]">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      height: "5px",
                      backgroundColor: color,
                      borderRadius: "4px",
                      width: "100%",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
