import heroImage from "@/assets/images/hero/hero-image-1.jpg"
import CatalogCard from "@/components/common/card/catalog-card"
import SearchBar from "@/components/common/input/search-bar"
import SectionHeader from "@/components/ui/section-header"

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
          
          <div className="grid grid-cols-4 gap-6">
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
          <SectionHeader title="Ubin Terbaik"/>

          <div>
            
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePage