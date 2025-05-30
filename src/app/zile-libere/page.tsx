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
  const [isRecurring, setIsRecurring] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDocumentId, setEditDocumentId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const response = await getPublicHolidays();
        if (response?.publicHolidays) {
          setPublicHolidays(response.publicHolidays);
        }
      } catch (error) {
        console.error("❌ Error fetching holidays:", (error as Error).message);
      }
    }
    fetchHolidays();
  }, []);

  async function handleAddModal(holidayName: string, selectedDate: Date | undefined) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("❌ Not authenticated.");
    if (!holidayName || !selectedDate) return alert("⚠️ Fill in the holiday name and date.");

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
            date: selectedDate.toLocaleDateString("en-CA"),
            recurring: isRecurring,
          },
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();

      setPublicHolidays([...publicHolidays, result.data]);
      closeModal();
    } catch (error) {
      console.error("❌ Error saving holiday:", error);
    }
  }

  async function handleEditModal() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || !editDocumentId || !selectedDate || !holidayName) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/public-holidays/${editDocumentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            holidayName,
            date: selectedDate.toLocaleDateString("en-CA"),
            recurring: isRecurring,
          },
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();

      setPublicHolidays((prev) =>
        prev.map((h) => (h.documentId === editDocumentId ? updated.data : h))
      );
      closeModal();
    } catch (error) {
      console.error("❌ Error editing holiday:", error);
    }
  }

  async function handleDelete(documentId: string) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("❌ Not authenticated");

    if (!confirm("Are you sure you want to delete this holiday?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/public-holidays/${documentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      setPublicHolidays((prev) => prev.filter((h) => h.documentId !== documentId));
    } catch (error) {
      console.error("❌ Error deleting holiday:", error);
    }
  }

  function getDisplayDate(holiday: PublicHolidays): string {
    const [year, month, day] = holiday.date.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (holiday.recurring) date.setFullYear(new Date().getFullYear());
    return date.toLocaleDateString();
  }

  function openEditModal(holiday: PublicHolidays) {
    setIsEditMode(true);
    setIsModalOpen(true);
    setHolidayName(holiday.holidayName);
    setSelectedDate(new Date(holiday.date));
    setIsRecurring(holiday.recurring ?? false);
    setEditDocumentId(holiday.documentId);
  }

  function closeModal() {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditDocumentId(null);
    setHolidayName("");
    setSelectedDate(undefined);
    setIsRecurring(false);
  }

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Public Holidays</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold shadow transition"
        >
          Add Public Holiday
        </button>

        <ul className="space-y-3">
          {publicHolidays.map((holiday) => (
            <li
              key={`${holiday.holidayName}-${holiday.date}`}
              className="bg-gray-100 px-4 py-2 rounded shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800">{holiday.holidayName}</span>
                {holiday.recurring && (
                  <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    recurring
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{getDisplayDate(holiday)}</span>
                <button
                  onClick={() => openEditModal(holiday)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(holiday.documentId)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
            height: "650px",
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

          <div style={{ marginTop: "15px" }}>
            <label>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              🔁 This holiday recurs every year
            </label>
          </div>

          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={closeModal}
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
              onClick={() =>
                isEditMode
                  ? handleEditModal()
                  : handleAddModal(holidayName, selectedDate)
              }
              disabled={!holidayName || !selectedDate}
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
              {isEditMode ? "Edit Holiday" : "Add Holiday"}
            </button>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
