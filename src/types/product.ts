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
  finalPrice: number,
  discount?:number,
  isBestSeller?:boolean,
  isNewArrivals?:boolean,
  image?: string,
  recommended?: string[],
  createdAt: Date,
  updatedAt: Date
}