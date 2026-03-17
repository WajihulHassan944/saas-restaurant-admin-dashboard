"use client";

import Header from "@/components/pos/header";
import Container from "@/components/container";
import PosSearchFilter from "@/components/pos/PosSearchFilter";
import Categories from "@/components/menu/listing/categories";
import ItemList from "@/components/menu/listing/itemList";
import PosCart from "@/components/pos/PosCart";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

export default function Orders() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const { token } = useAuth();
  const { get, loading } = useApi(token);

 
  const getStoredAuth = () => {
    const stored = localStorage.getItem("auth");
    if (!stored) return null;
    return JSON.parse(stored);
  };

  /* ================= FETCH ITEMS ================= */

  const fetchItems = async () => {
    const stored = getStoredAuth();
    const restaurantId = stored?.user?.restaurantId;

    if (!restaurantId) return;

    let url = `/v1/menu/items?restaurantId=${restaurantId}`;

    if (selectedCategory) {
      url += `&categoryId=${selectedCategory}`;
    }

    const res = await get(url);

    if (!res) return;

    const data = Array.isArray(res) ? res : [];

    setItems(data);
  };

  useEffect(() => {
    if (!token) return;
    fetchItems();
  }, [token, selectedCategory]);

  return (
    <Container>
      <Header
        title="Create New Order"
        description="Create new order and manage from here."
      />

      <PosSearchFilter />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDE */}
        <div className="lg:col-span-9">
          
          <Categories
            showAddNew={false}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ItemList
            headerText="Food List"
            addNewText="Manage Food"
            items={items}
            loading={loading}
            editing={false} // POS doesn't need edit mode
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-3">
          <PosCart />
        </div>

      </div>
    </Container>
  );
}