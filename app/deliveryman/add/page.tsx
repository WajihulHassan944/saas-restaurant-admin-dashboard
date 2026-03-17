"use client";

import { useState, useEffect, useRef } from "react";
import Container from "@/components/container";
import AddDeliveryManHeader from "@/components/deliveryman/add/AddDeliveryManHeader";
import DeliveryManForm from "@/components/forms/deliveryman-form";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";

const AddDeliveryMan = () => {
  const { token } = useAuth();
  const { post, patch, get } = useApi(token);

  const router = useRouter();
  const searchParams = useSearchParams();

  const editId = searchParams.get("editId");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    vehicleType: "",
    vehicleNumber: "",
    status: "OFFLINE",
  });

  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasFetched = useRef(false); // 🔥 prevent duplicate calls

  /* ================= GET AUTH ================= */
  const getStoredAuth = () => {
    try {
      const stored = localStorage.getItem("auth");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  /* ================= FETCH FOR EDIT ================= */
  const fetchDeliverymanDetails = async () => {
    if (!editId || !token || hasFetched.current) return;

    try {
      hasFetched.current = true; // 🔥 prevent multiple calls
      setIsFetching(true);

      const res = await get(`/v1/deliverymen/${editId}`);

      if (res) {
        setFormData({
          firstName: res.firstName || "",
          lastName: res.lastName || "",
          phone: res.phone || "",
          email: res.email || "",
          vehicleType: res.vehicleType || "",
          vehicleNumber: res.vehicleNumber || "",
          status: res.status || "OFFLINE",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch deliveryman");
    } finally {
      setIsFetching(false);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (!token) return;
    fetchDeliverymanDetails();
  }, [token, editId]);

  /* ================= SUBMIT ================= */
 const handleSubmit = async () => {
  const stored = getStoredAuth();

  const restaurantId = stored?.user?.restaurantId;
  const branchId = stored?.user?.branchId;

  if (!formData.firstName || !formData.lastName || !formData.phone) {
    toast.error("Please fill required fields");
    return;
  }

  try {
    setIsSaving(true);

    let res;

    if (editId) {
      /* ================= UPDATE ================= */
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
      };

      res = await patch(`/v1/deliverymen/${editId}`, payload);
    } else {
      /* ================= CREATE ================= */
      if (!restaurantId || !branchId) {
        toast.error("Restaurant or branch not found");
        return;
      }

      const payload = {
        ...formData,
        restaurantId,
        branchId,
      };

      res = await post("/v1/deliverymen", payload);
    }

    if (res) {
      toast.success(
        editId
          ? "Delivery man updated successfully"
          : "Delivery man created successfully"
      );

      router.push("/deliveryman");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setIsSaving(false);
  }
};
  return (
    <Container>
      <AddDeliveryManHeader
        title={editId ? "Edit Delivery Man" : "Create New Delivery Man"}
        description="Manage delivery man details"
        onConfirm={handleSubmit}
        loading={isSaving} // ✅ FIXED (no fetch loading here)
      />

      <DeliveryManForm
        formData={formData}
        setFormData={setFormData}
      />
    </Container>
  );
};

export default AddDeliveryMan;