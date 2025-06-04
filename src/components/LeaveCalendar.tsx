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
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const tempEvents: any[] = [];

    let zIndex = 1; // ensure proper stacking order

    users.forEach((user, userIndex) => {
      const color = user.color || "#888";

      user.leave_days?.forEach((leave, leaveIndex) => {
        if (leave.statusRequest !== "Approved") return;

        const start = new Date(leave.firstDay);
        const end = new Date(leave.lastDay);
        const current = new Date(start);

        while (current <= end) {
          const day = current.toISOString().split("T")[0];

          tempEvents.push({
            start: day,
            allDay: true,
            display: "block",
            backgroundColor: color,
            className: `underline-layer-${userIndex}`,
            id: `${user.id}-${day}-${leaveIndex}`,
          });

          current.setDate(current.getDate() + 1);
        }
      });
    });

    setEvents(tempEvents);
  }, [users]);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}
