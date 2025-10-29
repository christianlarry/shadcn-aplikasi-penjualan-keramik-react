import SidebarSelectInput, { type Options } from './catalog-sidebar-collapsible'
import { Fragment, useEffect } from 'react'
import type { ProductFilterOptions } from '@/features/catalog/types/product'
import { useLocation } from 'react-router'
import { Separator } from '@/components/ui/separator'
import { FILTER_OPTIONS_CONFIG } from '@/features/catalog/constants/catalog'
import { useCatalog } from '@/features/catalog/contexts/catalog-context'
import { useSearchParams } from '@/hooks/use-search-params'
import { useGetProductFilterOptions } from '../api/get-product-filter-options'
import FetchLoaders from '@/components/common/loaders/fetch-loaders'

const CatalogSidebarFilter = () => {

  const location = useLocation()
  const {setSearchParams,deleteSearchParams,searchParamsHas,getAllSearchParams} = useSearchParams()

  // Filters State
  const {filters,setFilters} = useCatalog()

  // Get Options
  const {data,isLoading} = useGetProductFilterOptions()

  // Set Search Query for Filter Options
  const setFilterSearchParams = (key: string, filterOptions: Options[] | null) => {

    if (filterOptions && filterOptions.length > 0) {
      setSearchParams(
        key,
        filterOptions.map(val=>val.value)
      )
    }else{
      deleteSearchParams(key)
    }
  }

  useEffect(()=>{
    const nextFilter:Record<string,Options[]|null> = {}

    FILTER_OPTIONS_CONFIG.forEach(({key}) => {
      if (searchParamsHas(key)) {
        const filterParams = getAllSearchParams(key)
        nextFilter[key] = filterParams.map(val => ({ label: val, value: val }))
      
      } else {
        nextFilter[key] = null
      }
    })

    setFilters(nextFilter)

  },[location,setFilters,searchParamsHas,getAllSearchParams])

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

      {data && data.data.length < 1 &&
        <div className="text-sm text-muted-foreground">Tidak ada opsi filter yang tersedia. Coba lagi nanti</div>
      }

      {isLoading &&
        <FetchLoaders/>
      }
    </div>
  )
}

export default CatalogSidebarFilter