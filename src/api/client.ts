import axios from "axios"
import { authState } from "./authState"

let isRefreshing = false

export const gateApi = axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_API || "http://localhost:8080",
  withCredentials: true,
})

export const uploadsApi = axios.create({
  baseURL: import.meta.env.VITE_UPLOADS_API_URL || "http://localhost:8081",
  withCredentials: true,
})

gateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (authState.authFailed) {
      return Promise.reject(error)
    }

    if (originalRequest?.url?.includes("/auth/refresh")) {
      authState.authFailed = true
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return Promise.reject(error)
      }

      isRefreshing = true

      try {
        await gateApi.post("/auth/refresh")
        isRefreshing = false
        return gateApi(originalRequest)
      } catch {
        isRefreshing = false
        authState.authFailed = true
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)
