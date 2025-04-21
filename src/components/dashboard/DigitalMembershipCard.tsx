import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";

// For storyboard preview support
const useAuthWithMock = () => {
  const authHook = useAuth();
  if (
    typeof window !== "undefined" &&
    window.mockAuthUser &&
    (!authHook.user || authHook.loading)
  ) {
    return { user: window.mockAuthUser, loading: false };
  }
  return authHook;
};

// Add TypeScript interface for window object with our mock properties
declare global {
  interface Window {
    mockAuthUser?: any;
    mockSupabase?: typeof supabase;
  }
}

interface MembershipData {
  id: string;
  membership_number: string;
  created_at: string;
  user_id: string;
  profile_image_url?: string;
}

export default function DigitalMembershipCard() {
  const { user } = useAuthWithMock();
  const [membershipData, setMembershipData] = useState<MembershipData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembershipData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Try to fetch existing membership data
        // Use mock data in storyboard if available
        const supabaseClient = window.mockSupabase || supabase;
        const { data, error } = await supabaseClient
          .from("memberships")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          // PGRST116 means no rows returned - this is expected if user doesn't have a membership yet
          if (error.code !== "PGRST116") {
            console.error("Error fetching membership:", error);
            setLoading(false);
            return;
          }

          // No membership exists, create a new one with a persistent membership number
          // We'll use a deterministic approach based on the user's ID to ensure consistency
          const membershipNumber = generateConsistentMembershipNumber(user.id);

          const { data: newMembership, error: createError } =
            await supabaseClient
              .from("memberships")
              .insert([
                {
                  user_id: user.id,
                  membership_number: membershipNumber,
                },
              ])
              .select()
              .single();

          if (createError) {
            console.error("Error creating membership:", createError);
            setLoading(false);
            return;
          }

          setMembershipData(newMembership);
        } else if (data) {
          // Existing membership found
          setMembershipData(data);
        }
      } catch (exception) {
        console.error("Unexpected error in membership data fetch:", exception);
      } finally {
        setLoading(false);
      }
    }

    fetchMembershipData();
  }, [user]);

  // Generate a unique membership number
  function generateMembershipNumber() {
    const prefix = "BP";
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // 5-digit number
    return `${prefix}${randomDigits}`;
  }

  // Generate a consistent membership number based on user ID
  function generateConsistentMembershipNumber(userId: string) {
    const prefix = "BP";

    // Create a deterministic 5-digit number based on the user ID
    // This ensures the same user always gets the same membership number
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    // Make sure it's positive and 5 digits
    const positiveHash = Math.abs(hash);
    const fiveDigits = (positiveHash % 90000) + 10000; // Ensures 5 digits between 10000-99999

    return `${prefix}${fiveDigits}`;
  }

  // Format date to display on card
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  // Generate QR code URL using a free QR code API
  function getQRCodeUrl() {
    if (!membershipData) return "";
    const data = JSON.stringify({
      membershipNumber: membershipData.membership_number,
      userId: membershipData.user_id,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      data,
    )}`;
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 w-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!membershipData) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Unable to load membership data</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-black text-white shadow-xl rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">Badger Padel</h2>
              <p className="text-gray-300 text-sm">Community Membership</p>
            </div>
            <div className="relative">
              <img
                src="/images/profile-placeholder.jpg"
                alt="Badger Padel Logo"
                className="h-24 w-24 object-cover rounded-md"
              />
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-2 rounded-lg mb-4">
              <img
                src={getQRCodeUrl()}
                alt="Membership QR Code"
                className="w-32 h-32"
              />
            </div>
            <p className="text-xl font-mono font-bold">
              {membershipData.membership_number}
            </p>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-400">Member</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Valid From</p>
                <p className="font-medium">
                  {membershipData.created_at
                    ? formatDate(membershipData.created_at)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#25D366] py-2 px-4 text-center text-xs">
          <p>Present this card at participating venues for member discounts</p>
        </div>
      </CardContent>
    </Card>
  );
}
