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
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Lista Concedii</h2>

      <ul className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {filtered.map((leave, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded shadow-sm"
          >
            <span>
              {new Date(leave.firstDay).toLocaleDateString()} –{" "}
              {new Date(leave.lastDay).toLocaleDateString()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                leave.statusRequest === "Approved"
                  ? "bg-green-500 text-white"
                  : leave.statusRequest === "Rejected"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              {leave.statusRequest || "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}