import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useSingleProductQueries } from "@/hooks/use-product-query"
import { capitalize } from "@/lib/string-formatter"
import { formatCurrency, getProductImgUrl } from "@/lib/utils"
import { useCartStore } from "@/store/use-cart-store"
import { Barcode, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react"

const CartSheet = () => {

  // Cart Store State
  const totalCart = useCartStore((state)=>state.cart.length)
  const cart = useCartStore((state)=>state.cart)
  const add = useCartStore((state)=>state.addToCart)
  const decrementQuantity = useCartStore((state)=>state.decrementQuantity)

  const openCart = useCartStore((state)=>state.openCart)
  const setOpenCart = useCartStore((state)=>state.setOpenCart)

  // Get Products from cart ids
  const products = useSingleProductQueries(cart.map(item=>item.id))

  const isLoading = products.some(product => product.isLoading)
  const isError = products.some(product => product.isError)

  return (
    <Sheet open={openCart} onOpenChange={setOpenCart}>

      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"} className="relative">
          <ShoppingCart/>
          <Badge 
            className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full tabular-nums" variant="destructive">
            {totalCart}
          </Badge>
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-s-md sm:max-w-[450px]">
        <SheetHeader>
          <SheetTitle>Keranjang Belanja | <span className="text-muted-foreground font-normal">{totalCart} item</span></SheetTitle>
          <SheetDescription>
            Lihat produk yang telah Anda pilih untuk dibeli. Untuk pembelian dilakukan melalui WhatsApp.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto rounded-md">
          {!(isLoading || isError) &&
            <ul className="rounded-md flex flex-col gap-8">
              {cart.length > 0 && cart.map((item)=>{
                const product = products.filter(p=>p.data?.data._id === item.id)[0].data
                if(!product) return null

                return (
                  <li key={item.id}>
                    <div className="rounded-md flex gap-2 items-start text-sm">
                      <div className="w-[80px]">
                        <Avatar className="rounded-md aspect-square w-full h-full">
                          <AvatarImage
                            src={getProductImgUrl(product.data.image ?? "")}
                            alt="Product Image"
                            className="object-cover object-center rounded-md"
                          />
                          <AvatarFallback className="rounded-md">{capitalize(product.data.name[0])}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-1 flex-col gap-1">
                        <span className="text-muted-foreground">{product.data.brand}</span>
                        <h4 className="text-base uppercase font-semibold">{product.data.name}</h4>
                        <div className="flex flex-wrap gap-2 text-muted-foreground">
                          <span>Ukuran: <span className="text-primary font-semibold">{product.data.specification.size.width}x{product.data.specification.size.height}cm</span></span>
                          <span>Pengaplikasian: <span className="text-primary font-semibold">{product.data.specification.application.join(", ")}</span></span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {product.data.isBestSeller && <Badge variant="outline">Best Seller</Badge>}
                          {product.data.isNewArrivals && <Badge variant="outline">New Arrivals</Badge>}
                          {product.data.discount && <Badge variant="destructive">{product.data.discount}% off</Badge>}
                        </div>

                        <div className="flex items-start justify-between mt-6">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{product.data.tilesPerBox}pcs <span className="font-normal">/ box</span></span>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={()=>decrementQuantity(item.id)}><Minus/></Button>
                              <Button variant="secondary" size="icon">{item.quantity}</Button>
                              <Button variant="outline" size="icon" onClick={()=>add({...item,quantity:1})}><Plus/></Button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {product.data.discount &&
                              <span className="text-base text-muted-foreground line-through">Rp{formatCurrency(product.data.price * item.quantity)}</span>
                            }
                            <span className="text-lg font-semibold">Rp{formatCurrency(product.data.finalPrice * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          }

          {isLoading && <p className="text-muted-foreground">Memuat produk...</p>}

          {isError && <p className="text-destructive">Terjadi kesalahan saat memuat produk.</p>}
        </div>

        <SheetFooter>
          <Button onClick={()=>console.log(cart)}><MessageCircle/>Pesan (Whatsapp)</Button>
          <Button variant="outline"><Barcode/>Lihat QRIS</Button>
          <SheetClose asChild>
            <Button variant="outline">Tutup</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet