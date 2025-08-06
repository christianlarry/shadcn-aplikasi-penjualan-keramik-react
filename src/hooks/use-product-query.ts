import api from "@/lib/api"
import { buildUrlWithParams } from "@/lib/utils"
import type { GetProductResponse } from "@/types/product"
import { useQuery } from "@tanstack/react-query"

export const useProductQuery = ()=>{
  return useQuery({
    queryKey: ["products"],
    queryFn: async ()=>{
      const {data} = await api.get<GetProductResponse>(buildUrlWithParams("/product",
        {
          pagination_page: 1,
          pagination_size: 1
        }
      ))
      
      return data
    }
  })
}