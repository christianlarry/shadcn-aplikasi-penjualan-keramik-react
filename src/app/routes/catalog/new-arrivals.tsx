import Catalog from "@/features/catalog/components/catalog"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"
import { CatalogProvider } from "@/features/catalog/contexts/catalog-context"
import { Head } from "@/components/seo/head"

const NewArrivalsPage = () => {
  return (
    <>
      <Head
        title="New Arrivals"
      />

      <div className="flex flex-col gap-12">

        <BreadcrumbsSection />

        <section id="product-catalog">
          <CatalogProvider>
            <Catalog category="newArrivals" />
          </CatalogProvider>
        </section>
      </div>
    </>
  )
}

export default NewArrivalsPage