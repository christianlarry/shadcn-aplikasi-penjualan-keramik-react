import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogPortal, DialogTitle} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/features/catalog/types/product"
import { Search } from "lucide-react"
import { useRef, useState } from "react"
import { useGetProducts } from "@/features/catalog/api/get-products"
import { Kbd } from "@/components/ui/kbd"
import SelectProductItem from "./select-product-item"
import { EmptyProduct } from "@/features/catalog/components/empty-product"
import { Skeleton } from "@/components/ui/skeleton"

interface Props{
  open?:boolean
  onOpenChange?: (open: boolean) => void,
  onSelect?: (product:Product) => void
}

const ChooseProductModal = ({
  open = false,
  onOpenChange,
  onSelect
}:Props) => {

  const inputRef = useRef<HTMLInputElement>(null)

  const [input, setInput] = useState<string>("")
  const [searchKeyword, setSearchKeyword] = useState<string|undefined>(undefined)

  const {data,error,isLoading} = useGetProducts({
    params: {
      search:searchKeyword,
      size: 10,
      options: {
        enabled: !!searchKeyword // Only run query if searchKeyword is defined
      }
    }
  })

  // HANDLER
  const handleSearchOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSearch = ()=>{
    if (input.trim() === "") {
      return inputRef.current?.focus()
    }

    setSearchKeyword(input.trim())
  }

  const handleSelectProduct = (product: Product) => {
    onSelect?.(product)
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent 
          className="p-4 py-0 gap-0 [&>button]:hidden"
        >
          <DialogHeader className="gap-0">
            <DialogTitle hidden/>
            <DialogDescription hidden/>

            <div className="w-full">
              <div className="flex items-center gap-3">
                <label htmlFor="search">
                  <Search size={16}/> 
                </label>
                <input
                  id="search"
                  type="text" 
                  className="p-0 border-none shadow-none outline-none w-full py-3" 
                  placeholder="Cari Produk, Deskripsi, Warna, Dll"
                  ref={inputRef}
                  onKeyDown={handleSearchOnKeyDown}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  />
                  
                <Button onClick={handleSearch} size={"sm"} variant={"outline"} className="cursor-pointer">Cari <Kbd>⏎</Kbd></Button>
              </div>
            </div>
          </DialogHeader>
          
          {(data && data.data.length > 0) &&
            <div className="mb-4">
              <Separator className="mb-2"/>
              <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto rounded-md">
                {data.data.map((product,idx) => (
                  <SelectProductItem 
                    product={product}
                    onSelect={handleSelectProduct}
                    key={idx}
                  />
                ))}
              </ul>
            </div>
          }
          
          {(data && data.data.length === 0) &&
            <div className="mb-4">
              <EmptyProduct
                title={`Produk tidak ditemukan!`}
                description={`Produk dengan kata kunci "${searchKeyword}" tidak ditemukan. Silakan coba kata kunci lain.`}
                hideReloadButton
              />
            </div>
          }

          {error &&
            <div className="mb-4">
              <EmptyProduct/>
            </div>
          }

          {isLoading &&
            <div className="mb-4 flex flex-col gap-2">
              {Array.from({length:4}).map((_,idx)=>(
                <div className="flex gap-3" key={idx}>
                  <Skeleton className="size-18 sm:size-24 aspect-square"/>
                  <div className="flex flex-col w-full flex-1">
                    <Skeleton className="h-3 w-1/4 mb-2"/>
                    <Skeleton className="h-4 w-3/4 mb-2"/>
                    <Skeleton className="h-3 w-1/3 mb-2"/>
                  </div>
                </div>
              ))}
            </div>
          }
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default ChooseProductModal