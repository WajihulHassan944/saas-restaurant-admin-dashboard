"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // ShadCN Button

type ImportModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ImportModal({ open, onOpenChange }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    // Handle file import logic here
    console.log("File imported:", file);
    onOpenChange(false); // Close modal after import
  };

  const handleDownload = () => {
    // Trigger download of empty file
    const link = document.createElement("a");
    link.href = "/path-to-empty-file.xlsx"; // Link to empty file
    link.download = "Empty_Branch_File.xlsx";
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-7 bg-[#F5F5F5] max-h-[95vh] overflow-auto">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">Import Branch List</DialogTitle>
          <p className="text-sm text-gray-500">Import Branch list for this restaurant</p>
        </DialogHeader>

{/* BODY */}
<div className="mt-4 rounded-[16px] bg-white p-6">
  {/* Upload Box */}
  <div className="flex flex-col items-center justify-center">
    <div
      onClick={() => document.getElementById("fileInput")?.click()}
      className="
        w-full
        h-[180px]
        border-2 border-dashed border-gray-300
        rounded-[16px]
        flex
        items-center
        justify-center
        cursor-pointer
        hover:border-gray-400
        transition
      "
    >
      <img
        src="/excel.png"
        alt="Excel"
        className="w-[64px] h-[64px]"
      />
    </div>

    <p className="mt-4 text-xs text-gray-500 text-center">
      Format : xls, xml, csv | Size : Max 2 MB
    </p>

    {/* Hidden file input */}
    <input
      id="fileInput"
      type="file"
      accept=".xls,.xml,.csv"
      className="hidden"
      onChange={handleFileChange}
    />
  </div>

  {/* Download Empty File */}
  <div
    onClick={handleDownload}
    className="
      mt-6
      flex
      items-center
      justify-center
      flex-col
      gap-2
      rounded-[12px]
      bg-[#EEF6FF]
      px-4
      py-4
      text-sm
      text-primary
      cursor-pointer
      border border-[#C0E1FC]
    "
  >
    <span className="text-gray-500">
      If you don't know the file format
    </span>
    <span className="font-semibold text-[#4153C4] underline">
      Download Empty File
    </span>
  </div>
</div>


        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="px-6 py-2 rounded-[10px] text-sm font-medium text-gray-600 border-gray-300"
          >
            Cancel
          </Button>

          <Button
            onClick={handleImport}
            variant="default"
            className="px-8 py-2.5 rounded-[10px] bg-primary text-white hover:bg-red-700"
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
