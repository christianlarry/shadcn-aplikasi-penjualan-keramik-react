import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogPortal, DialogTitle} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useProductQuery } from "@/hooks/use-product-query"
import { capitalize } from "@/lib/string-formatter"
import { getProductImgUrl } from "@/lib/utils"
import type { Product } from "@/types/product"
import { Search } from "lucide-react"
import { useRef, useState } from "react"

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

  const {data} = useProductQuery({
    search:searchKeyword,
    size: 10,
    options: {
      enabled: !!searchKeyword // Only run query if searchKeyword is defined
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
            <DialogTitle hidden>Pilih Produk</DialogTitle>
            <DialogDescription hidden>Pilih produk untuk dikalkulasi</DialogDescription>

            <div className="w-full">
              <div className="flex items-center gap-3">
                <label htmlFor="search">
                  <Search size={20}/> 
                </label>
                <input
                  id="search"
                  type="text" 
                  className="p-0 border-none shadow-none outline-none w-full py-3" 
                  placeholder="Cari produk..."
                  ref={inputRef}
                  onKeyDown={handleSearchOnKeyDown}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  />
                  
                <Button onClick={handleSearch}>Cari</Button>
              </div>
            </div>
          </DialogHeader>
          
          {(data && data.data.length > 0) &&
            <div className="mb-4">
              <Separator className="mb-2"/>
              <ul className="flex flex-col gap-2 max-h-[400px] overflow-y-auto rounded-md">
                {data.data.map((product,idx) => (
                  <li 
                    className="flex items-center gap-3 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md" 
                    key={idx} 
                    onClick={()=>handleSelectProduct(product)}
                  >
                    <Avatar className="rounded-md size-18 sm:size-24 aspect-square">
                      <AvatarImage 
                        src={getProductImgUrl(product.image ?? "")}
                        className="object-cover object-center"
                      />
                      <AvatarFallback className="rounded-md">{capitalize(product.name[0])}</AvatarFallback>
                    </Avatar>

                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <span className="text-sm text-muted-foreground">Size : {product.specification.size.width}x{product.specification.size.height}cm</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          }
          {(data && data.data.length === 0) &&
            <div className="text-center text-muted-foreground mb-4">
              <Separator className="mb-2"/>
              Produk "{searchKeyword}" yang dicari tidak ditemukan :(
            </div>
          }
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default ChooseProductModal