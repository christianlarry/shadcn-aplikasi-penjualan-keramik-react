import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import React from "react"

type AppProviderProps = {
  children?: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  )
}