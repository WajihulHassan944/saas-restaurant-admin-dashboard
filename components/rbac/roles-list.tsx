"use client";

import { Card } from "@/components/ui/card";
import { ShieldCheck, UserCog, Headphones, Wallet, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

const roles = [
    { id: 1, title: "Admin", status: "Active", sub: "SYSTEM LOCKED", desc: "Full platform access with all permissions", icon: ShieldCheck },
    { id: 2, title: "Manager", status: "Active", sub: "EDITING...", desc: "Manage day-to-day operations and staff", icon: UserCog, isEditing: true },
    { id: 3, title: "Support", status: "Active", desc: "Customer support and order management", icon: Headphones },
    { id: 4, title: "Finance", status: "Active", desc: "Financial reporting and payment management", icon: Wallet },
    { id: 5, title: "Custom Role", status: "Inactive", desc: "Full platform access with all permissions", icon: PlusCircle },
];

export default function RolesList() {
    return (
        <div className="flex flex-col gap-[32px]">
            {roles.map((role) => (
                <Card
                    key={role.id}
                    className={`p-[24px] border-none shadow-sm rounded-[14px] gap-0 relative transition-all ${role.isEditing ? "ring-1 ring-primary" : ""
                        }`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex gap-[12px] items-center">
                            <div className={`p-2 rounded-lg text-primary`}>
                                <role.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-dark text-lg mb-[6px]">{role.title}</h3>
                                <p className={`text-sm text-dark`}>
                                    {role.sub || ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-[4px]">
                            <div className={`size-2 rounded-full ${role.status === "Active" ? "bg-green" : "bg-gray-300"}`} />
                            <span className={`text-[12px] ${role.status === "Active" ? "text-green" : "text-gray-400"}`}>{role.status}</span>
                        </div>
                    </div>

                    <p className="text-gray text-sm mt-[20px] mb-[10px]">{role.desc}</p>

                    <Button
                        variant="link"
                        className="self-start"
                    >
                        view All {role.title}s
                    </Button>
                </Card>
            ))}
        </div>
    );
}