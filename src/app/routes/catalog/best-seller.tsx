import Catalog from "@/features/catalog/components/catalog"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"
import { CatalogProvider } from "@/features/catalog/contexts/catalog-context"
import { Head } from "@/components/seo/head"

const BestSellerPage = () => {
  return (
    <>
      <Head
        title="Best Seller"
        description="Katalog lengkap produk keramik best seller dari CV Aneka Keramik. Temukan berbagai pilihan keramik berkualitas tinggi untuk kebutuhan rumah dan proyek Anda."
      />

      <div className="flex flex-col gap-12">

        <BreadcrumbsSection/>

        <section id="product-catalog">
          <CatalogProvider>
            <Catalog category="bestSeller"/>
          </CatalogProvider>
        </section>
      </div>
    </>
  )
}

export default BestSellerPage