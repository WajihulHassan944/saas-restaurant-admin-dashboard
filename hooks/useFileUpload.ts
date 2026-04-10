"use client";

import { useState } from "react";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";
import { useAuthContext } from "@/context/AuthContext";

interface UploadResult {
  key: string;
  fileUrl: string;
}

export const useFileUpload = () => {
  const { token } = useAuthContext();
  const { post } = useApi(token);

  const [uploading, setUploading] = useState(false);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<UploadResult | null> => {
    const file = e.target.files?.[0];
    if (!file) return null;

    try {
      setUploading(true);

      const presigned = await post("/v1/storage/presigned-upload", {
        fileName: file.name,
        contentType: file.type,
      });

      const uploadData = presigned?.data;

      if (!uploadData?.uploadUrl || !uploadData?.key) {
        throw new Error("Invalid presigned upload response");
      }

      const uploadResponse = await fetch(uploadData.uploadUrl, {
  method: uploadData.method || "PUT",
  headers: {
    ...(uploadData.headers || {}),
  },
  body: file,
});

if (!uploadResponse.ok) {
  throw new Error("Failed to upload file to storage");
}

      toast.success("File uploaded");

      return {
        key: uploadData.key,
        fileUrl: uploadData.fileUrl,
      };
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};