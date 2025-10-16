import { supabase } from "./supabase";

export interface UploadedResult {
  url: string | null;
  error: string | null;
}

export const uploadedImage = async (
  file: File,
  bucket: string = "images",
  folder?: string
): Promise<UploadedResult> => {
  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.log("Error uploading file:", error);
      return { url: null, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.log("Unexpected error uploading file:", error);
    return {
      url: null,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error uploading file",
    };
  }
};

export const deleteImage = async (
  url: string,
  bucket: string = "images"
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const urlParts = url.split("/");
    const bucketIndex = urlParts.findIndex((part) => part === bucket);

    if (bucketIndex === -1) {
      return { success: false, error: "Invalid bucket name in URL" };
    }

    const filePath = urlParts.slice(bucketIndex + 1).join("/");
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.log("Error deleting file:", error);
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (error) {
    console.log("Unexpected error deleting file:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error deleting file",
    };
  }
};

export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.",
    };
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size exceeds the 5MB limit.",
    };
  }

  return { isValid: true };
};
