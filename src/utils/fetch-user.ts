import { User } from "@/types";
import qs from "qs";

export async function getUser(): Promise<{ user?: User }> {
  const apiUrl = process.env.NEXT_PUBLIC_API;
  if (!apiUrl) throw new Error("API URL is missing in environment variables!");

  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.warn("JWT token is missing, returning undefined user.");
    return { user: undefined };
  }

  const userQuery = qs.stringify(
    {
      populate: ["role", "leave_days"], // ✅ Using array format for population
    },
    { encodeValuesOnly: true }
  );

  try {
    const response = await fetch(`${apiUrl}/api/users/me?${userQuery}`, {
      headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Log API error response
      throw new Error(`Failed to fetch user data: ${response.status} - ${errorText}`);
    }

    const userData = await response.json();
    if (!userData) {
      console.warn("User data returned as undefined.");
      return { user: undefined };
    }

    return { user: userData }; // ✅ No `{ data }` wrapping
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}
