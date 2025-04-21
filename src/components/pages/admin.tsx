import { Navigate } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";
import { useAuth } from "../../../supabase/auth";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AdminDashboard />;
}
