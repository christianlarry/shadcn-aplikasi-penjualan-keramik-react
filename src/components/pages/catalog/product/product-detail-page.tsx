import ProductDetail from "@/components/common/product/product-detail"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"
import { useSingleProductQuery } from "@/hooks/use-product-query"
import { useEffect } from "react"
import { useLocation, useParams } from "react-router"

const ProductDetailPage = () => {

  const params = useParams()
  const location = useLocation()

  const productId = params.id ?? ""

  const {data} = useSingleProductQuery(productId)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [location.pathname])

  return (
    <div className="flex flex-col gap-12">

      <BreadcrumbsSection/>

      {data &&
        <ProductDetail product={data.data}/>
      }
    </div>
  )
}

export default ProductDetailPage