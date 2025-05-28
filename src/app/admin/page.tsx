"use client";

import { useEffect, useState } from "react";
import { getAllLeaveDays } from "@/utils/fetch-AllLeaveDays";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await getAllLeaveDays();
        setUsers(result);
      } catch (e) {
        alert((e as Error).message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString();
  }

  return (
  <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 0" }}>
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: "30px", textAlign: "center" }}>
        📋 All Leave Requests (by User)
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>⏳ Loading data...</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ marginBottom: "12px" }}>🧑‍💼 {user.email}</h3>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {user.leave_days && user.leave_days.length > 0 ? (
                user.leave_days.map((leave: any) => (
                  <li
                    key={leave.id}
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "10px",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      📅 {formatDate(leave.firstDay)} → {formatDate(leave.lastDay)}
                    </span>
                    <span
                      style={{
                        backgroundColor:
                          leave.statusRequest === "Approved"
                            ? "#28a745"
                            : leave.statusRequest === "Rejected"
                            ? "#dc3545"
                            : "#ffc107",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                      }}
                    >
                      {leave.statusRequest}
                    </span>
                  </li>
                ))
              ) : (
                <li style={{ fontStyle: "italic", color: "#777" }}>
                  ❌ No leave days found.
                </li>
              )}
            </ul>
          </div>
        ))
      )}
    </div>
  </div>
);

}
