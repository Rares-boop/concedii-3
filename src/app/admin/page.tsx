"use client";

import { useEffect, useState } from "react";
import { getAllLeaveDays } from "@/utils/fetch-AllLeaveDays";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AuthGuard from "@/components/AuthGuard";
import { getUser } from "@/utils/fetch-user";
import { useRouter } from "next/navigation";


export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDocumentId, setEditDocumentId] = useState<string | null>(null);
  const [status, setStatus] = useState("Pending");
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

const router = useRouter();

useEffect(() => {
  async function checkRole() {
    const { user } = await getUser();
    if (!user || user.role?.name !== "Admin") {
      router.push("/"); 
    }
  }

  checkRole();
}, []);


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
    return new Date(d).toISOString().split("T")[0];
  }

  function openEditModal(leave: any) {
    setEditDocumentId(leave.documentId);
    setStatus(leave.statusRequest);
    setSelectedRange({
      from: new Date(leave.firstDay),
      to: new Date(leave.lastDay),
    });
    setIsEditModalOpen(true);
  }

  async function handleDelete(documentId: string) {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("❌ Not authenticated");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/leave-days/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) throw new Error(await res.text());

      setUsers((prev) =>
        prev.map((user) => ({
          ...user,
          leave_days: user.leave_days.filter((l: any) => l.documentId !== documentId),
        }))
      );
      alert("🗑️ Leave request deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error deleting leave request.");
    }
  }

  async function handleSaveEdit() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || !editDocumentId || !selectedRange?.from || !selectedRange?.to) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/leave-days/${editDocumentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            firstDay: new Date(Date.UTC(
              selectedRange.from.getFullYear(),
              selectedRange.from.getMonth(),
              selectedRange.from.getDate()
            )).toISOString().slice(0, 10),

            lastDay: new Date(Date.UTC(
              selectedRange.to.getFullYear(),
              selectedRange.to.getMonth(),
              selectedRange.to.getDate()
            )).toISOString().slice(0, 10),

            statusRequest: status,
          },
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();

      setUsers((prev) =>
        prev.map((user) => ({
          ...user,
          leave_days: user.leave_days.map((l: any) =>
            l.documentId === editDocumentId ? updated.data : l
          ),
        }))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("❌ Error saving edit.");
    }
  }

  return (
    <AuthGuard>
      <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 0" }}>
        <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto", padding: "0 20px" }}>
          <h1 style={{ marginBottom: "30px", textAlign: "center" }}>
            📋 All Leave Requests (by User)
          </h1>

          {loading ? (
            <p style={{ textAlign: "center" }}>⏳ Loading data...</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "24px" }}
              >
                <h3 style={{ marginBottom: "12px" }}>🧑‍💼 {user.email}</h3>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {user.leave_days?.map((leave: any) => (
                    <li
                      key={leave.documentId}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "14px", gap: "10px" }}
                    >
                      <div
                        style={{ backgroundColor: "#f9f9f9", padding: "12px 16px", borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.08)", flexGrow: 1, minWidth: "250px", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                      >
                        <span>📅 {leave.firstDay} → {leave.lastDay}</span>
                        <span
                          style={{ backgroundColor: leave.statusRequest === "Approved" ? "#28a745" : leave.statusRequest === "Rejected" ? "#dc3545" : "#ffc107", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold", marginLeft: "12px", whiteSpace: "nowrap" }}
                        >
                          {leave.statusRequest}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                        <button onClick={() => openEditModal(leave)} style={{ backgroundColor: "#007bff", color: "white", padding: "6px 14px", borderRadius: "8px", fontWeight: "bold", fontSize: "0.85rem", border: "none", cursor: "pointer" }}>Edit</button>
                        <button onClick={() => handleDelete(leave.documentId)} style={{ backgroundColor: "#dc3545", color: "white", padding: "6px 14px", borderRadius: "8px", fontWeight: "bold", fontSize: "0.85rem", border: "none", cursor: "pointer" }}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {isEditModalOpen && (
          <div
            style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "40px", borderRadius: "12px", boxShadow: "0px 6px 15px rgba(0,0,0,0.3)", zIndex: 1000, width: "400px", maxWidth: "95%" }}
          >
            <h3 style={{ marginBottom: "20px" }}>✏️ Edit Leave</h3>
            <label style={{ display: "block", marginBottom: "12px" }}>Pick a date range:</label>
            <DayPicker mode="range" selected={selectedRange} onSelect={setSelectedRange} numberOfMonths={1} />

            <label style={{ display: "block", marginTop: "20px", fontWeight: "bold" }}>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ marginTop: "6px", width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{ backgroundColor: "#6c757d", color: "white", padding: "10px 50px", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                style={{ backgroundColor: "#28a745", color: "white", padding: "10px 55px", borderRadius: "8px", fontWeight: "bold", border: "none", cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
