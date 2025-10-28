import Catalog from "@/features/catalog/components/catalog"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"
import { CatalogProvider } from "@/features/catalog/contexts/catalog-context"

const AllProductsPage = () => {
  return (
    <div className="flex flex-col gap-12">

      <BreadcrumbsSection/>

      <section id="product-catalog">
        <CatalogProvider>
          <Catalog/>
        </CatalogProvider>
      </section>
    </div>
  )
}

export default AllProductsPage