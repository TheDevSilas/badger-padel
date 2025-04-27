export type PartnerType = "court" | "shop" | "brand" | "other";

export interface Discount {
  id: string;
  description: string;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  location?: string;
  phone?: string;
  website?: string;
  socialMediaLink?: string;
  memberBenefit?: string;
  discounts: Discount[] | string[];
  image?: string;
  imageUrl?: string;
  email?: string;
  contactPerson?: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
}

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface PartnerApplication {
  id?: string;
  name: string;
  type: PartnerType;
  location?: string;
  phone?: string;
  website?: string;
  socialMediaLink?: string;
  memberBenefit?: string;
  proposedDiscounts: string[];
  imageUrl?: string;
  email?: string;
  contactPerson?: string;
  applicationDate: string;
  status?: ApplicationStatus;
  message?: string;
}
