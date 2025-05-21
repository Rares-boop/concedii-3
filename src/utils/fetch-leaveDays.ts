import { LeaveDays, User } from "@/types";
import { fetchApi } from "./fetch-api";
import qs from "qs";

export async function getLeaveDays(): Promise<{ leaveDays?: LeaveDays[]; user?: User }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API;
    if (!apiUrl) throw new Error("❌ API URL is missing!");

    let jwt: string | null =  localStorage.getItem("jwt");
    console.log("🔑 JWT Token bytfrt:", jwt);


    /*const userData = await fetchApi("users/me?populate=role&populate=leave_days", {
        headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
    });*/

    const query = qs.stringify(
    {
        populate: ["role", "leave_days"],
    },
    { encodeValuesOnly: true }
);

const userData = await fetchApi(`users/me?${query}`, {
    headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
});


    if (!userData?.id) throw new Error("❌ User ID not found in response.");

    console.log("✅ Full User Data:", userData);

    const userLeaveDays = userData.leave_days ?? [];
    console.log(userLeaveDays);
    return { leaveDays: userLeaveDays, user: userData };
  } catch (error) {
    return { leaveDays: undefined, user: undefined };
  }
}
