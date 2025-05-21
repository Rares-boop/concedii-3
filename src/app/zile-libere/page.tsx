"use client"; 

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getPublicHolidays } from "@/utils/fetch-publicHolidays";
import { PublicHolidays } from "@/types";

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

    return (
        <AuthGuard>
            <h1>Public Holidays</h1>
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
        </AuthGuard>
    );
}
