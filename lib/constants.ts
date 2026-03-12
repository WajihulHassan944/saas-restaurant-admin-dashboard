export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://deliveryway.dcodax.co/api"

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  SETTINGS: "/dashboard/settings",
} as const

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const

export const PAGINATION_LIMIT = 10
