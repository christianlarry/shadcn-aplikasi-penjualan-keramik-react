import Catalog from "@/components/common/catalog/catalog"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"

const AllProductsPage = () => {
  return (
    <div className="flex flex-col gap-12">

      <BreadcrumbsSection/>

      <section id="product-catalog">
        <Catalog/>
      </section>
    </div>
  )
}

export default AllProductsPage