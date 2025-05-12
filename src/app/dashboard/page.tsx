import AuthGuard from "@/components/AuthGuard";
import  Header  from "@/components/layout/Header";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <h1>Dashboard page</h1>
    </AuthGuard>
  );
}
