import type { Pagination } from "@/types/api"

export interface Product{
  _id?: string,
  name: string,
  description?: string,
  specification:{
    size: {
      width: number,
      height: number
    },
    application: string[],
    design: string,
    color: string[],
    finishing: string,
    texture: string,
    isWaterResistant:boolean,
    isSlipResistant:boolean,
  }
  brand: string,
  price: number,
  tilesPerBox: number,
  finalPrice: number,
  discount?:number,
  isBestSeller?:boolean,
  isNewArrivals?:boolean,
  image?: string,
  recommended?: string[],
  createdAt: Date,
  updatedAt: Date
}
export interface GetProductsResponse {
  data:Product[],
  page:Pagination
}

export interface GetProductResponse {
  data:Product,
}

export interface ProductFilterOptions{
  _id: string,
  type:string,
  options:{
    label:string,
    value:string
  }[]
}

export interface GetProductFilterOptionsResponse {
  data:ProductFilterOptions[]
}

type FilterType = {
  label:string
  value:string
}[] | null

export interface GetProductParams{
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