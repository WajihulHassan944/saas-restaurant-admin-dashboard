"use client";

import { useState } from "react";
import Container from "@/components/container";
import StatsSection from "@/components/employee-settings/stats-section";
import EmployeeTable from "@/components/employee-settings/table";
import Header from "@/components/employee-settings/header";
import BranchFilters from "@/components/branches/BranchFilters";
import { Button } from "@/components/ui/button";
import RolesTable from "@/components/employee-settings/RolesTable";

const EmployeesSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<"employees" | "roles">("employees");
const [refreshEmployees, setRefreshEmployees] = useState(false);
const [refreshRoles, setRefreshRoles] = useState(false);


const triggerEmployeesRefresh = () => {
  setRefreshEmployees((prev) => !prev);
};

const triggerRolesRefresh = () => {
  setRefreshRoles((prev) => !prev);
};

  return (
    <Container>
      <Header
        title="Employee List"
        description="Manage and view all invited employee in one place"
        onEmployeeSuccess={triggerEmployeesRefresh}
  onRoleSuccess={triggerRolesRefresh}
      />

      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm space-y-6">
        <StatsSection />
        <BranchFilters />

        {/* Tabs */}
<div className="flex gap-3 pl-4 lg:pl-6 flex-wrap">
  {[
    { key: "employees", label: "Employees" },
    { key: "roles", label: "Roles" },
  ].map((tab) => {
    const isActive = activeTab === tab.key;

    return (
      <Button
        key={tab.key}
        onClick={() => setActiveTab(tab.key as any)}
        className={`
          h-[42px] px-5 rounded-[12px] text-[14px] font-medium transition-all
          ${
            isActive
              ? "bg-primary text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }
        `}
      >
        {tab.label}
      </Button>
    );
  })}
</div>
        {/* Content */}
       {activeTab === "employees" && (
  <EmployeeTable refreshFlag={refreshEmployees}  onSuccess={triggerEmployeesRefresh} />
)}

{activeTab === "roles" && (
  <RolesTable refreshFlag={refreshRoles} onSuccess={triggerRolesRefresh} />
)}
      
      </div>
    </Container>
  );
};

export default EmployeesSettingsPage;