"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getPublicHolidays } from "@/utils/fetch-publicHolidays";
import { PublicHolidays } from "@/types";
import MyDatePickerNoButtons from "@/components/DatePickerNoButtons";

export default function HolidaysPage() {
  const [publicHolidays, setPublicHolidays] = useState<PublicHolidays[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayName, setHolidayName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function fetchHolidays() {
      console.log("🟢 Fetching public holidays...");
      try {
        const response = await getPublicHolidays();
        console.log("✅ Raw response:", response);
        if (response?.publicHolidays) {
          setPublicHolidays(response.publicHolidays);
          console.log("📊 Set publicHolidays:", response.publicHolidays);
        } else {
          console.warn("⚠️ No data found in API response");
        }
      } catch (error) {
        console.error("❌ Error fetching holidays:", (error as Error).message);
      }
    }
    fetchHolidays();
  }, []);

  async function handleAddModal(holidayName: string, selectedDate: Date | undefined) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("❌ Not authenticated.");
      return;
    }

    if (!holidayName || !selectedDate) {
      alert("⚠️ Fill in the holiday name and date.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/public-holidays`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            holidayName,
            date: selectedDate.toISOString().split("T")[0], // format: YYYY-MM-DD
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`❌ Failed to create public holiday: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      console.log("✅ Public holiday created:", result);
      setPublicHolidays([...publicHolidays, result.data]);
      setIsModalOpen(false);
      setHolidayName("");
      setSelectedDate(undefined);
    } catch (error) {
      console.error(error);
      alert("❌ Error saving public holiday.");
    }
  }

  return (
    <AuthGuard>
      <h1>Public Holidays</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "12px 24px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Add Public Holiday
      </button>

      <ul>
        {publicHolidays.length > 0 ? (
          publicHolidays.map((holiday) => (
            <li key={holiday.date}>
              {holiday.holidayName} - {holiday.date}
            </li>
          ))
        ) : (
          <div>
            <p>🔄 Number of holidays loaded: {publicHolidays.length}</p>
            <p>⏳ Loading holiday page...</p>
          </div>
        )}
      </ul>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0px 6px 15px rgba(0,0,0,0.3)",
            width: "400px",
            height: "550px",
            zIndex: 1000,
          }}
        >
          <h2>Public Holiday</h2>
          <p>Enter holiday details below:</p>
          <input
            type="text"
            placeholder="Holiday Name"
            value={holidayName}
            onChange={(e) => setHolidayName(e.target.value)}
            style={{ marginBottom: "15px", padding: "10px", width: "100%", fontSize: "16px" }}
          />

          <MyDatePickerNoButtons
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: "12px 30px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Close
            </button>

            <button
              onClick={() => handleAddModal(holidayName, selectedDate)}
              style={{
                padding: "12px 30px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              Add holiday
            </button>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
