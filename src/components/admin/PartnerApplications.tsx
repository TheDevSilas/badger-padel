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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, X, ExternalLink } from "lucide-react";
import { PartnerApplication } from "@/models/Partner";
import {
  getPartnerApplications,
  approveApplication,
  updateApplicationStatus,
} from "@/services/partnerService";

export default function PartnerApplications() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<PartnerApplication | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getPartnerApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      setError("Failed to load partner applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (
    application: PartnerApplication,
    action: "approve" | "reject",
  ) => {
    setSelectedApplication(application);
    setActionType(action);
    setFeedbackMessage("");
  };

  const handleSubmit = async () => {
    if (!selectedApplication || !actionType) return;

    try {
      setIsSubmitting(true);

      if (actionType === "approve") {
        await approveApplication(selectedApplication, feedbackMessage);
      } else {
        await updateApplicationStatus(
          selectedApplication.id!,
          "rejected",
          feedbackMessage,
        );
      }

      // Refresh the applications list
      await fetchApplications();

      // Close the dialog
      closeDialog();
    } catch (err) {
      console.error("Error processing application:", err);
      setError(`Failed to ${actionType} application`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    setSelectedApplication(null);
    setActionType(null);
    setFeedbackMessage("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Partner Applications</CardTitle>
          <CardDescription>
            Review and manage pending partner applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading applications...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">{error}</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No partner applications found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell className="capitalize">{app.type}</TableCell>
                    <TableCell>
                      {app.contactPerson}
                      {app.website && (
                        <a
                          href={app.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      {app.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            onClick={() => handleAction(app, "approve")}
                          >
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                            onClick={() => handleAction(app, "reject")}
                          >
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedApplication && !!actionType}
        onOpenChange={closeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Partner
              Application
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will approve the application and create a new partner entry."
                : "This will reject the application and notify the applicant."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-medium">Business Name</h4>
              <p>{selectedApplication?.name}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium">
                Feedback Message (Optional)
              </h4>
              <Textarea
                placeholder="Enter any feedback or notes..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant={actionType === "approve" ? "default" : "destructive"}
            >
              {isSubmitting
                ? "Processing..."
                : actionType === "approve"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
