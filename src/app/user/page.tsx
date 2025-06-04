"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getUser } from "@/utils/fetch-user";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong" | "">("");


  useEffect(() => {
    async function load() {
      const { user } = await getUser();
      setUser(user);
    }
    load();
  }, []);

  async function handleSaveEmail() {
    const jwt = localStorage.getItem("jwt");
    const trimmedEmail = newEmail.trim();

    if (!jwt || !trimmedEmail) return alert("Missing email or authentication");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
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
          email: trimmedEmail,
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

  async function handleChangePassword() {
    const jwt = localStorage.getItem("jwt");

    if (!jwt) return alert("Missing authentication.");
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("Please fill all fields.");
    }
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match.");
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to change password.");
      }

      alert("✅ Password changed!");
      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("❌ Failed to change password:", err);
      alert("❌ " + err.message);
    }
  }

  function evaluatePasswordStrength(password: string) {
    let strength: "Weak" | "Medium" | "Strong" = "Weak";

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    const conditionsMet = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

    if (password.length >= 8 && conditionsMet >= 3) {
      strength = "Strong";
    } else if (password.length >= 6 && conditionsMet >= 2) {
      strength = "Medium";
    }

    setPasswordStrength(password ? strength : "");
  }

  function getStrengthColor(strength: "Weak" | "Medium" | "Strong") {
    switch (strength) {
      case "Weak":
        return "red";
      case "Medium":
        return "orange";
      case "Strong":
        return "green";
      default:
        return "black";
    }
  }


  if (!user) return <div>Loading...</div>;

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

          {/* Email Section */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Email</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                value={user.email || ""}
                disabled
                style={{ flexGrow: 1, padding: "10px", marginRight: "10px" }}
              />
              <button
                onClick={() => setShowEmailModal(true)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Change
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Password</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="password"
                value="********"
                disabled
                style={{ flexGrow: 1, padding: "10px", marginRight: "10px" }}
              />
              <button
                onClick={() => setShowPasswordModal(true)}
                style={{
                  backgroundColor: "#ffc107",
                  color: "black",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Change
              </button>
            </div>
          </div>

        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div style={modalStyle}>
            <h3>Change Email</h3>
            <input
              autoFocus
              placeholder="New email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveEmail()}
              style={inputStyle}
            />
            <div style={modalButtonContainer}>
              <button onClick={() => setShowEmailModal(false)} style={cancelBtn}>Cancel</button>
              <button onClick={handleSaveEmail} style={confirmBtn}>Save</button>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div style={modalStyle}>
            <h3>Change Password</h3>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => {
                const val = e.target.value;
                setNewPassword(val);
                evaluatePasswordStrength(val);
              }}
              style={inputStyle}
            />

            {passwordStrength && (
              <div style={{ marginTop: "6px", fontWeight: "bold", color: getStrengthColor(passwordStrength) }}>
                Password strength: {passwordStrength}
              </div>
            )}

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
              style={inputStyle}
            />
            <div style={modalButtonContainer}>
              <button onClick={() => setShowPasswordModal(false)} style={cancelBtn}>Cancel</button>
              <button onClick={handleChangePassword} style={confirmBtn}>Save</button>
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
