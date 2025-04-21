import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Percent, Building } from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { Navigate } from "react-router-dom";

// Import the implemented PartnerManagement component
import PartnerManagement from "./PartnerManagement";

const DiscountManagement = () => (
  <Card>
    <CardHeader>
      <CardTitle>Discount Management</CardTitle>
      <CardDescription>
        Update discount information for partners
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-gray-500">
        Discount management interface will be displayed here.
      </p>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("partners");
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="partners" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Partners
          </TabsTrigger>
          <TabsTrigger value="discounts" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Discounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="partners">
          <PartnerManagement />
        </TabsContent>

        <TabsContent value="discounts">
          <DiscountManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
