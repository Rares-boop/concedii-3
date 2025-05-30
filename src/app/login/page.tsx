"use client";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginLayout from "./LoginLayout";
import { fetchApi } from "@/utils/fetch-api";
import { useUser } from "./UserContext";

export default function LoginPage() {
  const router = useRouter();
  const userContext = useUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) router.push("/");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const result = await fetchApi("auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!result.jwt) {
        throw new Error("Invalid credentials");
      }

      saveUserSession(result.jwt);
      userContext?.refreshUser();

      window.dispatchEvent(new Event("authUpdated"));
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }

  function saveUserSession(jwt: string) {
    if (!jwt) {
      console.error("❌ Missing JWT in login response!");
      return;
    }

    localStorage.setItem("jwt", jwt);
    window.dispatchEvent(new Event("authUpdated"));
  }

  return (
    <LoginLayout>
      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.heading}>Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          {loading && <p style={styles.loading}>Logging in...</p>}

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </LoginLayout>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: "20px",
  } as React.CSSProperties,

  form: {
    backgroundColor: "#fff",
    padding: "40px 35px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
  } as React.CSSProperties,

  heading: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "30px",
    color: "#111827",
    textAlign: "center",
  } as React.CSSProperties,

  error: {
    color: "#dc2626",
    marginBottom: "20px",
    fontWeight: "600",
    textAlign: "center",
  } as React.CSSProperties,

  loading: {
    color: "#6b7280",
    marginBottom: "20px",
    textAlign: "center",
  } as React.CSSProperties,

  field: {
    marginBottom: "20px",
  } as React.CSSProperties,

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
  } as React.CSSProperties,

  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1.5px solid #d1d5db",
    transition: "border-color 0.2s ease",
    outlineOffset: "2px",
  } as React.CSSProperties,

  button: {
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    fontWeight: 700,
    backgroundColor: "#111827",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  } as React.CSSProperties,
};
