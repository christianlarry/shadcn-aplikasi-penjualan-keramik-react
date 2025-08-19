import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Barcode, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react"

const CartSheet = () => {
  return (
    <Sheet>

      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"} className="relative">
          <ShoppingCart/>
          <Badge 
            className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full tabular-nums" variant="destructive">
            50
          </Badge>
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-s-md sm:max-w-[450px]">
        <SheetHeader>
          <SheetTitle>Keranjang Belanja | <span className="text-muted-foreground font-normal">50 item</span></SheetTitle>
          <SheetDescription>
            Lihat produk yang telah Anda pilih untuk dibeli. Untuk pembelian dilakukan melalui WhatsApp.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-y-auto rounded-md">
          <ul className="rounded-md flex flex-col gap-8">
            <li>
              <div className="rounded-md flex gap-2 items-start text-sm">
                <div className="w-[80px]">
                  <Avatar className="rounded-md aspect-square w-full h-full">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1601758003927-2f8b0c3d1c4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60" 
                      alt="Product Image"
                      className="object-cover object-center rounded-md"
                    />
                    <AvatarFallback className="rounded-md">U</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-muted-foreground">KIA</span>
                  <h4 className="text-base uppercase font-semibold">KIA Nama Produk</h4>
                  <div className="flex flex-wrap gap-2 text-muted-foreground">
                    <span>Ukuran: <span className="text-primary font-semibold">30x30cm</span></span>
                    <span>Pengaplikasian: <span className="text-primary font-semibold">Dinding</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="outline">Best Seller</Badge>
                    <Badge variant="outline">New Arrivals</Badge>
                    <Badge variant="destructive">70% off</Badge>
                  </div>

                  <div className="flex items-start justify-between mt-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">10pcs <span className="font-normal">/ box</span></span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon"><Minus/></Button>
                        <Button variant="secondary" size="icon">1</Button>
                        <Button variant="outline" size="icon"><Plus/></Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-base text-muted-foreground line-through">Rp5.000,00</span>
                      <span className="text-lg font-semibold">Rp25.000,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <SheetFooter>
          <Button><MessageCircle/>Pesan (Whatsapp)</Button>
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