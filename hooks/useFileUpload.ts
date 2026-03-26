"use client";

import { useState } from "react";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";
import { useAuthContext } from "@/context/AuthContext";

export const useFileUpload = () => {
  const { token } = useAuthContext();
  const { post } = useApi(token);

  const [uploading, setUploading] = useState(false);

  const uploadFile = async (e: any): Promise<string | null> => {
    const file = e.target.files?.[0];
    if (!file) return null;

    try {
      setUploading(true);

      // 1️⃣ presigned URL
      const presigned = await post("/v1/storage/presigned-upload", {
        fileName: file.name,
        contentType: file.type,
      });

      const { uploadUrl, fileUrl, headers } = presigned.data;

      // 2️⃣ upload
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          ...headers,
        },
        body: file,
      });

      toast.success("File uploaded");

      return fileUrl;
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};