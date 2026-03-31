"use client";

import Container from "@/components/container";
import Header from "@/components/header";
import ModifierGroupsTable from "./ModifierGroupsTable";

const ModifierGroupsPage = () => {
  return (
    <Container>
      <Header
        title="Modifier Groups"
        description="Manage item modifier groups"
      />

      <div className="bg-white p-6 rounded-[20px] shadow-sm mt-6">
        <ModifierGroupsTable />
      </div>
    </Container>
  );
};

export default ModifierGroupsPage;