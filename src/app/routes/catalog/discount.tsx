import Catalog from "@/features/catalog/components/catalog"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"
import { CatalogProvider } from "@/features/catalog/contexts/catalog-context"
import { Head } from "@/components/seo/head"

const DiscountPage = () => {
  return (
    <>
      <Head
        title="Produk Sedang Diskon"
      />

      <div className="flex flex-col gap-12">

        <BreadcrumbsSection/>

        <section id="product-catalog">
          <CatalogProvider>
            <Catalog category="discount"/>
          </CatalogProvider>
        </section>
      </div>
    </>
  )
}

export default DiscountPage