import api from "@/lib/api"
import { buildUrlWithParams } from "@/lib/utils"
import type { GetProductResponse } from "@/types/product"
import { useQuery } from "@tanstack/react-query"

interface GetProductParams{
  page:number
}

export const useProductQuery = ({
  page
}:GetProductParams)=>{
  return useQuery({
    queryKey: ["products",page],
    queryFn: async ()=>{
      const {data} = await api.get<GetProductResponse>(buildUrlWithParams("/product",
        {
          pagination_page: page,
          pagination_size: 12
        }
      ))
      
      return data
    }
  })
}