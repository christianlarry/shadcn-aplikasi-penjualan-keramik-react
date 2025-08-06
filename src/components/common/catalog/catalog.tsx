
import ProductCard from "../card/product-card"
import Pagination from "../pagination/pagination"
import CatalogSidebar from "./catalog-sidebar"
import CatalogTop from "./catalog-top"
import { useProductQuery } from "@/hooks/use-product-query"

const Catalog = () => {

  const {data} = useProductQuery()

  return (
    <div className="flex gap-6 items-start">
      
      <CatalogSidebar/>

      <div className="w-full flex flex-col gap-12">
        <CatalogTop/>

        <section id="catalog-cards">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {data && data.data.map((product,idx)=>(
              <ProductCard product={product} key={product._id ?? idx}/>
            ))}
          </div>
        </section>
        
        {data &&
          <section id="catalog-pagination" className="mt-4">
            <Pagination
              totalPages={data.page.totalPages}
              current={data.page.current}
              limit={9}
            />
          </section>
        }
      </div>
    </div>
  )
}

export default Catalog