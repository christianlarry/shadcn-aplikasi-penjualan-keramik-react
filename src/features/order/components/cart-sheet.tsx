import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { formatCurrency} from "@/utils/string-fn";
import { useCartStore } from "@/features/order/store/use-cart-store"
import { Link2, ShoppingCart } from "lucide-react"
import { Link } from "react-router"
import ConfirmationResetCartDialog from "./reset-cart-dialog"
import OrderModal from "./order-modal"
import { useGetProductsByIds } from "@/features/catalog/api/get-products-by-ids"
import { useMemo } from "react"
import CartItem from "./cart-item"

const CartSheet = () => {

  // Cart Store State
  const totalCart = useCartStore((state)=>state.cart.length)
  const cart = useCartStore((state)=>state.cart)

  const openCart = useCartStore((state)=>state.openCart)
  const setOpenCart = useCartStore((state)=>state.setOpenCart)

  // Get Products from cart ids
  const products = useGetProductsByIds({
    productIds: cart.map(item=>item.id)
  })

  const isLoading = products.some(product => product.isLoading)
  const isError = products.some(product => product.isError)

  const {cartItemsWithData,totalAmount} = useMemo(()=>{
    if (isLoading || isError) {
      return { cartItemsWithData: [], totalAmount: 0 };
    }

    // Buat Map untuk pencarian produk yang efisien (O(1) lookup)
    const productsMap = new Map(
      products.map(query => [query.data?.data._id, query.data?.data])
    );

    const cartItemsWithData = cart
      .map(item => {
        const product = productsMap.get(item.id);
        // Jika produk ditemukan, gabungkan data cart dengan data produk
        if (product) {
          return {
            ...item, // id, quantity
            product, // data produk lengkap
          };
        }
        return null; // Jika produk tidak ditemukan, kembalikan null
      })
      .filter((item)=>item != null); // Hapus item yang null

    // Hitung total harga dari data yang sudah digabungkan
    const totalAmount = cartItemsWithData.reduce((total, item) => {
      return total + (item.product.finalPrice * item.quantity);
    }, 0);

    return { cartItemsWithData, totalAmount };
  },[cart, products, isLoading, isError])

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

      <SheetContent className="rounded-s-md w-full sm:max-w-[450px]">
        <SheetHeader>
          <SheetTitle>Keranjang Belanja | <span className="text-muted-foreground font-normal">{totalCart} item</span></SheetTitle>
          <SheetDescription>
            Lihat produk yang telah Anda pilih untuk dibeli. Untuk pembelian dilakukan melalui WhatsApp.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto rounded-md">
          {!(isLoading || isError) &&
            <ul className="rounded-md flex flex-col">
              
              {cartItemsWithData.length > 0 && cartItemsWithData.map((item,idx)=>{
                const {product} = item

                return (
                  <>
                    <CartItem key={item.id} item={item} product={product}/>
                    {(idx != cart.length-1) && <Separator className="my-8"/>}
                  </>
                )
              })}

              {cart.length === 0 &&
                <div className="flex flex-col items-center">
                  <p className="text-muted-foreground text-center">Keranjang Anda kosong.</p>
                  <Button variant="link" className="p-0 size-auto" asChild>
                    <Link to="/catalog/all-products" onClick={()=>setOpenCart(false)}>
                      <Link2/>Klik untuk belanja
                    </Link>
                  </Button>
                </div>
              }
            </ul>
          }

          {isLoading && <p className="text-muted-foreground">Memuat produk...</p>}

          {isError && <p className="text-destructive">Terjadi kesalahan saat memuat produk.</p>}
        </div>

        <SheetFooter className="pt-0">
          {cartItemsWithData.length > 0 &&
            <div className="flex items-center justify-between gap-4">
              <ConfirmationResetCartDialog/>
              <div className="flex items-center justify-end gap-2">
                <span>Total:</span>
                {/* --- LEBIH CLEAN: Langsung gunakan total yang sudah dihitung --- */}
                <span className="text-lg font-semibold">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          }

          <Separator className="my-2"/>

          <div className="flex flex-col gap-2">
            <OrderModal productQueryResult={products.map(p=>p.data)}/>
            {/* <QrisModal/> */}
            <SheetClose asChild>
              <Button variant="outline">Tutup</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default CartSheet