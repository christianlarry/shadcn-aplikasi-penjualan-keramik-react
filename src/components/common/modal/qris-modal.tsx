import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import { Barcode } from "lucide-react"

// CONSTANTS QRIS URL
const QRIS_IMAGE_URL = "https://cdn.rri.co.id/berita/Bogor/o/1728876328121-qr_code/2p50py7051uxv4j.jpeg"

const QrisModal = () => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Barcode/>Lihat QRIS</Button>
      </DialogTrigger>
    
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kode QRIS</DialogTitle>
          <DialogDescription>Scan kode QR dibawah untuk melakukan pembayaran. Pastikan anda sudah melakukan pemesanan.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col">
          <div className="w-full aspect-square bg-muted-foreground">
            <img 
              src={QRIS_IMAGE_URL}
              alt="Kode QRIS"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default QrisModal