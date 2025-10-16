import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, getProductImgUrl } from "@/lib/utils"
import { useCartStore } from "@/store/use-cart-store"
import type { Product } from "@/types/product"
import { ShoppingCart } from "lucide-react"
import { Link } from "react-router"
import { toast } from "sonner"

interface Props{
  product:Product
}

const ProductCard = ({
  product
}:Props) => {

  const addToCart = useCartStore((state)=>state.addToCart)
  const setOpenCart = useCartStore((state)=>state.setOpenCart)

  const handleAddToCart = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    addToCart({
      id: product._id!,
      quantity: 1
    })

    toast.success("Produk berhasil ditambahkan ke keranjang",{
      position: "top-center"
    })

    setOpenCart(true)
  }

  return (
    <Link to={`/catalog/product/${product._id}`}>
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
              {product.discount && (
                <Badge variant={"destructive"}>-{product.discount}%</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-between mt-6">
          <div className="w-[70%] flex flex-col gap-2">
            <p className="truncate">
              {product.name} | <span className="font-semibold text-sm">{product.specification.size.width}x{product.specification.size.height}cm</span>
            </p>
            {/* Harga */}
            {product.discount ? (
              <div className="flex flex-col">
                <span className="text-sm line-through text-muted-foreground">
                  Rp{formatCurrency(product.price)}
                </span>
                <span className="font-semibold text-xl">
                  Rp{formatCurrency(product.finalPrice)}
                </span>
              </div>
            ) : (
              <h3 className="font-semibold text-xl">
                Rp{formatCurrency(product.price)}
              </h3>
            )}
          </div>
          <Button size="icon" className="size-12" onClick={handleAddToCart}>
            <ShoppingCart className="size-5" />
          </Button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard