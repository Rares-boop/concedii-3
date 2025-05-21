import { PublicHolidays, User } from "@/types";
import { fetchApi } from "./fetch-api";
import qs from "qs";

export async function getPublicHolidays(): Promise<{ publicHolidays?: PublicHolidays[]; user?: User }> {
  try {
    console.log("🟢 Fetching public holidays...");

    const queryHolidays = qs.stringify({}, { encodeValuesOnly: true });

    const holidaysData = await fetchApi(`/public-holidays?${queryHolidays}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}`, "Content-Type": "application/json" },
    });

    console.log("✅ Raw Public Holidays Response:", JSON.stringify(holidaysData, null, 2));

    if (!holidaysData?.data || !Array.isArray(holidaysData.data)) {
      throw new Error("❌ Public holidays data is missing or incorrectly formatted.");
    }

    // ✅ Correct formatting of holidays before returning
    const formattedHolidays: PublicHolidays[] = holidaysData.data.map((holiday: PublicHolidays) => ({
      holidayName: holiday.holidayName,
      date: holiday.date,
    }));

    console.log("📊 Formatted Public Holidays:", formattedHolidays);

    return { publicHolidays: formattedHolidays };
  } catch (error) {
    console.error("❌ Error fetching public holidays:", (error as Error).message);
    return { publicHolidays: undefined };
}

}

