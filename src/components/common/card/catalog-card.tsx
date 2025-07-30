import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router"

interface Props{
  label:string
  imgSrc:string
  href:string
}

const CatalogCard = ({
  imgSrc,
  label,
  href
}:Props) => {
  return (
    <div className="aspect-square bg-zinc-200 rounded-md overflow-hidden relative group/card">
      <div className="relative z-10 w-full h-full flex flex-col justify-end p-4 px-8 backdrop-brightness-80 group-hover/card:backdrop-brightness-95 transition duration-500">
        <Button className="flex justify-between" variant="secondary" asChild>
          <Link to={href}>
            {label} <ChevronRight />
          </Link>
        </Button>
      </div>
      <div className="absolute inset-0">
        <img
          src={imgSrc}
          alt="catalog-card-image"
          loading="lazy"
          className="w-full h-full object-center object-cover group-hover/card:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  )
}

export default CatalogCard