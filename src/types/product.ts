import type { Pagination } from "./pagination"

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
export interface GetProductResponse {
  data:Product[],
  page:Pagination
}
export interface GetSingleProductResponse {
  data:Product,
}

interface FilterOption{
  label:string,
  value:string
}

export interface ProductFilterOptions{
  _id: string,
  type:string,
  options:FilterOption[]
}