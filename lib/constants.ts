export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://104.128.190.131:5050/api"
export const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://104.128.190.131:5050/api/v1"
// https://deliveryway.dcodax.co/api
// http://104.128.190.131:5050
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
