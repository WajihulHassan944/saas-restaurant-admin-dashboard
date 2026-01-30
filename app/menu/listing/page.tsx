'use client';
import Container from "@/components/container";
import Categories from "@/components/menu/listing/categories";
import Header from "@/components/menu/listing/header";
import ItemList from "@/components/menu/listing/itemList";
import { useState } from "react";

export default function MenusListingPage() {
    const [editing, setEditing] = useState(false);
const handleManageClick = () => {
  setEditing((prev) => !prev);
};
    return (
        <Container>
            <Header
                title="Menu Listing"
                description="Menu List"
                editing={editing}
                onManageClick={handleManageClick}
            />
            <Categories editing={editing} />

            <ItemList editing={editing} />
           
        </Container>
    );
}