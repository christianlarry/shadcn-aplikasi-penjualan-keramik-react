import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/features/catalog/types/product"
import { capitalize, formatCurrency } from "@/utils/string-fn"
import { getProductImgUrl } from "@/utils/url"
import { useCartStore } from "../store/use-cart-store"
import { Minus, Plus } from "lucide-react"

interface CartItemProps{
  product:Product,
  item:{
    id:string,
    quantity:number
  }
}

const CartItem = ({item,product}:CartItemProps) => {

  
  const add = useCartStore((state)=>state.addToCart)
  const decrementQuantity = useCartStore((state)=>state.decrementQuantity)

  return (
    <li key={item.id}>
      <div className="rounded-md flex gap-2 items-start text-sm">
        <div className="w-[80px]">
          <Avatar className="rounded-md aspect-square w-full h-full">
            <AvatarImage
              src={getProductImgUrl(product.image ?? "")}
              alt="Product Image"
              className="object-cover object-center rounded-md"
            />
            <AvatarFallback className="rounded-md">{capitalize(product.name[0])}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-1 flex-col">
          <span className="text-muted-foreground">{product.brand}</span>
          <h4 className="text-lg font-semibold">{product.name}</h4>
          <div className="flex flex-wrap gap-2 text-muted-foreground mt-1">
            <span>Ukuran: <span className="text-primary font-semibold">{product.specification.size.width}x{product.specification.size.height}cm</span></span>
            <span>Penggunaan: <span className="text-primary font-semibold">{product.specification.application.join(", ")}</span></span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.isBestSeller && <Badge variant="outline">Best Seller</Badge>}
            {product.isNewArrivals && <Badge variant="outline">New Arrivals</Badge>}
            {product.discount && <Badge variant="destructive">{product.discount}% off</Badge>}
          </div>

          <div className="flex flex-wrap gap-4 items-start justify-between mt-6">
            <div className="flex flex-col gap-1">
              <span className="font-medium">{product.tilesPerBox}pcs <span className="font-normal">/ box</span></span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => decrementQuantity(item.id)}><Minus /></Button>
                <Button variant="secondary" size="icon">{item.quantity}</Button>
                <Button variant="outline" size="icon" onClick={() => add({ ...item, quantity: 1 })}><Plus /></Button>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {product.discount &&
                <span className="text-base text-muted-foreground line-through">Rp{formatCurrency(product.price * item.quantity)}</span>
              }
              <span className="text-lg font-semibold">Rp{formatCurrency(product.finalPrice * item.quantity)}</span>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

export default CartItem