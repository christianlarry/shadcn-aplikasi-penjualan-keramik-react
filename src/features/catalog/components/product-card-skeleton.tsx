import { Skeleton } from "@/components/ui/skeleton"

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-square w-full mb-6" />
      <div className="flex">
        <div className="w-3/4 flex flex-col gap-3 mr-8">
          <Skeleton className="h-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="w-1/6 aspect-square" />
      </div>
    </div>
  )
}

export default ProductCardSkeleton