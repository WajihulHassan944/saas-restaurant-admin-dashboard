"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionButtons from "@/utils/action-buttons";

const performanceData = [
    { rank: 1, name: "Dragon Wok", orders: "1,458", revenue: "$52,450", perf: "Gold", color: "text-yellow-500" },
    { rank: 2, name: "Bella Italia", orders: "1,458", revenue: "$52,450", perf: "Silver", color: "text-slate-400" },
    { rank: 3, name: "Sushi Palace", orders: "1,458", revenue: "$52,450", perf: "Bronze", color: "text-orange-400" },
    { rank: 4, name: "Burger House", orders: "1,458", revenue: "$52,450", perf: null, color: "" },
    { rank: 5, name: "Taco Fiesta", orders: "1,458", revenue: "$52,450", perf: null, color: "" },
];

export default function TopPerformingRestaurants() {
    return (
        <div className="space-y-[16px]">
            <div className="space-y-[6px]">
                <h3 className="text-lg font-semibold text-dark">Top Performing Restaurants</h3>
                <p className="text-base text-gray">Based on total orders and revenue</p>
            </div>

            <Card className="border-none shadow-sm rounded-[14px] bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="py-4 pl-6 pr-10 lg_pr-0 w-[80px]">Rank</TableHead>
                                <TableHead className="w-[200px] min-w-[200px]">Restaurant Name</TableHead>
                                <TableHead className="text-center w-[120px] min-w-[120px]">Total Orders</TableHead>
                                <TableHead className="text-center w-[140px] min-w-[140px]">Total Revenue</TableHead>
                                <TableHead className="text-center w-[140px] min-w-[140px]">Performance</TableHead>
                                <TableHead className="text-center w-[180px] min-w-[180px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {performanceData.map((item) => (
                                <TableRow key={item.rank} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-dark font-medium">{item.rank}</span>
                                            {item.rank <= 3 && (
                                                <Trophy size={16} className={item.color} />
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="py-4">
                                        <div className="font-medium text-dark truncate max-w-[180px]" title={item.name}>
                                            {item.name}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-green font-semibold text-center py-4">{item.orders}</TableCell>
                                    <TableCell className="text-green font-semibold text-center py-4">{item.revenue}</TableCell>

                                    <TableCell className="text-center py-4">
                                        {item.perf && (
                                            <span className={cn(
                                                "inline-flex items-center justify-center px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                                                item.perf === "Gold" && "bg-yellow-50 text-yellow-600 border border-yellow-200",
                                                item.perf === "Silver" && "bg-slate-50 text-slate-600 border border-slate-200",
                                                item.perf === "Bronze" && "bg-orange-50 text-orange-600 border border-orange-200"
                                            )}>
                                                {item.perf}
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell className="pr-6 py-4">
                                        <ActionButtons />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}