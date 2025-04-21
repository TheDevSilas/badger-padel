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
import { updatePartner } from "@/services/partnerService";
import { useToast } from "@/components/ui/use-toast";
import { X, Plus } from "lucide-react";

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
}

export default function PartnerEditForm({
  partner,
  open,
  onClose,
  onSuccess,
}: PartnerEditFormProps) {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    }
  }, [partner, form]);

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
    if (!partner) return;

    try {
      setIsSubmitting(true);

      await updatePartner(partner.id, {
        ...data,
        discounts,
      });

      toast({
        title: "Success",
        description: "Partner updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating partner:", error);
      toast({
        title: "Error",
        description: "Failed to update partner. Please try again.",
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
