import { Pagination as ShadcnPagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

interface Props {
  totalPages: number
  limit: number
  current: number
}

const Pagination = ({
  totalPages,
  limit,
  current
}: Props) => {

  const midPage = Math.ceil(limit / 2)

  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>

        {(totalPages > limit && current > midPage) &&
          <>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        }

        {totalPages <= limit && Array.from({ length: limit }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink href="#" isActive={idx + 1 === current}>{idx + 1}</PaginationLink>
          </PaginationItem>
        ))}

        {(totalPages > limit && current <= midPage) && Array.from({ length: limit }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink href="#" isActive={idx + 1 === current}>{idx + 1}</PaginationLink>
          </PaginationItem>
        ))} 

        {(totalPages > limit && current > midPage && current <= totalPages-midPage+1) && Array.from({ length: limit }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink href="#" isActive={(current-midPage+1)+idx === current}>{(current-midPage+1)+idx}</PaginationLink>
          </PaginationItem>
        ))}

        {(totalPages > limit && current > midPage && current > totalPages-midPage+1) && Array.from({ length: limit }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink href="#" isActive={totalPages-limit+idx+1 === current}>{totalPages-limit+idx+1}</PaginationLink>
          </PaginationItem>
        ))}

        {(totalPages > limit && current < totalPages-midPage+1) &&
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#">{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        }
        

        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  )
}

export default Pagination