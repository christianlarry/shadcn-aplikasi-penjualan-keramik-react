
import { useEffect, useState } from "react"
import ProductCard from "../card/product-card"
import Pagination from "../pagination/pagination"
import CatalogSidebar from "./catalog-sidebar"
import CatalogTop from "./catalog-top"
import { useProductQuery } from "@/hooks/use-product-query"
import { useLocation, useNavigate } from "react-router"
import { useCatalog } from "@/contexts/catalog-context"

const PAGINATION_LIMIT = 9

const Catalog = () => {

  const [page,setPage] = useState<number>(1)
  const {filters,sort} = useCatalog()

  const {data} = useProductQuery({
    page: page
  })

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{

    const searchParams = new URLSearchParams(location.search)
    
    if(searchParams.has("page")){
      const pageInParams = searchParams.get("page") || "1"
      const parsedPage = parseInt(pageInParams)

      if(isNaN(parsedPage)){
        searchParams.set("page","1")
        navigate([location.pathname,searchParams.toString()].join("?"))
      }else{
        setPage(parsedPage)
      }

    }else{
      setPage(1)
    }

  },[location,navigate])

  return (
    <div className="flex gap-6 items-start">
      
      <CatalogSidebar/>

      <div className="w-full flex flex-col gap-12">
        <CatalogTop config={{totalData: data?.page.total ?? 0,showedData: data?.data.length ?? 0}}/>

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
              limit={PAGINATION_LIMIT}
            />
          </section>
        }
      </div>
    </div>
  )
}

export default Catalog