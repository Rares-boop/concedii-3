"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getUser } from "@/utils/fetch-user";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    async function load() {
      const { user } = await getUser();
      setUser(user);
    }
    load();
  }, []);

  async function handleSaveEmail() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt || !newEmail) return alert("Missing email or authentication");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return alert("❌ Please enter a valid email address.");
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      alert("✅ Email updated!");
      setShowEmailModal(false);
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to update email:", err);
      alert("❌ Error updating email");
    }
  }

  return (
    <AuthGuard>
      <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 0" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "30px",
            borderRadius: "12px",
            backgroundColor: "white",
            boxShadow: "0px 6px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "30px" }}>🧑‍💼 My Account</h2>

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Email</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={user?.email || ""}
                disabled
                style={{ flexGrow: 1, padding: "10px", marginRight: "10px" }}
              />
              <button
                onClick={() => setShowEmailModal(true)}
                style={{ backgroundColor: "#007bff", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}
              >
                Change
              </button>
            </div>
          </div>

          {/* Role */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Role</label>
            <input
              type="text"
              value={user?.role?.name || ""}
              disabled
              style={{ width: "100%", padding: "10px" }}
            />
          </div>
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div style={modalStyle}>
            <h3>Change Email</h3>
            <input
              placeholder="New email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={inputStyle}
            />
            <div style={modalButtonContainer}>
              <button onClick={() => setShowEmailModal(false)} style={cancelBtn}>Cancel</button>
              <button onClick={handleSaveEmail} style={confirmBtn}>Save</button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0px 6px 15px rgba(0,0,0,0.3)",
  zIndex: 1000,
  width: "400px",
  maxWidth: "95%",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  marginTop: "10px",
};

const modalButtonContainer = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const cancelBtn = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const confirmBtn = {
  backgroundColor: "#28a745",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};
