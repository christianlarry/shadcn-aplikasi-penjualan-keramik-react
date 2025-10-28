import heroImage from "@/assets/images/hero/hero-image-1.jpg"

import CatalogCard from "@/features/catalog/components/catalog-category-card"
import SearchBar from "@/components/common/input/search-bar"
import ProductSlider, { type ProductSliderRef } from "@/components/common/sections/product-slider"
import { Button } from "@/components/ui/button"
import type { CarouselApi } from "@/components/ui/carousel"
import SectionHeader from "@/components/ui/section-header"
import { Calculator, ChevronLeft, ChevronRight, Map, ShoppingCart } from "lucide-react"
import { useRef, useState } from "react"
import { Link } from "react-router"
import Logo from "@/components/common/logo/logo"
import { useProductQuery } from "@/features/catalog/hooks/use-product-query"
import { EmptyProduct } from "@/features/catalog/components/empty-product"
import { INFORMASI_TOKO } from "@/constants/informasi-toko"

const HomePage = () => {

  // Get 6 Best Seller Product
  const {data} = useProductQuery({
    page: 1,
    size: 6,
    isBestSeller: true
  })

  const sliderRef = useRef<ProductSliderRef>(null)
  const [isFirstProductSlider,setIsFirstProductSlider] = useState<boolean>(false)
  const [isLastProductSlider,setIsLastProductSlider] = useState<boolean>(false)

  const handleProductSliderSelect = (api:CarouselApi)=>{
    if(api){
      if(!api.canScrollNext()){
        setIsLastProductSlider(true)
      }else{
        setIsLastProductSlider(false)
      }

      if(!api.canScrollPrev()){
        setIsFirstProductSlider(true)
      }else{
        setIsFirstProductSlider(false)
      }
    }
  }

  return (
    <div className="flex flex-col gap-12">

      <section id="hero">
        <div className="relative h-[600px] bg-zinc-200 rounded-md overflow-hidden">
          <div className="text-center flex flex-col gap-8 items-center justify-center relative z-10 h-full w-full p-16 backdrop-brightness-85">
            <h2 className="text-6xl font-light text-primary-foreground">Temukan <span className="font-semibold">ubin</span> yang sesuai dengan <span className="font-semibold">kebutuhan anda</span>!</h2>
            
            <div className="max-w-[700px]">
              <SearchBar/>
            </div>
          </div>
          <div className="absolute inset-0">  
            <img 
              src={heroImage} 
              alt="Hero Image" 
              className="w-full h-full block object-center object-cover" 
              loading="lazy"
              />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-20">

        <section>
          <div className="flex flex-col items-center">
            <div className="max-w-[500px] flex flex-col items-center">
              <div className="max-w-[500px]">
                <Logo/>
              </div>
              <p className="text-center">Temukan berbagai pilihan ubin keramik berkualitas tinggi untuk mempercantik rumah dan bangunan Anda. CV Aneka Keramik siap memenuhi kebutuhan interior dan eksterior Anda.</p>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Button asChild>
                  <Link to="/catalog/all-products">
                    <ShoppingCart/>Katalog
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/tile-calculator">
                    <Calculator/>Kalkulator Ubin
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href={INFORMASI_TOKO.MAP_LOCATION_URL} target="_blank">
                    <Map/>Find Shop
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader title="Katalog Ubin"/>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <CatalogCard
              label="Semua Produk"
              imgSrc="https://s7d1.scene7.com/is/image/TileShop/484942_51_REN:3x2?fmt=webp"
              href="/catalog/all-products"
            />
            <CatalogCard
              label="Best Seller"
              imgSrc="https://s7d1.scene7.com/is/image/TileShop/Homepage_May2025_BestSellers:3x2?fmt=webp"
              href="/catalog/best-seller"
            />
            <CatalogCard
              label="New Arrivals"
              imgSrc="https://s7d1.scene7.com/is/image/TileShop/Homepage_May2025_Clearance:3x2?fmt=webp"
              href="/catalog/new-arrivals"
            />
            <CatalogCard
              label="Discount Product"
              imgSrc="https://s7d1.scene7.com/is/image/TileShop/Homepage_May2025_USAMade:3x2?fmt=webp"
              href="/catalog/discount"
            />
          </div>
        </section>

        <section>
          <div className="flex justify-between gap-4">
            <SectionHeader title="Ubin Terbaik"/>
            <div className="flex gap-1">
              <Button 
                variant={"outline"} 
                size={"icon"} 
                className="rounded-sm" 
                onClick={()=>sliderRef.current?.scrollPrev()}
                disabled={isFirstProductSlider}
              >
                <ChevronLeft/>
              </Button>
              <Button 
                variant={"outline"} 
                size={"icon"} 
                className="rounded-sm" 
                onClick={()=>sliderRef.current?.scrollNext()}
                disabled={isLastProductSlider}
              >
                <ChevronRight/>
              </Button>
            </div>
          </div>

          {data &&
            <ProductSlider
              ref={sliderRef}
              products={data.data}
              onSelect={handleProductSliderSelect}
            />
          }

          {!data && 
            <EmptyProduct/>
          }

        </section>
      </div>
    </div>
  )
}

export default HomePage