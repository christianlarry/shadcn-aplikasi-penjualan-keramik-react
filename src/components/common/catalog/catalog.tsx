
import CatalogSidebar from "./catalog-sidebar"
import CatalogTop from "./catalog-top"

const Catalog = () => {
  return (
    <div className="flex gap-8 items-start">
      
      <CatalogSidebar/>

      <div className="w-full flex flex-col gap-12">
        <CatalogTop/>

        <section id="catalog-cards">
          
        </section>
      </div>
    </div>
  )
}

export default Catalog