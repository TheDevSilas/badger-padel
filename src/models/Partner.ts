export type PartnerType = "court" | "shop" | "brand";

export interface Discount {
  id: string;
  description: string;
  percentage?: number;
  details?: string;
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
  discounts: Discount[];
  image: string;
  imageUrl?: string;
  email?: string;
  contactPerson?: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
}
