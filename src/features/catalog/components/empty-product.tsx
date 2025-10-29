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

interface EmptyProductProps {
  title?: string
  description?: string
  onReload?: () => void
}

export function EmptyProduct({
  title = "Gagal mendapatkan Produk!",
  description = "Terjadi kesalahan saat memuat produk. Silakan coba lagi nanti.",
  onReload = () => {
    window.location.reload()
  },
}:EmptyProductProps) {
  return (
    <Empty className="border border-border">
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <CircleX/>
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div>
          <Button onClick={()=>onReload()}>Muat Ulang</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
