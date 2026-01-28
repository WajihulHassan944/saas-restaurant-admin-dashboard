"use client";

import { Card } from "@/components/ui/card";
import {
    XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const data = [
    { name: 'Jan', value: 100 }, { name: 'Feb', value: 72 }, { name: 'Mar', value: 61 },
    { name: 'Apr', value: 61 }, { name: 'May', value: 65 }, { name: 'Jun', value: 75 },
    { name: 'Jul', value: 21 }, { name: 'Aug', value: 89 }, { name: 'Sep', value: 89 },
    { name: 'Oct', value: 65 }, { name: 'Nov', value: 65 }, { name: 'Dec', value: 30 },
];

export default function SummarySection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] w-full">
            {/* Branch Info Card */}
            <div className="space-y-[5px] lg:col-span-5">
                <h3 className="text-base font-semibold text-dark text-center">Branch Address Info</h3>
                <Card className="border-2 border-gray-50 rounded-[14px] px-[10px] py-[16px]">
                    <div className="space-y-4">
                        <InfoRow label="Name" value="Arnold Smith" />
                        <InfoRow label="Email" value="axample123@example.com" />
                        <InfoRow label="Contact Number" value="+123 456 7890" />
                        <InfoRow label="State / Province / Region" value="N/A" />
                        <InfoRow label="Zip Code" value="N/A" />
                        <InfoRow label="Country" value="N/A" />
                        <InfoRow label="City" value="N/A" />
                    </div>
                </Card>
            </div>

            {/* Analytical Graph Card */}
            <Card className="lg:col-span-7 p-2 md:p-6 lg:p-[30px] border-none shadow-none rounded-[14px] bg-white flex flex-col">
                <div className="h-[300px] w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                        {/* 1. Set margin to 0 to remove default container padding */}
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                minTickGap={5}
                            />
                            {/* 2. Hide YAxis on mobile (width=0) to remove the left gutter */}
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                width={30} 
                                className="hidden md:block" // Keeps it on desktop, removes space on mobile
                                hide={typeof window !== 'undefined' && window.innerWidth < 768}
                            />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                dot={{ r: 3, fill: "var(--primary)", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center items-center gap-2 mt-4">
                    <div className="size-2 rounded-full bg-primary" />
                    <span className="text-xs font-bold text-gray">2025</span>
                </div>
            </Card>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center text-sm md:text-base w-full">
            <span className="text-gray flex-1 text-left">{label}</span>
            <div className="flex justify-center px-2">
                <span className="text-gray font-bold">:</span>
            </div>
            <span className="text-gray font-medium flex-1 text-right truncate">
                {value}
            </span>
        </div>
    );
}