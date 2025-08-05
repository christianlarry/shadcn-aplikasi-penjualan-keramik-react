import { useProductFiltersQuery } from '@/hooks/use-product-filters-query'
import SidebarSelectInput, { type Options } from './sidebar-select-input'
import { useState } from 'react'
import type { ProductFilterOptions } from '@/types/product'

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

  return (
    <div className="flex flex-col gap-2">
      {data && FILTER_OPTIONS_CONFIG.map((cfg,idx)=>(
        <SidebarSelectInput
          key={idx}
          headLabel={cfg.label}
          options={(data.data as Array<ProductFilterOptions>).filter((opt=>opt.type===cfg.key))[0].options}
          value={filters[cfg.key]}
          onChange={(val) => setFilters({...filters,[cfg.key]:val})}
        />
      ))}
    </div>
  )
}

export default CatalogSidebarFilter