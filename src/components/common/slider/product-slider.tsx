import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import ProductCard from "../card/product-card"
import type { Product } from "@/types/product"
import {forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react"
import { Progress } from "@/components/ui/progress"

interface Props{
  products:Product[]
  onSelect:(api:CarouselApi)=>void
}

export interface ProductSliderRef{
  scrollNext:()=>void
  scrollPrev:()=>void
}

const ProductSlider = forwardRef<ProductSliderRef,Props>(({
  products,
  onSelect
},ref) => {

  const [carouselApi,setCarouselApi] = useState<CarouselApi>(undefined)
  const [progress,setProgress] = useState<number>(0)

  const handleOnSelect = useCallback(()=>{

    if(carouselApi){
      const selectedScrollSnapProgress = carouselApi.scrollSnapList()[carouselApi.selectedScrollSnap()]
      setProgress(Math.round(selectedScrollSnapProgress * 100))

      onSelect(carouselApi)
    }

  },[carouselApi,onSelect])

  useEffect(()=>{
    if(!carouselApi) return
    
    onSelect(carouselApi)

    carouselApi.on("select",handleOnSelect)

    return ()=>{
      carouselApi.off("select",handleOnSelect)
    }
  },[carouselApi,handleOnSelect,onSelect])

  // Set Ref value
  useImperativeHandle(ref,()=>{
    return {
      scrollNext: ()=>carouselApi?.scrollNext(),
      scrollPrev: ()=>carouselApi?.scrollPrev(),
    }
  },[carouselApi])

  return (
    <div className="flex flex-col">
      <Carousel setApi={setCarouselApi}>
        <CarouselContent className="-ml-8">
          {products.map((product,idx) => (
            <CarouselItem key={idx} className="sm:basis-1/2 lg:basis-1/3 pl-8">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Progress value={progress} className="mt-16 w-1/2 mx-auto"/>
    </div>
  )
})

export default ProductSlider