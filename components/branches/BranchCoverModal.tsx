"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branchId: string;
  branchName: string;
}

export default function BranchCoverModal({
  open,
  onOpenChange,
  branchId,
  branchName,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      await new Promise((res) => setTimeout(res, 1000));

      toast.success("Cover image updated");
      onOpenChange(false);
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl">
        
        {/* HEADER */}
        <div className="px-5 pt-5 pb-3 border-b bg-white">
          <h3 className="text-[15px] font-semibold text-gray-900">
            Cover Image
          </h3>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {branchName}
          </p>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">

          {/* IMAGE PREVIEW */}
          <div className="relative group w-full h-[190px] rounded-xl overflow-hidden border bg-gray-50">
            {preview ? (
              <>
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium transition">
                    Change Image
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ImageIcon size={28} className="mb-2 opacity-70" />
                <span className="text-xs">No cover image</span>
              </div>
            )}
          </div>

          {/* UPLOAD BUTTON */}
          <label className="w-full">
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />

            <Button
              variant="outline"
              className="w-full h-[40px] rounded-lg border-dashed text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
              asChild
            >
              <span>
                <Upload size={15} />
                {preview ? "Replace Image" : "Upload Image"}
              </span>
            </Button>
          </label>

          {/* SAVE BUTTON */}
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full h-[42px] rounded-lg text-sm font-medium"
          >
            {loading && (
              <Loader2 size={16} className="animate-spin mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}