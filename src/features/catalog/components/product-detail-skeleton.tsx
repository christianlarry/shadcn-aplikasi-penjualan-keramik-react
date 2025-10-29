import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const ProductDetailSkeleton = () => {
  return (
    <>
      {/* Top Section: Title, Price, Image, Details */}
      <section>
        {/* Title and Brand */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-1/4" />
        </div>

        <Separator className="my-6" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <Skeleton className="relative w-full aspect-square rounded-xl" />

          {/* Right: Details */}
          <div className="flex flex-col gap-6">
            {/* Price */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Accordion */}
            <Skeleton className="h-14 w-full" />

            {/* CTA Buttons */}
            <div className="mt-4 flex gap-4 flex-wrap">
              <Skeleton className="h-12 w-12 rounded-md" />
              <Skeleton className="h-12 w-36 rounded-md" />
              <Skeleton className="h-12 w-44 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Recommended */}
      <section className="mt-12">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </section>
    </>
  );
};

export default ProductDetailSkeleton;