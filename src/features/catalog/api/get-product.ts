import api from "@/lib/axios-client"
import type { GetProductResponse } from "../types/product"
import { queryOptions, useQuery } from "@tanstack/react-query"
import type { QueryConfig } from "@/lib/react-query"

export const getProduct = (productId:string):Promise<GetProductResponse>=>{
  return api.get(`/product/${productId}`)
}

export const getProductQueryKey = (productId:string)=>["products",productId]

export const getProductQueryOptions = (productId:string)=>{
  return queryOptions({
    queryKey: getProductQueryKey(productId),
    queryFn: ()=>getProduct(productId),
  })
}

type UseGetProductOptions = {
  productId:string,
  queryConfig?:QueryConfig<typeof getProductQueryOptions>
}

export const useGetProduct = (options:UseGetProductOptions)=>{
  return useQuery({
    ...getProductQueryOptions(options.productId),
    ...options.queryConfig
  })
}