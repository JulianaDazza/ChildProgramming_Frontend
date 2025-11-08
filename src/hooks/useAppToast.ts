"use client"

import { toast } from "react-toastify"

export function useAppToast() {
  const toastSuccess = (message: string) => {
    toast.success(`✅ ${message}`, {
      icon: false,
    })
  }

  const toastError = (message: string) => {
    toast.error(`❌ ${message}`, {
      icon: false,
    })
  }

  const toastInfo = (message: string) => {
    toast.info(`💡 ${message}`, {
      icon: false,
    })
  }

  const toastWarning = (message: string) => {
    toast.warning(`⚠️ ${message}`, {
      icon: false,
    })
  }

  return {
    toastSuccess,
    toastError,
    toastInfo,
    toastWarning,
  }
}