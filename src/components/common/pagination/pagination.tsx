import { Pagination as ShadcnPagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useLocation } from "react-router"

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

  const location = useLocation()

  const generatePageHref = (page:number)=>{
    const searchParams = new URLSearchParams(location.search)

    searchParams.set("page",page.toString())
    
    return [location.pathname,searchParams.toString()].join("?")
  }

  return (
    <ShadcnPagination>
      <PaginationContent>
        {current !== 1 &&
          <PaginationItem>
            <PaginationPrevious to={generatePageHref(current-1)}/>
          </PaginationItem>
        }

        {(totalPages > limit && current > midPage) &&
          <>
            <PaginationItem>
              <PaginationLink to={generatePageHref(1)}>1</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        }

        {totalPages <= limit && Array.from({ length: totalPages }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink to={generatePageHref(idx + 1)} isActive={idx + 1 === current}>{idx + 1}</PaginationLink>
          </PaginationItem>
        ))}

        {(totalPages > limit && current <= midPage) && Array.from({ length: limit }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink to={generatePageHref(idx + 1)} isActive={idx + 1 === current}>{idx + 1}</PaginationLink>
          </PaginationItem>
        ))} 

        {(totalPages > limit && current > midPage && current <= totalPages-midPage+1) && Array.from({ length: limit }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink to={generatePageHref((current-midPage+1)+idx)} isActive={(current-midPage+1)+idx === current}>{(current-midPage+1)+idx}</PaginationLink>
          </PaginationItem>
        ))}

        {(totalPages > limit && current > midPage && current > totalPages-midPage+1) && Array.from({ length: limit }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink to={generatePageHref(totalPages-limit+idx+1)} isActive={totalPages-limit+idx+1 === current}>{totalPages-limit+idx+1}</PaginationLink>
          </PaginationItem>
        ))}

        {(totalPages > limit && current < totalPages-midPage+1) &&
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink to={generatePageHref(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        }
        
        {current !== totalPages &&
          <PaginationItem>
            <PaginationNext to={generatePageHref(current+1)} />
          </PaginationItem>
        }
      </PaginationContent>
    </ShadcnPagination>
  )
}

export default Pagination