"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import useApi from "@/hooks/useApi"

export interface Order {
  id: string
  orderNumber?: string
  orderType: string
  status: string
  totalAmount?: number
  createdAt: string
}

interface OrdersMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export default function useOrders() {
  const { token } = useAuth()
  const { get, loading } = useApi(token)

  const [orders, setOrders] = useState<Order[]>([])
  const [meta, setMeta] = useState<OrdersMeta | null>(null)

  const getStoredAuth = () => {
    const stored = localStorage.getItem("auth")
    if (!stored) return null
    return JSON.parse(stored)
  }

  const fetchOrders = async () => {
    if (!token) return

    const stored = getStoredAuth()

    const restaurantId = stored?.user?.restaurantId
    const branchId = stored?.user?.branchId

    if (!restaurantId || !branchId) return

    const res = await get(
      `/v1/orders?restaurantId=${restaurantId}&branchId=${branchId}`
    )

    if (res) {
      setOrders(res.data || [])
    } else {
      setOrders([])
    }
  }

  useEffect(() => {
    if (!token) return
    fetchOrders()
  }, [token])

  return {
    orders,
    meta,
    loading,
    refetch: fetchOrders,
  }
}