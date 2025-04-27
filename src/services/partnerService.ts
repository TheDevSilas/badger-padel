import { supabase } from "../../supabase/supabase";
import {
  PartnerApplication,
  ApplicationStatus,
  Partner,
  Discount,
} from "../models/Partner";

/**
 * Fetch all partner applications
 */
export async function getPartnerApplications(): Promise<PartnerApplication[]> {
  const { data, error } = await supabase
    .from("partner_applications")
    .select("*")
    .order("applicationDate", { ascending: false });

  if (error) {
    console.error("Error fetching partner applications:", error);
    throw error;
  }

  return data || [];
}

/**
 * Submit a new partner application
 */
export async function submitPartnerApplication(
  application: PartnerApplication,
): Promise<void> {
  const { error } = await supabase
    .from("partner_applications")
    .insert(application);

  if (error) {
    console.error("Error submitting partner application:", error);
    throw error;
  }
}

/**
 * Update the status of a partner application
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  message?: string,
): Promise<void> {
  const updateData: { status: ApplicationStatus; message?: string } = {
    status,
  };

  if (message) {
    updateData.message = message;
  }

  const { error } = await supabase
    .from("partner_applications")
    .update(updateData)
    .eq("id", applicationId);

  if (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}

/**
 * Approve a partner application and create a new partner entry
 */
export async function approveApplication(
  application: PartnerApplication,
  message?: string,
): Promise<void> {
  // First update the application status
  await updateApplicationStatus(application.id!, "approved", message);

  // Then create a new partner entry
  const { error } = await supabase.from("partners").insert({
    name: application.name,
    type: application.type,
    location: application.location,
    phone: application.phone,
    website: application.website,
    socialMediaLink: application.socialMediaLink,
    memberBenefit: application.memberBenefit,
    email: application.email,
    contactPerson: application.contactPerson,
    applicationDate: application.applicationDate,
    approvalDate: new Date().toISOString(),
    status: "approved",
    active: true,
    discounts: application.proposedDiscounts.map((desc, index) => ({
      id: `${index}`,
      description: desc,
    })),
    imageUrl: application.imageUrl,
    image:
      application.imageUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(application.name)}`,
  });

  if (error) {
    console.error("Error creating partner from application:", error);
    throw error;
  }
}

/**
 * Fetch all partners
 */
export async function getPartners(): Promise<Partner[]> {
  const { data, error } = await supabase.from("partners").select("*");

  if (error) {
    console.error("Error fetching partners:", error);
    throw new Error("Failed to fetch partners");
  }

  return data as Partner[];
}

/**
 * Fetch a single partner by ID
 */
export async function getPartnerById(id: string): Promise<Partner> {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching partner:", error);
    throw new Error("Failed to fetch partner details");
  }

  return data as Partner;
}

/**
 * Create a new partner
 */
export async function createPartner(
  partnerData: Partial<Partner>,
): Promise<void> {
  // Format discounts if they are strings
  const formattedData = {
    ...partnerData,
    discounts: Array.isArray(partnerData.discounts)
      ? partnerData.discounts.map((discount, index) => {
          if (typeof discount === "string") {
            return { id: `${index}`, description: discount };
          }
          return discount;
        })
      : [],
    image:
      partnerData.image ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(partnerData.name || "Partner")}`,
    status: "approved", // Set a default status to satisfy the not-null constraint
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("partners").insert(formattedData);

  if (error) {
    console.error("Error creating partner:", error);
    throw error;
  }
}

/**
 * Update a partner's details
 */
export async function updatePartner(
  id: string,
  partnerData: Partial<Partner>,
): Promise<void> {
  // Format the data to ensure discounts are in the correct format
  const formattedData = {
    ...partnerData,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("partners")
    .update(formattedData)
    .eq("id", id);

  if (error) {
    console.error("Error updating partner:", error);
    throw error;
  }
}

/**
 * Delete a partner
 */
export async function deletePartner(id: string): Promise<void> {
  const { error } = await supabase.from("partners").delete().eq("id", id);

  if (error) {
    console.error("Error deleting partner:", error);
    throw error;
  }
}

/**
 * Toggle a partner's active status
 */
export async function togglePartnerStatus(
  id: string,
  active: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("partners")
    .update({ active, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error toggling partner status:", error);
    throw error;
  }
}

/**
 * Upload a partner image to Supabase storage and return the public URL
 */
export async function uploadPartnerImage(
  file: File,
  partnerName: string,
): Promise<string> {
  try {
    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${partnerName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.${fileExt}`;
    const filePath = `partner-images/${fileName}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("membership-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("membership-images").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error in image upload process:", error);
    throw error;
  }
}
