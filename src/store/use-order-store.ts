import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserData = {
  namaLengkap:string,
  alamat:string
}

type OrderState = {
  user:UserData
}

type OrderActions = {
  setUser:(user:UserData)=>void
}

export const useOrderStore = create<OrderState & OrderActions>()(
  persist((set)=>({
    user: {namaLengkap: "",alamat: ""},
    setUser: (user=>set({user: {namaLengkap:user.namaLengkap,alamat:user.alamat}}))
  }),
  {
    name: "order-storage"
  }
))