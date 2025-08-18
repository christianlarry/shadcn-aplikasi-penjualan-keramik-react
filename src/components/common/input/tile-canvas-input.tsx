import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import ChooseProductModal from "../modal/choose-product-modal"
import { useState } from "react"

const TileCanvasInput = () => {

  const [openChooseProductModal, setOpenChooseProductModal] = useState(false)

  return (
    <>
      <div className="border-1 border-border rounded-md" onClick={() => setOpenChooseProductModal(true)}>
        <div className="flex flex-wrap items-center text-center justify-center px-4 py-6 cursor-pointer">
          <p className="flex flex-wrap gap-2 items-center">
            <Info className="size-4" /> Pilih ubin terlebih dahulu!
          </p>
          <Button variant={"link"}>Click untuk pilih ubin</Button>
        </div>
      </div>

      <ChooseProductModal open={openChooseProductModal} onOpenChange={setOpenChooseProductModal}/>
    </>
  )
}

export default TileCanvasInput