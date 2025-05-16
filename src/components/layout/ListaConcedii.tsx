"use client";

import { useEffect, useState } from "react";
import { LeaveDays } from "@/types";
import { getLeaveDays } from "@/utils/fetch-leaveDays";

export default function ListaConcedii() {
    const [leaveDays, setLeaveDays] = useState<LeaveDays[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("🚀 Fetching leave days..."); // ✅ Log fetch start
                setLoading(true);
                setError(null);

                const { leaveDays } = await getLeaveDays();

                console.log("✅ Received Leave Days:", leaveDays); // ✅ Log fetched data
                setLeaveDays(leaveDays || []);
            } catch (err) {
                console.error("❌ Error fetching leave days:", err); // ✅ Log error
                setError("Failed to load leave days.");
            } finally {
                console.log("🔄 Fetch process completed."); // ✅ Log completion
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    console.log("📡 Current Leave Days State:", leaveDays); // ✅ Log state changes
    console.log("📡 Leave Days Count:", leaveDays.length);


    return (
        <div className="container">
            <div className="leave-list">
                <h1>Lista Concedii</h1>

                {loading && <p>Loading leave days...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                {!loading && !error && Array.isArray(leaveDays) && leaveDays.length > 0 ? (
    <ul>
    {leaveDays.map((leave, idx) => (
        <li key={`leave-day-${idx}`}>
            {leave.firstDay ? new Date(leave.firstDay).toLocaleDateString() : "No Date"} -
            {leave.lastDay ? new Date(leave.lastDay).toLocaleDateString() : "No Date"} 
            ({leave.status || "Pending"})
        </li>
    ))}
</ul>

) : (
    !loading && <p>❌ No leave days found.</p>
)}

            </div>
        </div>
    );
}
