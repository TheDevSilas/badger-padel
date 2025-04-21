import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "../../../supabase/supabase";
import { Camera, Upload } from "lucide-react";

interface ProfileImageUploaderProps {
  membershipId: string;
  currentImageUrl?: string;
  onImageUpdated: (newImageUrl: string) => void;
}

export default function ProfileImageUploader({
  membershipId,
  currentImageUrl,
  onImageUpdated,
}: ProfileImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload the file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${membershipId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("membership-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        return;
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("membership-images").getPublicUrl(filePath);

      // Update the membership record with the new image URL
      const { error: updateError } = await supabase
        .from("memberships")
        .update({ profile_image_url: publicUrl })
        .eq("id", membershipId);

      if (updateError) {
        console.error("Error updating membership:", updateError);
        return;
      }

      // Call the callback with the new image URL
      onImageUpdated(publicUrl);
      setIsOpen(false);
    } catch (error) {
      console.error("Error in image upload process:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 h-8 w-8"
        >
          <Camera size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {currentImageUrl && (
            <div className="flex justify-center">
              <img
                src={currentImageUrl}
                alt="Current profile"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-4">
              Click to upload or drag and drop
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-image-upload"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor="profile-image-upload">
              <Button disabled={isUploading}>
                {isUploading ? "Uploading..." : "Select Image"}
              </Button>
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
