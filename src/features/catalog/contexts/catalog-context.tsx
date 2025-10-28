import type { Options } from "@/features/catalog/components/catalog-sidebar-collapsible";
import { createContext, useContext, useState } from "react";

interface CatalogContextType{
  filters:Record<string,Options[]|null>
  setFilters:React.Dispatch<React.SetStateAction<Record<string,Options[]|null>>>
  sort:string|null
  setSort:React.Dispatch<React.SetStateAction<string|null>>
  search:string,
  setSearch:React.Dispatch<React.SetStateAction<string>>
}

const CatalogContext = createContext<CatalogContextType|undefined>(undefined)

export const CatalogProvider = ({children}:{children:React.ReactNode})=>{

  const [filters,setFilters] = useState<Record<string,Options[]|null>>({
    design: null,
    application: null,
    texture: null,
    finishing: null,
    color: null,
    size: null
  })
  const [sort,setSort] = useState<string|null>(null)
  const [search,setSearch] = useState<string>("")

  const providerValue:CatalogContextType = {
    filters,
    setFilters,
    setSort,
    sort,
    search,
    setSearch
  }

  return (
    <CatalogContext.Provider value={providerValue}>
      {children}
    </CatalogContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCatalog = ()=>{
  const context = useContext(CatalogContext)
  if(!context) throw new Error('useCatalog must be used within an CatalogProvider')

  return context
}