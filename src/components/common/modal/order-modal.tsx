import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { INFORMASI_TOKO } from "@/constants/informasiToko"
import { formatCurrency } from "@/lib/utils"
import { useCartStore } from "@/store/use-cart-store"
import { useOrderStore } from "@/store/use-order-store"
import type { GetSingleProductResponse} from "@/types/product"
import { DialogClose } from "@radix-ui/react-dialog"
import { Info, MessageCircle } from "lucide-react"

interface Props{
  productQueryResult:(GetSingleProductResponse | undefined)[]
}

const OrderModal = ({productQueryResult}:Props) => {

  const cart = useCartStore((state)=>state.cart)
  const user = useOrderStore((state)=>state.user)
  const setUser = useOrderStore((state)=>state.setUser)

  const handleTriggerClick = (e:React.MouseEvent<HTMLButtonElement>)=>{
    // Batalkan open modal jika cart kosong
    if(cart.length === 0) e.preventDefault()
  }

  const handlePesan = ()=>{
    const productInCart = productQueryResult.filter(p=>!!p).map((p)=>{
      return {
        ...p.data,
        quantity: cart.filter(c=>c.id === p.data._id)[0].quantity
      }
    })

    const WA_MESSAGE = `
*Pesanan Baru dari Website Toko Keramik*

Nama: ${user.namaLengkap}
Alamat: ${user.alamat}

Detail Pesanan:
${productInCart.map(p=>`${p.name} ${p.specification.size.width}x${p.specification.size.height}cm (x${p.quantity}) = Rp${formatCurrency(p.finalPrice*p.quantity)}`).join(`\n`)}

Total: Rp${formatCurrency(productInCart.reduce((total,p)=>{
  return total+p.finalPrice*p.quantity
},0))}

Terima kasih`

    window.open(`https://wa.me/${INFORMASI_TOKO.NO_WA}?text=${encodeURIComponent(WA_MESSAGE)}`, "_blank")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleTriggerClick} disabled={cart.length===0}><MessageCircle/>Pesan (Whatsapp)</Button>
      </DialogTrigger>
    
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pemesanan</DialogTitle>
          <DialogDescription>Lakukan pemesanan melalui whatsapp. Mohon isi form dibawah ini.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <Input 
              type="text" 
              id="namaLengkap" 
              placeholder="Cth: Christian Rondonuwu"
              value={user.namaLengkap}
              onChange={(e)=>setUser({...user,namaLengkap:e.target.value})}
              />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="alamat">Alamat Rumah</Label>
            <Input 
              type="text" 
              id="alamat" 
              placeholder="Alamat pengantaran"
              value={user.alamat}
              onChange={(e)=>setUser({...user,alamat:e.target.value})}
              />
          </div>

          <Alert>
            <Info />
            <AlertTitle>Catatan Penting</AlertTitle>
            <AlertDescription>
              <ul className="list-disc">
                <li>Pastikan pesanan anda di keranjang.</li>
                <li>Pemesanan hanya dilakukan lewat Whatsapp, Tidak ada integrasi pembayaran online.</li>
                <li>Lakukan transaksi jika pemilik toko sudah mengirimkan nota pemesanan lewat Whatsapp.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Tutup</Button>
          </DialogClose>
          <Button onClick={handlePesan}>
            Pesan Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OrderModal