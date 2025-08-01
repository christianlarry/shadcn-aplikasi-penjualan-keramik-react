import heroImage from "@/assets/images/hero/hero-image-1.jpg"
import calculatorBannerImage from "@/assets/images/calculator-banner-image.webp"

import CatalogCard from "@/components/common/card/catalog-card"
import SearchBar from "@/components/common/input/search-bar"
import ProductSlider, { type ProductSliderRef } from "@/components/common/slider/product-slider"
import { Button } from "@/components/ui/button"
import type { CarouselApi } from "@/components/ui/carousel"
import SectionHeader from "@/components/ui/section-header"
import type { Product } from "@/types/product"
import { Calculator, ChevronLeft, ChevronRight, Map, ShoppingCart } from "lucide-react"
import { useRef, useState } from "react"
import { Link } from "react-router"
import Logo from "@/components/common/logo/logo"
import { EXTERNAL_LINKS } from "@/constants/links.strings"

const product:Product = {
            "_id": "683154122817740b69b1e100",
            "name": "KIA Mosaic Blue",
            "description": "Glossy blue mosaic tiles for decorative walls.",
            "specification": {
                "application": [
                    "Dinding"
                ],
                "color": [
                    "Blue",
                    "White"
                ],
                "design": "Mosaic",
                "finishing": "Glossy",
                "texture": "Smooth",
                "size": {
                    "height": 30,
                    "width": 30
                },
                "isSlipResistant": false,
                "isWaterResistant": true
            },
            "brand": "KIA",
            "price": 65000,
            "recommended": [
                "Dapur",
                "Kamar Mandi"
            ],
            "createdAt": new Date("2025-05-24T05:07:30.222Z"),
            "updatedAt": new Date("2025-07-26T12:52:23.884Z"),
            "isBestSeller": true,
            "isNewArrivals": true,
            "image": "uploads\\images\\products\\kia-mosaic-blue-1753854636697.jpeg",
            "finalPrice": 65000
        }

const HomePage = () => {

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
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-[500px]">
                <Logo/>
              </div>
              <p className="text-center">Temukan berbagai pilihan ubin keramik berkualitas tinggi untuk mempercantik rumah dan bangunan Anda. CV Aneka Keramik siap memenuhi kebutuhan interior dan eksterior Anda.</p>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" asChild>
                  <Link to="/catalog/all-products">
                    <ShoppingCart/>Katalog
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/tile-calculator">
                    <Calculator/>Kalkulator Ubin
                  </Link>
                </Button>
                <Button asChild>
                  <a href={EXTERNAL_LINKS.gmapsLocation} target="_blank">
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

          <ProductSlider
            ref={sliderRef}
            products={Array.from({length: 6}).map(()=>product)}
            onSelect={handleProductSliderSelect}
          />

        </section>

        <section>
          <div className="w-full bg-primary flex rounded-md overflow-hidden">
            <div className="w-[45%] relative">
              <div className="absolute inset-0">
                <img 
                  src={calculatorBannerImage}
                  alt="Kalkulator Ubin"
                  className="w-full h-full block object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="flex-1 text-primary-foreground p-10 py-16">
              <div className="flex flex-col gap-8 items-start">
                <div>
                  <span className="font-semibold text-muted underline">Fitur Utama</span>
                  <h2 className="text-5xl font-bold mt-2">Bingung berapa ubin yang anda butuhkan?</h2>
                  <p className="mt-2">Gunakan kalkulator otomatis kami buat hitung ubin hanya dalam hitungan detik.</p>
                </div>
                <Button variant="secondary" asChild>
                  <Link to="/tile-calculator">
                    Coba Sekarang <ChevronRight/>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage