import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/features/catalog/types/product"
import { capitalize } from "@/utils/string-fn"
import { getProductImgUrl } from "@/utils/url"

interface SelectProductItemProps {
  product: Product
  onSelect: (product: Product) => void
}

const SelectProductItem = ({
  product,
  onSelect
}: SelectProductItemProps) => {

  

  return (
    <li
      className="flex items-center gap-3 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md"
      onClick={() => onSelect(product)}
    >
      <Avatar className="rounded-md size-18 sm:size-24 aspect-square">
        <AvatarImage
          src={getProductImgUrl(product.image ?? "")}
          className="object-cover object-center"
        />
        <AvatarFallback className="rounded-md">{capitalize(product.name[0])}</AvatarFallback>
      </Avatar>

      <div>
        <div className="flex gap-1 items-center">
          <span className="text-muted-foreground text-sm">{product.brand}</span>
          <div className="self-stretch">
            <Separator orientation="vertical"/>
          </div>
          <h4 className="font-semibold">{product.name}</h4>
        </div>
        <span className="text-sm text-muted-foreground">Ukuran: <span className="text-primary">{product.specification.size.width}x{product.specification.size.height}cm</span></span>
      </div>
    </li>
  )
}

export default SelectProductItem