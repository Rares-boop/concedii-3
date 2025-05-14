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

            console.log("🔍 Login API Response:", result);

            if (!result.jwt) {
                throw new Error("Invalid credentials");
            }

            saveUserSession(result.jwt); // ✅ Save JWT
            userContext?.refreshUser(); // ✅ Update context

            window.dispatchEvent(new Event("authUpdated")); // ✅ Trigger header update event
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

        console.log("🔍 Storing standalone JWT:", jwt); // ✅ Debugging log

        localStorage.setItem("jwt", jwt); // ✅ Store only the JWT
        window.dispatchEvent(new Event("authUpdated")); // ✅ Ensure header updates immediately
    }

    function handleLogout() {
        localStorage.removeItem("jwt"); // ✅ Remove JWT
        window.dispatchEvent(new Event("authUpdated")); // ✅ Notify header to update
        router.push("/login");
    }

    return (
        <LoginLayout>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Logging in...</p>}

            <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Login</h2>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="email" style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        required
                        autoComplete="email"
                        style={{
                            width: "100%", padding: "12px", fontSize: "16px",
                            borderRadius: "6px", border: "1px solid #ccc"
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label htmlFor="password" style={{ display: "block", fontSize: "16px", marginBottom: "5px" }}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        style={{
                            width: "100%", padding: "12px", fontSize: "16px",
                            borderRadius: "6px", border: "1px solid #ccc"
                        }}
                    />
                </div>

                <button type="submit" style={{
                    width: "100%", padding: "14px", fontSize: "18px", backgroundColor: "#000",
                    color: "#fff", borderRadius: "6px", cursor: "pointer", border: "none",
                    transition: "background 0.3s"
                }}>
                    Login
                </button>
            </form>

            <button onClick={handleLogout} style={{
                marginTop: "20px", padding: "12px", fontSize: "16px", backgroundColor: "#f44336",
                color: "#fff", borderRadius: "6px", cursor: "pointer", border: "none"
            }}>
                Logout
            </button>
        </LoginLayout>
    );
}
