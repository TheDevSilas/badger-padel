import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Partner } from "@/models/Partner";
import { getPartnerById } from "@/services/partnerService";
import { useToast } from "@/components/ui/use-toast";

export default function PartnerDetails() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (partnerId) {
      fetchPartnerDetails(partnerId);
    }
  }, [partnerId]);

  const fetchPartnerDetails = async (id: string) => {
    try {
      setLoading(true);
      const data = await getPartnerById(id);
      setPartner(data);
    } catch (error) {
      console.error("Error fetching partner details:", error);
      toast({
        title: "Error",
        description: "Failed to load partner details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPartnerTypeLabel = (type: string) => {
    switch (type) {
      case "court":
        return "Court";
      case "shop":
        return "Shop";
      case "brand":
        return "Brand";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading partner details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!partner) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center py-8 gap-4">
            <p className="text-gray-500">Partner not found.</p>
            <Button onClick={() => navigate("/admin/partners")}>
              Back to Partners
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/partners")}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{partner.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>{getPartnerTypeLabel(partner.type)}</span>
              <Badge
                variant={partner.active ? "default" : "outline"}
                className={partner.active ? "bg-green-500" : ""}
              >
                {partner.active ? "Active" : "Inactive"}
              </Badge>
            </CardDescription>
          </div>
          {partner.imageUrl && (
            <div className="w-24 h-24 rounded-md overflow-hidden">
              <img
                src={partner.imageUrl}
                alt={`${partner.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Contact Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Location:</span>{" "}
                {partner.location || "N/A"}
              </p>
              {partner.contactPerson && (
                <p>
                  <span className="font-medium">Contact Person:</span>{" "}
                  {partner.contactPerson}
                </p>
              )}
              {partner.email && (
                <p>
                  <span className="font-medium">Email:</span> {partner.email}
                </p>
              )}
              {partner.phone && (
                <p>
                  <span className="font-medium">Phone:</span> {partner.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Online Presence</h3>
            <div className="space-y-2">
              {partner.website && (
                <p>
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                  >
                    {partner.website} <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              )}
              {partner.socialMediaLink && (
                <p>
                  <span className="font-medium">Social Media:</span>{" "}
                  <a
                    href={partner.socialMediaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 inline-flex"
                  >
                    View Profile <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Member Benefits</h3>
          <p>{partner.memberBenefit || "No specific benefits listed."}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Discounts</h3>
          {partner.discounts && partner.discounts.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {partner.discounts.map((discount, index) => (
                <li key={index}>
                  {typeof discount === "string"
                    ? discount
                    : discount.description}
                </li>
              ))}
            </ul>
          ) : (
            <p>No discounts available.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button
          variant="outline"
          onClick={() => navigate(`/admin/partners/edit/${partner.id}`)}
        >
          Edit Partner
        </Button>
      </CardFooter>
    </Card>
  );
}
