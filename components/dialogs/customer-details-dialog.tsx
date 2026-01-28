"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function CustomerDetailsDialog({ children }: { children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[618px]! p-0 border-none bg-white rounded-[24px] overflow-hidden max-h-[95vh] overflow-y-auto">
                <div className="p-[30px] space-y-[32px]">
                    <DialogHeader className="justify-center gap-0">
                        <DialogTitle className="text-center">Customer #10003</DialogTitle>
                        <DialogDescription className="text-center text-[#6A7282]">
                            View the customer's basic information and order history here
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center space-y-[24px]">
                        <div className="relative w-[252px] h-[266px] rounded-[14px] overflow-hidden">
                            <Image
                                src="/dialog-profile.jpg"
                                alt="Laura White"
                                fill
                                className="object-cover"
                            />
                            <button className="absolute bottom-4 right-4 size-[42px] bg-white rounded-full flex items-center justify-center text-primary shadow-md hover:bg-gray-50 transition-colors">
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="text-center space-y-[12px]">
                            <h2 className="text-2xl font-bold text-dark">Laura White</h2>
                            <div className="flex items-center gap-3 justify-center">
                                <span className="text-sm font-medium text-gray">Block/Unblock</span>
                                <Switch className="data-[state=checked]:bg-primary" />
                            </div>
                        </div>

                        {/* Info List */}
                        <div className="w-full space-y-4 pt-4 border-t border-gray-100">
                            <InfoRow label="Phone" value="+921212121212" />
                            <InfoRow label="Email" value="example@gmail.com" />
                            <InfoRow label="Joining Date" value="12/13/2025 07:00 PM" />
                            <InfoRow label="Address" value="View all Address" />
                        </div>

                        {/* Metrics Grid */}
                        <div className="w-full grid grid-cols-2 gap-[16px]">
                            <MetricCard value="12%" label="Completion Rate" />
                            <MetricCard value="3%" label="Ongoing Rate" />
                            <MetricCard value="2%" label="Cancellation Rate" />
                            <MetricCard value="14%" label="Refund Rate" />
                            <div className="col-span-2">
                                <MetricCard value="34%" label="Failed Rate" />
                            </div>
                        </div>

                        {/* Edit Button */}
                        <Button
                            variant="primary"
                            className="w-full
                          h-[62px] text-2xl rounded-[14px]"
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center text-sm">
            <span className="text-[#6A7282] text-left">
                {label}
            </span>

            <span className="text-[#6A7282] px-3 text-center">
                :
            </span>

            <span className={`text-right ${value === 'View all Address' ? ' text-primary underline underline-offset-4 cursor-pointer' : 'text-[#6A7282]'}`}>
                {value}
            </span>
        </div>
    );
}


function MetricCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="border border-gray-300 rounded-[14px] p-5 text-center space-y-1">
            <p className="text-2xl font-semibold text-[#6A7282]">{value}</p>
            <p className="text-sm font-medium text-gray">{label}</p>
        </div>
    );
}