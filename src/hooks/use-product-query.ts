import type { Options } from "@/components/common/catalog/sidebar-select-input"
import api from "@/lib/api"
import { buildUrlWithParams } from "@/lib/utils"
import type { GetProductResponse } from "@/types/product"
import { useQuery } from "@tanstack/react-query"

type FilterType = Options[]|null

interface GetProductParams{
  page:number,
  filters:{
    application:FilterType,
    design:FilterType,
    texture:FilterType,
    color:FilterType,
    finishing:FilterType,
    size:FilterType
  },
  sort:string|null
}

export const useProductQuery = ({
  page,
  filters,
  sort
}:GetProductParams)=>{
  return useQuery({
    queryKey: ["products",page,filters,sort],
    queryFn: async ()=>{
      const {data} = await api.get<GetProductResponse>(buildUrlWithParams("/product",
        {
          pagination_page: page,
          pagination_size: 12,
          application: filters.application?.map(filter=>filter.value),
          texture: filters.texture?.map(filter=>filter.value),
          design: filters.design?.map(filter=>filter.value),
          color: filters.color?.map(filter=>filter.value),
          finishing: filters.finishing?.map(filter=>filter.value),
          size: filters.size?.map(filter=>filter.value),
          order_by: sort ?? undefined
        }
      ))
      
      return data
    }
  })
}