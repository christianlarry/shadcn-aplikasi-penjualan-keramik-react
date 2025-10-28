import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CircleX } from "lucide-react"
export function EmptyProduct() {
  return (
    <Empty className="border border-border">
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <CircleX/>
        </EmptyMedia>
        <EmptyTitle>Gagal mendapatkan Produk!</EmptyTitle>
        <EmptyDescription>
          Terjadi kesalahan saat memuat produk. Silakan coba lagi nanti.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div>
          <Button onClick={()=>{
            window.location.reload()
          }}>Muat Ulang</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
