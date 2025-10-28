import { Button } from "@/components/ui/button"
import { useCartStore } from "@/features/order/store/use-cart-store"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

const SaveProductButton = ({productId}:{productId:string}) => {
  

  const addToCart = useCartStore((state)=>state.addToCart)
  const setOpenCart = useCartStore((state)=>state.setOpenCart)

const handleAddToCartClick = ()=>{
  addToCart({
    id: productId,
    quantity: 1
  })

  toast.success("Produk berhasil ditambahkan ke keranjang",{
    position: "top-center"
  })

  setOpenCart(true)
}

  return (
    <Button onClick={handleAddToCartClick} variant="outline" className="flex items-center gap-2" size="lg">
      <ShoppingCart size={20} /> Tambah ke Keranjang
    </Button>
  )
}

export default SaveProductButton