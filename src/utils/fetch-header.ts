import qs from "qs";
import { Header, User } from "@/types";

export async function getHeaderData(): Promise<{ header: Header; user?: User }> {
  const apiUrl = process.env.NEXT_PUBLIC_API;
  if (!apiUrl) throw new Error("API URL is missing in environment variables!");

  const headerQuery = qs.stringify(
    {
      populate: {
        logo: { populate: "image" },
        link: true,
        user: { populate: "image" },
      },
    },
    { encodeValuesOnly: true }
  );

  const jwt = localStorage.getItem("jwt"); 

  try {
    const [headerResponse, userResponse] = await Promise.all([
      fetch(`${apiUrl}/api/header?${headerQuery}`, { headers: { "Content-Type": "application/json" } }),
      jwt
        ? fetch(`${apiUrl}/api/users/me`, {
            headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
          })
        : Promise.resolve(null),
    ]);

    if (!headerResponse.ok) throw new Error(`Failed to fetch header data: ${headerResponse.status}`);
    const headerData = (await headerResponse.json()).data as Header;

    const userData = userResponse && userResponse.ok ? await userResponse.json() : undefined;


    return { header: headerData, user: userData };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
