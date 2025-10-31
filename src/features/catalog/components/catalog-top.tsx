
import { Button } from "@/components/ui/button"
import { FILTER_OPTIONS_CONFIG } from "@/features/catalog/constants/catalog"
import { useCatalog } from "@/features/catalog/contexts/catalog-context"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import { useSearchParams } from "@/hooks/use-search-params"
import SearchInput from "@/components/common/input/search-input"
import { SortPopover } from "./sort-popover"

interface Props{
  config:{
    totalData:number,
    showedData:number
  }
}

const CatalogTop = ({
  config
}:Props) => {

  const [filters,setFilters] = useState<{key:string,value:string}[]>([])
  const {sort,setSort,setSearch} = useCatalog()

  const [searchInput,setSearchInput] = useState<string>("")

  const location = useLocation()

  const {
    setSearchParams,
    deleteSearchParams,
    searchParamsHas,
    getAllSearchParams,
    getSearchParams
  } = useSearchParams()

  useEffect(()=>{
    const newFilter:{key:string,value:string}[] = []
    
    FILTER_OPTIONS_CONFIG.forEach(({key})=>{
      if(searchParamsHas(key)){
        const filterParams = getAllSearchParams(key)

        filterParams.forEach(paramVal=>{
          newFilter.push({key,value:paramVal})
        })
      }
    })

    setFilters(newFilter)
    
    if(searchParamsHas("sort_by")){
      setSort(getSearchParams("sort_by") ?? null)
    }else{
      setSort(null)
    }

    if(searchParamsHas("search")){
      setSearch(getSearchParams("search") ?? "")
      setSearchInput(getSearchParams("search") ?? "")
    }else{
      setSearch("")
    }

  },[location,setSort,setSearch,searchParamsHas,getAllSearchParams,getSearchParams])

  const removeFilter = (rmvFltr:{key:string,value:string})=>{

    if(searchParamsHas(rmvFltr.key)){
      deleteSearchParams(rmvFltr.key,rmvFltr.value)
    }

  }

  const setSortInSearchParams = (sortValue:string|null)=>{
    if(sortValue){
      setSearchParams("sort_by",sortValue)
    }else{
      deleteSearchParams("sort_by")
    }
  }

  const setSearchInSearchParams = (keyword:string)=>{
    if(keyword.length > 0){
      setSearchParams("search",keyword)
    }else{
      deleteSearchParams("search")
    }
  }

  return (
    <section id="catalog-top">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center">
          <p className="text-sm">Menampilkan <span className="font-semibold">{config.showedData}</span> produk dari total <span className="font-semibold">{config.totalData}</span></p>
          <div className="flex gap-2">
            <SearchInput
              onSearch={(keyword)=>setSearchInSearchParams(keyword)}
              value={searchInput}
              onChange={(val)=>setSearchInput(val)}
              placeholder="Cari: Nama | Deskripsi | dll"
            />
            <SortPopover
              value={sort}
              onValueChange={(val)=>setSortInSearchParams(val)}
            />
          </div>
        </div>
        {filters.length > 0 &&
          <div className="flex gap-2 items-center">
            <span className="text-sm">Applied Filter :</span>
            <div className="flex flex-wrap gap-2">
              {filters.map((fltr,idx)=>(
                <Button 
                  variant="outline" 
                  className="font-normal" 
                  key={idx}
                  onClick={()=>removeFilter(fltr)}
                >
                  {fltr.value} <X />
                </Button>
              ))}
            </div>
          </div>
        }
      </div>
    </section>
  )
}

export default CatalogTop