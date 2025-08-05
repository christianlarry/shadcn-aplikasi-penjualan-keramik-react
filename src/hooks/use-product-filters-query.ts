import api from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useProductFiltersQuery = ()=>{
  return useQuery({
    queryKey: ["products","filter-options"],
    queryFn: async ()=>{
      const {data} = await api.get("/product/filter-options")
      return data
    }
  })
}