import { useProductFiltersQuery } from '@/hooks/use-product-filters-query'
import SidebarSelectInput, { type Options } from './sidebar-select-input'
import { Fragment, useEffect, useState } from 'react'
import type { ProductFilterOptions } from '@/types/product'
import { useLocation, useNavigate } from 'react-router'
import { Separator } from '@/components/ui/separator'

const FILTER_OPTIONS_CONFIG = [
  {
    label: "Pengaplikasian",
    key: "application",
  },
  {
    label: "Desain",
    key: "design",
  },
  {
    label: "Tekstur",
    key: "texture",
  },
  {
    label: "Sentuhan Akhir",
    key: "finishing",
  },
  {
    label: "Warna",
    key: "color",
  },
  {
    label: "Ukuran",
    key: "size",
  },
]

const CatalogSidebarFilter = () => {

  const navigate = useNavigate()
  const location = useLocation()

  // Filters State
  const [filters, setFilters] = useState<Record<string, Options[] | null>>({
    design: null,
    application: null,
    texture: null,
    finishing: null,
    color: null,
    size: null
  })

  // Get Options
  const {data} = useProductFiltersQuery()

  // Set Search Query for Filter Options
  const setFilterSearchParams = (key: string, filterOptions: Options[] | null) => {

    const searchParams = new URLSearchParams(location.search)

    searchParams.delete(key)

    if (filterOptions && filterOptions.length > 0) {
      filterOptions.forEach(val => {
        searchParams.append(key, val.value)
      })
    } else {
      searchParams.delete(key)
    }

    navigate([location.pathname, searchParams.toString()].join("?"))
  }

  useEffect(()=>{
    const searchParams = new URLSearchParams(location.search)

    FILTER_OPTIONS_CONFIG.forEach(({key}) => {
      if (searchParams.has(key)) {
        const filterParams = searchParams.getAll(key)

        setFilters(prev => {
          return {
            ...prev,
            [key]: filterParams.map(val => ({ label: val, value: val }))
          }
        })
      } else {
        setFilters(prev => {
          return {
            ...prev,
            [key]: null
          }
        })
      }
    })
  },[location])

  return (
    <div className="flex flex-col gap-2">
      {data && FILTER_OPTIONS_CONFIG.map((cfg,idx)=>(
        <Fragment key={idx}>
          <SidebarSelectInput
            headLabel={cfg.label}
            options={(data.data as Array<ProductFilterOptions>).filter((opt=>opt.type===cfg.key))[0].options}
            value={filters[cfg.key]}
            onChange={(val) => setFilterSearchParams(cfg.key, val)}
          />
          {idx < FILTER_OPTIONS_CONFIG.length-1 && <Separator/>}
        </Fragment>
      ))}
    </div>
  )
}

export default CatalogSidebarFilter