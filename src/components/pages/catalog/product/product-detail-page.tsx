import ProductDetail from "@/components/common/product/product-detail"
import BreadcrumbsSection from "@/components/common/sections/breadcrumbs-section"

const product = {
            "_id": "683154122817740b69b1e100",
            "name": "KIA Mosaic Blue",
            "description": "Glossy blue mosaic tiles for decorative walls.",
            "specification": {
                "application": [
                    "Dinding"
                ],
                "color": [
                    "Blue",
                    "White"
                ],
                "design": "Mosaic",
                "finishing": "Glossy",
                "texture": "Smooth",
                "size": {
                    "height": 30,
                    "width": 30
                },
                "isSlipResistant": false,
                "isWaterResistant": true
            },
            "brand": "KIA",
            "price": 65000,
            "recommended": [
                "Dapur",
                "Kamar Mandi"
            ],
            "createdAt": new Date("2025-05-24T05:07:30.222Z"),
            "updatedAt": new Date("2025-07-30T05:50:36.697Z"),
            "isBestSeller": true,
            "isNewArrivals": true,
            "image": "uploads\\images\\products\\kia-mosaic-blue-1753854636697.jpeg",
            "finalPrice": 35000,
            "discount": 20
        }

const ProductDetailPage = () => {

  

  return (
    <div className="flex flex-col gap-12">

      <BreadcrumbsSection/>

      <ProductDetail product={product} />
    </div>
  )
}

export default ProductDetailPage