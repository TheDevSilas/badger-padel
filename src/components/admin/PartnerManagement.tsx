import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Power, Plus } from "lucide-react";
import { Partner, PartnerType } from "@/models/Partner";
import { getPartners, togglePartnerStatus } from "@/services/partnerService";
import { useToast } from "@/components/ui/use-toast";
import PartnerEditForm from "./PartnerEditForm";

export default function PartnerManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getPartners();
      setPartners(data);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast({
        title: "Error",
        description: "Failed to load partners. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await togglePartnerStatus(id, !currentStatus);
      // Update the local state
      setPartners((prevPartners) =>
        prevPartners.map((partner) =>
          partner.id === id ? { ...partner, active: !currentStatus } : partner,
        ),
      );
      toast({
        title: "Success",
        description: `Partner ${!currentStatus ? "activated" : "deactivated"} successfully.`,
      });
    } catch (error) {
      console.error("Error toggling partner status:", error);
      toast({
        title: "Error",
        description: "Failed to update partner status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPartnerTypeLabel = (type: PartnerType) => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Partner Management</CardTitle>
          <CardDescription>
            Manage existing partner details and status
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            setSelectedPartner(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Partner
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading partners...</p>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No partners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">
                      {partner.name}
                    </TableCell>
                    <TableCell>{getPartnerTypeLabel(partner.type)}</TableCell>
                    <TableCell>{partner.location || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={partner.active ? "default" : "outline"}
                        className={partner.active ? "bg-green-500" : ""}
                      >
                        {partner.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleToggleStatus(partner.id, partner.active)
                          }
                          title={partner.active ? "Deactivate" : "Activate"}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Edit Partner"
                          onClick={() => {
                            setSelectedPartner(partner);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          title="Delete Partner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Partner Edit Modal */}
      <PartnerEditForm
        partner={selectedPartner}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={fetchPartners}
      />

      {/* Partner Create Modal */}
      <PartnerEditForm
        partner={null}
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchPartners}
        isCreating={true}
      />
    </Card>
  );
}
