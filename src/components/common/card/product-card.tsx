import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, getProductImgUrl } from "@/lib/utils"
import type { Product } from "@/types/product"
import { ShoppingCart } from "lucide-react"

interface Props{
  product:Product
}

const ProductCard = ({
  product
}:Props) => {
  return (
    <div className="group/card">
      <div className="aspect-square bg-muted rounded-md overflow-hidden relative">
        {product.image &&
          <img
            src={getProductImgUrl(product.image)}
            alt="product-id-image"
            loading="lazy"
            className="w-full h-full object-center object-cover group-hover/card:scale-105 transition-transform duration-500"
          />
        }
        {!product.image &&
          <div className="w-full h-full flex items-center justify-center bg-muted select-none">
            <p>{product.name}</p>
          </div>
        }
        <div className="absolute inset-0 p-4">
          <div className="flex gap-1">
            {product.isBestSeller &&
              <Badge variant={"secondary"}>Best Seller</Badge>
            }
            {product.isNewArrivals &&
              <Badge variant={"secondary"}>New</Badge>
            }
          </div>
        </div>
      </div>
      <div className="flex gap-4 justify-between mt-6">
        <div className="flex-1 flex flex-col gap-2">
          <p>
            {product.name} | <span className="font-semibold">{product.specification.size.width}x{product.specification.size.height}cm</span>
          </p>
          <h3 className="font-semibold text-xl">Rp{formatCurrency(product.finalPrice)}</h3>
        </div>
        <Button size="icon" className="size-12">
          <ShoppingCart className="size-5" />
        </Button>
      </div>
    </div>
  )
}

export default ProductCard