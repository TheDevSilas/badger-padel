import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Partner, PartnerType, Discount } from "@/models/Partner";
import {
  updatePartner,
  createPartner,
  uploadPartnerImage,
} from "@/services/partnerService";
import { useToast } from "@/components/ui/use-toast";
import { X, Plus, Upload, Image } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  type: z.enum(["court", "shop", "brand"]),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .optional()
    .or(z.literal("")),
  contactPerson: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PartnerEditFormProps {
  partner: Partner | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isCreating?: boolean;
}

export default function PartnerEditForm({
  partner,
  open,
  onClose,
  onSuccess,
  isCreating = false,
}: PartnerEditFormProps) {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "court" as PartnerType,
      location: "",
      phone: "",
      website: "",
      email: "",
      contactPerson: "",
    },
  });

  useEffect(() => {
    if (partner) {
      form.reset({
        name: partner.name,
        type: partner.type,
        location: partner.location || "",
        phone: partner.phone || "",
        website: partner.website || "",
        email: partner.email || "",
        contactPerson: partner.contactPerson || "",
      });
      setDiscounts(partner.discounts || []);
      setImagePreview(partner.imageUrl || null);
    } else {
      setImagePreview(null);
      setSelectedImage(null);
    }
  }, [partner, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDiscount = () => {
    if (newDiscount.trim() === "") return;

    const newDiscountObj: Discount = {
      id: Date.now().toString(),
      description: newDiscount.trim(),
    };

    setDiscounts([...discounts, newDiscountObj]);
    setNewDiscount("");
  };

  const handleRemoveDiscount = (id: string) => {
    setDiscounts(discounts.filter((discount) => discount.id !== id));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      let imageUrl = partner?.imageUrl;

      // Upload image if selected
      if (selectedImage) {
        setIsUploading(true);
        try {
          imageUrl = await uploadPartnerImage(selectedImage, data.name);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Error",
            description:
              "Failed to upload image. Partner will be saved without an image.",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      }

      if (isCreating) {
        // Create new partner
        await createPartner({
          ...data,
          discounts: discounts.map((d) => d.description),
          active: true,
          imageUrl,
        });

        toast({
          title: "Success",
          description: "Partner created successfully",
        });
      } else if (partner) {
        // Update existing partner
        await updatePartner(partner.id, {
          ...data,
          discounts,
          imageUrl,
        });

        toast({
          title: "Success",
          description: "Partner updated successfully",
        });
      } else {
        console.error("No partner data available");
        return;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving partner:", error);
      toast({
        title: "Error",
        description: "Failed to save partner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Partner</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Partner name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select partner type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="court">Court</SelectItem>
                      <SelectItem value="shop">Shop</SelectItem>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="Website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact person name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Discounts</FormLabel>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a discount"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddDiscount())
                  }
                />
                <Button type="button" onClick={handleAddDiscount} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {discounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <span>{discount.description}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDiscount(discount.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {discounts.length === 0 && (
                  <p className="text-sm text-gray-500">No discounts added</p>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <FormLabel>Partner Image</FormLabel>
              <div className="flex flex-col space-y-4">
                {imagePreview && (
                  <div className="relative w-40 h-40 mx-auto">
                    <img
                      src={imagePreview}
                      alt="Partner preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <Image className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">
                    {imagePreview ? "Change image" : "Upload partner image"}
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleImageChange}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      className="relative pointer-events-none"
                    >
                      {isUploading ? "Uploading..." : "Select Image"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
