import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import ChooseProductModal from "../modal/choose-product-modal"
import { useEffect, useState } from "react"
import type { Product } from "@/types/product"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { capitalize } from "@/lib/string-formatter"
import { formatCurrency, getProductImgUrl } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useSearchParams } from "@/hooks/use-search-params"
import { useSingleProductQuery } from "@/hooks/use-product-query"

const TileCanvasInput = () => {

  const [openChooseProductModal, setOpenChooseProductModal] = useState(false)

  const [selectedProduct,setSelectedProduct] = useState<Product|null>(null)

  // Params Hook
  const {setSearchParams,getSearchParams} = useSearchParams()

  const handleSelectProduct = (product: Product) => {
    setSearchParams("product",product._id ?? "")
  }

  const productId = getSearchParams("product")
  const {data} = useSingleProductQuery(productId ?? undefined)

  useEffect(() => {
    if (data) {
      setSelectedProduct(data.data)
    }
  }, [data])

  return (
    <>
      {selectedProduct ? 
        <div className="border-1 border-border rounded-md">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 px-4 py-6 items-start sm:items-center">
            <div className="min-w-[100px] sm:max-w-[250px] aspect-square w-full">
              <Avatar className="w-full h-full rounded-md">
                <AvatarImage
                  src={getProductImgUrl(selectedProduct.image ?? "")}
                  className="object-cover object-center"
                />
                <AvatarFallback className="rounded-md">{capitalize(selectedProduct.name[0])}</AvatarFallback>
              </Avatar>
            </div>

            <div className="self-stretch hidden sm:block">
              <Separator orientation="vertical"/>
            </div>

            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
              <span className="text-sm text-muted-foreground">Rp{formatCurrency(selectedProduct.price)}</span>
            </div>

            <div className="self-stretch hidden sm:block">
              <Separator orientation="vertical"/>
            </div>

            <div>
              <h3 className="text-lg font-semibold"><span className="font-normal">Size : </span>{selectedProduct.specification.size.width}x{selectedProduct.specification.size.height}cm</h3>
            </div>

            <div className="self-stretch hidden sm:block">
              <Separator orientation="vertical"/>
            </div>

            <div>
              <Button variant={"outline"} onClick={()=>setOpenChooseProductModal(true)}>Ganti Ubin</Button>
            </div>
          </div>
        </div>
      :
        <div className="border-1 border-border rounded-md" onClick={() => setOpenChooseProductModal(true)}>
          <div className="flex flex-wrap items-center text-center justify-center px-4 py-6 cursor-pointer">
            <p className="flex flex-wrap gap-2 items-center">
              <Info className="size-4" /> Pilih ubin terlebih dahulu!
            </p>
            <Button variant={"link"}>Click untuk pilih ubin</Button>
          </div>
        </div>
      }

      <ChooseProductModal 
        open={openChooseProductModal} 
        onOpenChange={setOpenChooseProductModal} 
        onSelect={(product)=>handleSelectProduct(product)}
      />
    </>
  )
}

export default TileCanvasInput