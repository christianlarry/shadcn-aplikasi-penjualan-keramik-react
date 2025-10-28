import type { Location } from "react-router";

const productImgBaseUrl = import.meta.env.VITE_API_PRODUCT_IMG_BASEURL || ""

export const getProductImgUrl = (imagePath:string):string=>{
  return productImgBaseUrl+imagePath
}

export function buildUrlWithParams(baseUrl: string, params?: Record<string, string | number | boolean | undefined | (string | number)[]>) {
  const url = new URL(baseUrl, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {

        if(Array.isArray(value)){
          value.forEach(val=>url.searchParams.append(key,String(val)))
        }else{
          url.searchParams.append(key, String(value))
        }

      }
    })
  }
  // Hanya mengembalikan path + query, tanpa origin
  return url.pathname + url.search
}

export const buildCurrentUrlWithParams = (location:Location, params?: Record<string, string | number | boolean | undefined>) =>{
    const searchParams = new URLSearchParams(location.search)

    if(params){
      Object.entries(params).forEach(([key,value])=>{
        if(value !== undefined && value){
          searchParams.set(key,String(value))
        }else{
          searchParams.delete(key)
        }
      })
    }

    return [location.pathname,searchParams.toString()].join("?")
  }