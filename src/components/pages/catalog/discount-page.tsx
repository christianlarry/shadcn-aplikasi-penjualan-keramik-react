import Catalog from "@/components/common/catalog/catalog"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"
import { CatalogProvider } from "@/contexts/catalog-context"

const DiscountPage = () => {
  return (
    <div className="flex flex-col gap-12">

      <BreadcrumbsSection/>

      <section id="product-catalog">
        <CatalogProvider>
          <Catalog category="discount"/>
        </CatalogProvider>
      </section>
    </div>
  )
}

export default DiscountPage