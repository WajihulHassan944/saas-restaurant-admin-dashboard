import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
} from "lucide-react";

export type StatTrend = "up" | "down";

export type StatVariant = "default" | "danger";

export type StatItem = {
  title: string;
  value: number;
  icon: any;
  trend: {
    direction: StatTrend;
    percentage: string;
  };
  variant?: StatVariant;
};

export const statsData: StatItem[] = [
  {
    title: "All Customers",
    value: 24,
    icon: Users,
    trend: { direction: "up", percentage: "+3%" },
  },
  {
    title: "New Customers",
    value: 24,
    icon: UserPlus,
    trend: { direction: "up", percentage: "+3%" },
  },
  {
    title: "Active Customers",
    value: 24,
    icon: UserCheck,
    trend: { direction: "up", percentage: "+3%" },
  },
  {
    title: "Blocked Customers",
    value: 24,
    icon: UserX,
    trend: { direction: "down", percentage: "-1%" },
    variant: "danger",
  },
];

export const customersData = [
    {
        sl: 1,
        customerName: "Emilia Johanson",
        phone: "+921212121212",
        email: "example@gmail.com",
        role: "Manager",
        branch: {
            currentlyAssign: 43,
            outForDelivery: 23,
            ongoingOrder: 1,
        },
        status: true,
    },
    // Add 6 more similar objects to make a total of 7
    {
        sl: 2,
        customerName: "Emilia Johanson",
        phone: "+921212121212",
        email: "example@gmail.com",
        role: "Manager",
        branch: {
            currentlyAssign: 43,
            outForDelivery: 23,
            ongoingOrder: 1,
        },
        status: true,
    },
    {
        sl: 3,
        customerName: "Emilia Johanson",
        phone: "+921212121212",
        email: "example@gmail.com",
        role: "Manager",
        branch: {
            currentlyAssign: 43,
            outForDelivery: 23,
            ongoingOrder: 1,
        },
        status: true,
    },
    {
        sl: 4,
        customerName: "Emilia Johanson",
        phone: "+921212121212",
        email: "example@gmail.com",
        role: "Manager",
        branch: {
            currentlyAssign: 43,
            outForDelivery: 23,
            ongoingOrder: 1,
        },
        status: true,
    },
    {
        sl: 5,
        customerName: "Emilia Johanson",
        phone: "+921212121212",
        email: "example@gmail.com",
        role: "Manager",
        branch: {
            currentlyAssign: 43,
            outForDelivery: 23,
            ongoingOrder: 1,
        },
        status: true,
    },
    {
        sl: 6,
        customerName: "Emilia Johanson",
        phone: "+921212121212",
        email: "example@gmail.com",
        role: "Manager",
        branch: {
            currentlyAssign: 43,
            outForDelivery: 23,
            ongoingOrder: 1,
        },
        status: true,
    },
    {
        sl: 7,
        customerName: "Emilia Johanson",
        phone: "+921212121212",
        email: "example@gmail.com",
        role: "Manager",
        branch: {
            currentlyAssign: 43,
            outForDelivery: 23,
            ongoingOrder: 1,
        },
        status: true,
    },
];
