import heroImage from "@/assets/images/hero/hero-image-1.jpg"
import CatalogCard from "@/components/common/card/catalog-card"
import ProductCard from "@/components/common/card/product-card"
import SearchBar from "@/components/common/input/search-bar"
import { Button } from "@/components/ui/button"
import SectionHeader from "@/components/ui/section-header"
import type { Product } from "@/types/product"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
          <SectionHeader title="Katalog Ubin"/>
          
          <div className="grid grid-cols-4 gap-8">
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
              <Button variant={"outline"} size={"icon"} className="rounded-sm" disabled>
                <ChevronLeft/>
              </Button>
              <Button variant={"outline"} size={"icon"} className="rounded-sm">
                <ChevronRight/>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <ProductCard product={product}/>
            <ProductCard product={product}/>
            <ProductCard product={product}/>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage