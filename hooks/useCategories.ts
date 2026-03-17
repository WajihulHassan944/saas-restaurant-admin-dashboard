"use client"

import { useEffect, useState } from "react"
import useApi from "./useApi"
import { useAuth } from "./useAuth"

export interface Category {
  id: string
  name: string
  slug?: string
}

export default function useCategories() {

  const { token } = useAuth()
  const { get, del, loading } = useApi(token)

  const [categories, setCategories] = useState<Category[]>([])

  const fetchCategories = async () => {
    if (!token) return

    const data = await get("/v1/menu/categories")

    if (data) {
      setCategories(data)
    }
  }

  const deleteCategory = async (id: string) => {
    const res = await del(`/v1/menu/categories/${id}`)

    if (res !== null) {
      setCategories((prev) => prev.filter((c) => c.id !== id))
    }
  }

  useEffect(() => {
    if (!token) return
    fetchCategories()
  }, [token])

  return {
    categories,
    loading,
    refetch: fetchCategories,
    deleteCategory,
  }
}