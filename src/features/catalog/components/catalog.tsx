
import { useEffect, useState } from "react"
import ProductCard from "./product-card"
import Pagination from "../../../components/common/pagination/pagination"
import CatalogSidebar from "./catalog-sidebar"
import CatalogTop from "./catalog-top"
import { useLocation } from "react-router"
import { useCatalog } from "@/features/catalog/contexts/catalog-context"
import { useSearchParams } from "@/hooks/use-search-params"
import { EmptyProduct } from "./empty-product"
import { useGetProducts } from "../api/get-products"
import FetchLoaders from "@/components/common/loaders/fetch-loaders"

const PAGINATION_LIMIT = 9

interface Props{
  category?: "default" | "bestSeller" | "newArrivals" | "discount"
}

const Catalog = ({
  category="default"
}:Props) => {

  const [page,setPage] = useState<number>(1)
  const {filters,sort,search} = useCatalog()

  const {data,isLoading,isFetching,refetch} = useGetProducts({
    params: {
      page: page,
      filters:{
        application: filters["application"],
        color: filters["color"],
        design: filters["design"],
        texture: filters["texture"],
        finishing: filters["finishing"],
        size: filters["size"]
      },
      sort: sort,
      search: search,
      isBestSeller: category==="bestSeller",
      isDiscount: category==="discount",
      isNewArrivals: category==="newArrivals"
    }
  })

  const location = useLocation()

  const {searchParamsHas,getSearchParams,setSearchParams} = useSearchParams()

  useEffect(()=>{
    
    if(searchParamsHas("page")){
      const pageInParams = getSearchParams("page") || "1"
      const parsedPage = parseInt(pageInParams)

      if(isNaN(parsedPage)){
        setSearchParams("page","1")
      }else{
        setPage(parsedPage)
      }

    }else{
      setPage(1)
    }

  },[location,getSearchParams,searchParamsHas,setSearchParams])

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

            {(data && data.data.length < 1 && !isFetching) &&
              <div className="col-span-3">
                <EmptyProduct
                  title="Produk Tidak Ditemukan"
                  description="Tidak ada produk yang sesuai dengan kriteria pencarian Anda."
                  onReload={()=>refetch()}
                />
              </div>
            }

            {(isLoading || isFetching) && 
              <div className="col-span-3 flex justify-center">
                <FetchLoaders/>
              </div>
            }
          </div>
        </section>
        
        {data && data.data.length > 0 &&
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