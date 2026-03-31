"use client"

import { create } from "zustand"
import { CUSTOMERS, WORKERS } from "./mock-data"

type Role = "customer" | "worker"

interface AuthState {
  role: Role
  customerId: string
  workerId: string
  customerName: string
  workerName: string
  setRole: (role: Role) => void
}

// Mock auth — always "logged in" for demo
// Swap role via setRole() to switch between customer and worker views
export const useAuth = create<AuthState>((set) => ({
  role: "customer",
  customerId: CUSTOMERS[0].id,
  workerId: WORKERS[0].id,
  customerName: CUSTOMERS[0].name,
  workerName: WORKERS[0].name,
  setRole: (role) => set({ role }),
}))
