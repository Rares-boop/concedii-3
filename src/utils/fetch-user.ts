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
    const userQuery = qs.stringify(
      {
        populate: ["role"], 
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

