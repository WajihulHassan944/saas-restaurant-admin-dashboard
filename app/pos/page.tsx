"use client";

import Header from "@/components/pos/header";
import Container from "@/components/container";
import PosSearchFilter from "@/components/pos/PosSearchFilter";
import Categories from "@/components/menu/listing/categories";
import ItemList from "@/components/menu/listing/itemList";
import PosCart from "@/components/pos/PosCart";

export default function Orders() {


  return (
    <Container>
      <Header title="Create New Order" description="Create new order and manage from here." />
        <PosSearchFilter />

     <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-9">
    <Categories showAddNew={false} />
    <ItemList headerText="Food List" addNewText="Manage Food" />
  </div>

  <div className="lg:col-span-3">
    <PosCart />
  </div>
</div>

    </Container>
  );
}
