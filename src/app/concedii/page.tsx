import AuthGuard from "@/components/AuthGuard";
import ConcediiWrapper from "@/components/ConcediiWrapper"; 
import ListaConcedii from "@/components/layout/ListaConcedii";
import { getLeaveDays } from "@/utils/fetch-leaveDays";

export default async function ConcediiPage() {
    // ✅ Fetch leave days **server-side inside the component**
    const { leaveDays } = await getLeaveDays();

    return (
        <AuthGuard>
            <ConcediiWrapper>
                <></>
            </ConcediiWrapper>
        </AuthGuard>
    );
}
