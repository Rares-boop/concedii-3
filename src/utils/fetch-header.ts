import qs from "qs";
import { Header, User } from "@/types";

export async function getHeaderData(): Promise<{ header: Header; user?: User }> {
  const apiUrl = process.env.NEXT_PUBLIC_API;

  if (!apiUrl) {
    throw new Error("API URL is missing in environment variables!");
  }

  // Fetch Header Data
  const headerQuery = qs.stringify(
    {
      populate: {
        logo: { populate: "image" },
        link: true,
        user: { populate: "image" }, // Retrieves user image but not full user details
      },
    },
    { encodeValuesOnly: true }
  );

  const headerResponse = await fetch(`${apiUrl}/api/header?${headerQuery}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!headerResponse.ok) {
    throw new Error(`Failed to fetch header data: ${headerResponse.status} ${headerResponse.statusText}`);
  }

  const headerData = (await headerResponse.json()).data as Header;

  // Fetch Full User Data Separately
  let userData: User | undefined;
  const userSession = localStorage.getItem("user");

  if (userSession) {
    try {
      const parsedUser = JSON.parse(userSession);
      if (parsedUser.jwt) {
        const userResponse = await fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${parsedUser.jwt}`, "Content-Type": "application/json" },
        });

        if (userResponse.ok) {
          userData = await userResponse.json();
        }
      }
    } catch {
      console.error("Failed to fetch user data.");
    }
  }

  return { header: headerData, user: userData };
}
