import ProductDetail from "@/features/catalog/components/product-detail"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"
import { useSingleProductQuery } from "@/features/catalog/hooks/use-product-query"
import { useEffect } from "react"
import { useLocation, useParams } from "react-router"
import { Head } from "@/components/seo/head"

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
    <>
      <Head
        title={data ? data.data.name : "Detail Produk"}
        description={data ? data.data.description : "Detail lengkap produk keramik dari CV Aneka Keramik."}
      />

      <div className="flex flex-col gap-12">

        <BreadcrumbsSection/>

        {data &&
          <ProductDetail product={data.data}/>
        }
      </div>
    </>
  )
}

export default ProductDetailPage