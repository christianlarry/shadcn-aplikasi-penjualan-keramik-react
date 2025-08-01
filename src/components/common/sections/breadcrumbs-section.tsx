import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useLocation } from "react-router"

interface BreadcrumbItem{
  label:string,
  href?:string
}

const BREADCRUMBS_MAP:Record<string,BreadcrumbItem[]> = {
  "/catalog/all-products": [
    {label: "Home", href: "/"},
    {label: "Semua Produk"},
  ],
  "/catalog/best-seller": [
    {label: "Home", href: "/"},
    {label: "Produk Terlaris"},
  ],
  "/catalog/new-arrivals": [
    {label: "Home", href: "/"},
    {label: "Produk Terbaru"},
  ],
  "/catalog/discount": [
    {label: "Home", href: "/"},
    {label: "Sedang Diskon"},
  ],
}

const BreadcrumbsSection = () => {

  const location = useLocation()
  const breadcrumbItem:BreadcrumbItem[] = BREADCRUMBS_MAP[location.pathname] ?? []

  return (
    <section id="page-breadcrumbs" className="mt-4">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItem.map((item,idx)=>(
            <>
              <BreadcrumbItem key={idx}>
                {item.href && <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>}
                {!item.href && <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>}
              </BreadcrumbItem>

              {idx < breadcrumbItem.length-1 &&
                <BreadcrumbSeparator />
              }
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </section>
  )
}

export default BreadcrumbsSection