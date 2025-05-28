/*import { User } from "@/types";
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
      populate: ["role", "leave_days"], 
    },
    { encodeValuesOnly: true }
  );

  try {
    const response = await fetch(`${apiUrl}/api/users/me?${userQuery}`, {
      headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      throw new Error(`Failed to fetch user data: ${response.status} - ${errorText}`);
    }

    const userData = await response.json();
    if (!userData) {
      console.warn("User data returned as undefined.");
      return { user: undefined };
    }

    return { user: userData }; 
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}*/

import { User, LeaveDays } from "@/types";
import qs from "qs";

export async function getUser(): Promise<{ user?: User; leaveDays?: LeaveDays[] }> {
  const apiUrl = process.env.NEXT_PUBLIC_API;
  if (!apiUrl) throw new Error("API URL is missing in environment variables!");

  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    console.warn("JWT token is missing, returning undefined user.");
    return { user: undefined, leaveDays: undefined };
  }

  try {
    // Step 1: Fetch the user (with role only)
    const userQuery = qs.stringify(
      {
        populate: ["role"], // no leave_days here
      },
      { encodeValuesOnly: true }
    );

    const userRes = await fetch(`${apiUrl}/api/users/me?${userQuery}`, {
      headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      throw new Error(`❌ Failed to fetch user data: ${userRes.status} - ${errorText}`);
    }

    const user = await userRes.json();

    if (!user?.id) {
      console.warn("User data returned but missing ID.");
      return { user: undefined, leaveDays: undefined };
    }

    // Step 2: Fetch leave_days filtered by user ID
    const leaveQuery = qs.stringify({
      filters: {
        user: {
          id: {
            $eq: user.id,
          },
        },
      },
    }, { encodeValuesOnly: true });

    const leaveRes = await fetch(`${apiUrl}/api/leave-days?${leaveQuery}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const leaveJson = await leaveRes.json();
    const leaveDays = leaveJson?.data || [];

    return { user, leaveDays };

  } catch (error) {
    console.error("❌ Error fetching user or leave days:", error);
    return { user: undefined, leaveDays: undefined };
  }
}

