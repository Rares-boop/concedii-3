"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getPublicHolidays } from "@/utils/fetch-publicHolidays";
import { PublicHolidays } from "@/types";
import MyDatePicker from "@/components/DatePicker";
import MyDatePickerNoButtons from "@/components/DatePickerNoButtons";

export default function HolidaysPage() {
    const [publicHolidays, setPublicHolidays] = useState<PublicHolidays[]>([]);

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

    console.log("📊 Rendered with publicHolidays:", publicHolidays);

    const [isModalOpen, setIsModalOpen] = useState(false);

    async function handleAddPublicHoliday() {
        setIsModalOpen(true);
    }

    async function handleAddModal() {

    }

    return (
        <AuthGuard>
            <h1>Public Holidays</h1>
            <button onClick={handleAddPublicHoliday} style={{
                padding: "12px 24px", // Increased padding
                backgroundColor: "#28a745", // ✅ Green color
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "18px" // Added fontSize to scale up the text
            }}>
                Add Public Holiday
            </button>

            <ul>
                {publicHolidays.length > 0 ? (
                    publicHolidays.map((holiday) => (
                        <li key={holiday.date}>{holiday.holidayName} - {holiday.date}</li>
                    ))
                ) : (
                    <div>
                        <p>🔄 Number of holidays loaded: {publicHolidays.length}</p>
                        <p>⏳ Loading holiday page...</p>
                    </div>
                )}
            </ul>

            {isModalOpen && (
                <div style={{
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
                    zIndex: 1000
                }}>
                    <h2>Public Holiday</h2>
                    <p>Enter holiday details below:</p>
                    <input type="text" placeholder="Holiday Name" style={{ marginBottom: "15px", padding: "10px", width: "100%", fontSize: "16px" }} />
                    {/*<input type="date" style={{ marginBottom: "15px", padding: "10px", width: "100%", fontSize: "16px" }} />*/}
                    <MyDatePickerNoButtons />
                    <button onClick={() => setIsModalOpen(false)} style={{
                        padding: "12px 55px", // Consistent padding
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px"
                    }}>
                        Close
                    </button>

                    <button onClick={() => setIsModalOpen(false)} style={{
                        padding: "12px 30px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "16px"
                    }}>
                        Add holiday
                    </button>


                </div>
            )}

        </AuthGuard>
    );
}
