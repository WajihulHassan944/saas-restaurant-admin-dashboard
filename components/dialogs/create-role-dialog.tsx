"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Box, Menu, Bike, CircleDollarSign, BarChart3, Settings } from "lucide-react";

const permissionsData = [
    {
        module: "Orders",
        icon: Box,
        rights: [
            { label: "View", defaultChecked: true },
            { label: "Create/Edit", defaultChecked: true },
            { label: "Cancel", defaultChecked: false },
        ],
    },
    {
        module: "Menus",
        icon: Menu,
        rights: [
            { label: "View", defaultChecked: true },
            { label: "Add/Edit", defaultChecked: true },
            { label: "Delete", defaultChecked: false },
        ],
    },
    {
        module: "Drivers",
        icon: Bike,
        rights: [
            { label: "View", defaultChecked: true },
            { label: "Assign", defaultChecked: true },
            { label: "Manage Status", defaultChecked: false },
        ],
    },
    {
        module: "Finance",
        icon: CircleDollarSign,
        rights: [
            { label: "View", defaultChecked: true },
            { label: "Manage Payout", defaultChecked: true },
            { label: "Access Invoice", defaultChecked: false },
        ],
    },
    {
        module: "Reports",
        icon: BarChart3,
        rights: [
            { label: "View", defaultChecked: true },
            { label: "Export", defaultChecked: false },
        ],
    },
    {
        module: "Settings",
        icon: Settings,
        rights: [
            { label: "View", defaultChecked: true },
            { label: "Manage", defaultChecked: false },
        ],
    },
];

export default function CreateRoleDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="primary"
                >
                    Add New Role
                </Button>
            </DialogTrigger>
            {/* Added max-w and bg-color to match the design */}
            <DialogContent className="sm:max-w-[618px] bg-[#F5F5F5] p-[40px] border-none shadow-lg rounded-[14px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="text-left">
                    <DialogTitle className="h-[42px]">Create Role</DialogTitle>
                    <DialogDescription>
                        Create Role from here
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 mt-[32px] p-[24px] bg-white rounded-[14px] shadow-sm">
                    <div className="grid gap-[6px]">
                        <Label htmlFor="roleName">
                            Role Name <span>*</span>
                        </Label>
                        <Input
                            id="roleName"
                            placeholder="eg. Food Kart"
                        />
                        <p className="text-sm text-primary">Branch name is required</p>
                    </div>

                    <div className="grid gap-[6px]">
                        <Label htmlFor="roleName">
                            Role Description <span>*</span>
                        </Label>
                        <Input
                            id="roleName"
                            placeholder="eg. jhon doe"
                        />
                    </div>

                    {/* Status Switch */}
                    <div className="flex items-center gap-[24px]">
                        <Label htmlFor="status">
                            Status
                        </Label>
                        <Switch
                            id="status"
                            defaultChecked
                            className="w-[52px] h-[26px]"
                        />
                    </div>

                    {/* Permissions Section */}
                    <div>
                        <h3 className="text-base text-dark mb-[6px]">Permissions</h3>
                        <p className="text-sm text-gray mb-[24px] pb-[24px] border-b border-[#BBBBBB]">
                            Select which actions this role can perform
                        </p>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                            {permissionsData.map((module) => (
                                <div
                                    key={module.module}
                                >
                                    <div className="flex items-center gap-[12px] mb-4">
                                        <module.icon className="text-primary" size={24} />
                                        <h4 className="font-semibold text-lg text-gray">{module.module}</h4>
                                    </div>
                                    <div className="grid gap-3">
                                        {module.rights.map((right, rightIndex) => (
                                            <div key={rightIndex} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`${module.module}-${right.label}`}
                                                    defaultChecked={right.defaultChecked}
                                                    className="w-[20px] h-[20px] data-[state=checked]:bg-primary data-[state=checked]:border-primary border-gray-300"
                                                />
                                                <Label
                                                    htmlFor={`${module.module}-${right.label}`}
                                                    className="text-base text-dark cursor-pointer"
                                                >
                                                    {right.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center gap-[24px] mx-auto mt-[32px] max-w-[360px]">
                    <Button
                        variant="ghost"
                    >
                        Reset
                    </Button>
                    <Button
                        variant="primary"
                        className="text-[24px] w-[168px] px-0 h-[62px] rounded-[14px]">
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}