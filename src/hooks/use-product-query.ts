import type { Options } from "@/components/common/catalog/sidebar-select-input"
import api from "@/lib/api"
import { buildUrlWithParams } from "@/lib/utils"
import type { GetProductResponse, GetSingleProductResponse } from "@/types/product"
import { useQueries, useQuery } from "@tanstack/react-query"

type FilterType = Options[]|null

interface GetProductParams{
  page?:number,
  size?:number,
  filters?:{
    application:FilterType,
    design:FilterType,
    texture:FilterType,
    color:FilterType,
    finishing:FilterType,
    size:FilterType
  },
  search?:string,
  sort?:string|null,
  isBestSeller?:boolean,
  isNewArrivals?:boolean,
  isDiscount?:boolean,
  options?:{
    enabled?:boolean
  }
}

export const useProductQuery = ({
  page=1,
  size=12,
  filters={
    application: null,
    color: null,
    design: null,
    finishing: null,
    size: null,
    texture: null
  },
  search,
  sort=null,
  isBestSeller=false,
  isDiscount=false,
  isNewArrivals=false,
  options
}:GetProductParams)=>{
  return useQuery({
    queryKey: ["products",page,size,filters,search,sort,isBestSeller,isNewArrivals,isDiscount],
    queryFn: async ()=>{
      const {data} = await api.get<GetProductResponse>(buildUrlWithParams("/product",
        {
          pagination_page: page,
          pagination_size: size,
          application: filters.application?.map(filter=>filter.value),
          texture: filters.texture?.map(filter=>filter.value),
          design: filters.design?.map(filter=>filter.value),
          color: filters.color?.map(filter=>filter.value),
          finishing: filters.finishing?.map(filter=>filter.value),
          size: filters.size?.map(filter=>filter.value),
          order_by: sort ?? undefined,
          bestSeller: isBestSeller,
          newArrivals: isNewArrivals,
          discounted: isDiscount,
          search:search
        }
      ))
      
      return data
    },
    enabled: options?.enabled ?? true,
  })
}

export const useSingleProductQuery = (productId?:string)=>{
  return useQuery({
    queryKey: ["product",productId],
    queryFn: async ()=>{
      const {data} = await api.get<GetSingleProductResponse>(`/product/${productId}`)

      return data
    },
    enabled: !!productId
  })
}

export const useSingleProductQueries = (productIds:string[])=>{
  return useQueries({
    queries: productIds.map(productId=>({
      queryKey: ["product",productId],
      queryFn: async ()=>{
        const {data} = await api.get<GetSingleProductResponse>(`/product/${productId}`)

        return data
      },
      enabled: !!productId
    }))
  })
}