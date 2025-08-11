import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router"
import { Fragment } from "react/jsx-runtime"

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
  "catalog/product/:id": [
    {label: "Home", href: "/"},
    {label: "Sedang Diskon"},
  ]
}

const BreadcrumbsSection = () => {

  const [customBreadcrumb,setCustomBreadcrumb] = useState<BreadcrumbItem[] | undefined>(undefined) 

  const location = useLocation()
  const params = useParams()
  const breadcrumbItem:BreadcrumbItem[] = BREADCRUMBS_MAP[location.pathname] ?? []

  useEffect(()=>{
    if(params.id){
      setCustomBreadcrumb([
        {label: "Home", href: "/"},
        {label: "Catalog", href: "/catalog/all-products"},
        {label: `Product | ${params.id}`}
      ])
    }
  },[location,params])

  return (
    <section id="page-breadcrumbs" className="mt-4">
      <Breadcrumb>
        <BreadcrumbList>
          {customBreadcrumb && customBreadcrumb.map((item,idx)=>(
            <Fragment key={idx}>
              <BreadcrumbItem>
                {item.href && <BreadcrumbLink asChild><Link to={item.href}>{item.label}</Link></BreadcrumbLink>}
                {!item.href && <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>}
              </BreadcrumbItem>

              {idx < customBreadcrumb.length-1 &&
                <BreadcrumbSeparator />
              }
            </Fragment>
          ))}

          {!customBreadcrumb && breadcrumbItem.map((item,idx)=>(
            <Fragment key={idx}>
              <BreadcrumbItem>
                {item.href && <BreadcrumbLink asChild><Link to={item.href}>{item.label}</Link></BreadcrumbLink>}
                {!item.href && <BreadcrumbPage className="font-semibold">{item.label}</BreadcrumbPage>}
              </BreadcrumbItem>

              {idx < breadcrumbItem.length-1 &&
                <BreadcrumbSeparator />
              }
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </section>
  )
}

export default BreadcrumbsSection