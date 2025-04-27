import { useAuth } from "../../../supabase/auth";
import { Navigate } from "react-router-dom";

// Import the implemented PartnerManagement component
import PartnerManagement from "./PartnerManagement";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  // For development purposes, allow any logged-in user to access admin
  const isAdmin = true; // Allow any authenticated user to access admin
  console.log("User authenticated:", !!user, "Is admin:", isAdmin);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <PartnerManagement />
    </div>
  );
}
