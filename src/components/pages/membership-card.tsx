import { useAuth } from "../../../supabase/auth";
import { Navigate, Link } from "react-router-dom";
import DigitalMembershipCard from "../dashboard/DigitalMembershipCard";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export default function MembershipCardPage() {
  const { user, loading } = useAuth();

  // If not logged in, redirect to login page
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto mb-6">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Your Digital Membership Card
        </h1>

        <div className="mb-8">
          <DigitalMembershipCard />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            How to use your membership card
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Show your digital membership card at any participating Badger
              Padel partner
            </li>
            <li>
              The partner will scan your QR code or enter your membership number
            </li>
            <li>
              Enjoy your exclusive member discounts on tournaments, gear, and
              merchandise
            </li>
          </ol>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Membership Benefits</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <span className="font-medium">Tournament Discounts:</span> Get
              special pricing on all Badger Padel tournaments
            </li>
            <li>
              <span className="font-medium">Gear Discounts:</span> Save on padel
              equipment at participating stores
            </li>
            <li>
              <span className="font-medium">Merchandise Savings:</span>{" "}
              Exclusive discounts on Badger Padel merchandise
            </li>
            <li>
              <span className="font-medium">Community Access:</span> Join our
              WhatsApp group for the latest updates and events
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
