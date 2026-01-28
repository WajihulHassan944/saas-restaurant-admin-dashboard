"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Hero() {
    return (
        <div className="w-full rounded-[14px] overflow-hidden space-y-[24px] md:space-y-[32px]">

            {/* Quick Actions Header */}
            <div className="flex items-center gap-4 md:gap-[32px]">
                <h1 className="font-semibold text-lg text-dark whitespace-nowrap">Quick Actions</h1>
                <Select defaultValue="active">
                    <SelectTrigger className="w-[120px] md:w-[140px] h-full font-semibold text-lg text-green border-0 shadow-none focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active" className="text-green font-medium">Active</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                        <SelectItem value="branding">Branding</SelectItem>
                        <SelectItem value="suspend">Suspend</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Banner Image */}
            <div className="relative w-full h-[120px] md:h-[175px]">
                <Image
                    src="/profile-banner.png"
                    alt="Restaurant Banner"
                    fill
                    className="object-cover rounded-[14px]"
                    priority
                />
            </div>

            {/* Profile Section */}
            <div className="px-4 md:px-[30px] pb-[30px] relative">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                    
                    {/* Profile Picture: Responsive sizing and centering */}
                    <div className="relative size-[120px] md:w-[196px] md:h-[196px] mt-[-60px] md:mt-[-128px] rounded-full overflow-hidden bg-white shadow-md shrink-0">
                        <Image
                            src="/profile-pic.png"
                            alt="Dragon Wok Profile"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Restaurant Details: Stacks on mobile, justify-between on desktop */}
                    <div className="flex flex-col md:flex-row flex-1 items-center md:items-center justify-between gap-4 md:pb-4 md:-mt-4 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-[18px]">
                            <div className="flex items-center gap-2 md:gap-[18px]">
                                <div className="size-2 md:size-3 rounded-full bg-green shrink-0" />
                                <h1 className="text-2xl md:text-[32px] font-semibold text-dark">Dragon Wok</h1>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-primary text-primary bg-primary/5 px-3 py-1 rounded-lg text-sm font-semibold"
                            >
                                Hybrid
                            </Badge>
                        </div>

                        <div className="text-gray-500 md:text-dark text-xs md:text-sm">
                            Last Active: 9:30pm Today
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}