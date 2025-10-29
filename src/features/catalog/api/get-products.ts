import api from "@/lib/axios-client"
import type { GetProductParams, GetProductsResponse } from "../types/product"
import { queryOptions, useQuery } from "@tanstack/react-query"
import type { QueryConfig } from "@/lib/react-query"

const DEFAULT_PAGE = 1
const DEFAULT_SIZE = 12

// Fungsi fetch dengan Axios untuk mendapatkan produk dengan parameter opsional
export const getProducts = (
  params:GetProductParams
):Promise<GetProductsResponse>=>{
  return api.get("/product",{
    params: {
      pagination_page: params.page,
      pagination_size: params.size,
      application: params.filters?.application?.map(filter=>filter.value),
      texture: params.filters?.texture?.map(filter=>filter.value),
      design: params.filters?.design?.map(filter=>filter.value),
      color: params.filters?.color?.map(filter=>filter.value),
      finishing: params.filters?.finishing?.map(filter=>filter.value),
      size: params.filters?.size?.map(filter=>filter.value),
      order_by: params.sort ?? undefined,
      bestSeller: params.isBestSeller,
      newArrivals: params.isNewArrivals,
      discounted: params.isDiscount,
      search: params.search
    }
  })
}

// Query Key Products
export const getProductsQueryKey = (params:GetProductParams)=>{
  const {
    page = DEFAULT_PAGE,
    size = DEFAULT_SIZE,
    filters = {
      application: null,
      color: null,
      design: null,
      finishing: null,
      size: null,
      texture: null
    },
    search,
    sort = null,
    isBestSeller = false,
    isDiscount = false,
    isNewArrivals = false,
  } = params;

  return [
    "products",
    page,
    size,
    filters, // React Query akan melakukan shallow comparison pada objek ini
    search,
    sort,
    isBestSeller,
    isNewArrivals,
    isDiscount
  ]
}

export const getProductsQueryOptions = (params:GetProductParams={})=>{
  // Pastikan params selalu memiliki nilai default untuk queryKey dan queryFn
  const paramsWithDefaults = {
    page: DEFAULT_PAGE,
    size: DEFAULT_SIZE,
    ...params
  };

  return queryOptions({
    queryKey: getProductsQueryKey(paramsWithDefaults),
    queryFn: ()=>getProducts(paramsWithDefaults)
  })
}

type UseGetProductsOptions = {
  params?:GetProductParams
  queryConfig?:QueryConfig<typeof getProductsQueryOptions>
}

export const useGetProducts = (options:UseGetProductsOptions={})=>{
  return useQuery({
    ...getProductsQueryOptions(options.params),
    ...options.queryConfig
  })
}