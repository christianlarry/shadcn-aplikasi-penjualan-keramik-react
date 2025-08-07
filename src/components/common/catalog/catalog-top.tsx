
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FILTER_OPTIONS_CONFIG, SORT_PRODUCT_OPTIONS } from "@/constants/catalog"
import { useCatalog } from "@/contexts/catalog-context"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router"
import SearchInput from "../input/search-input"
import { useSearchParams } from "@/hooks/use-search-params"

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
            <div className="flex items-center gap-2">
              <Select onValueChange={(val)=>setSortInSearchParams(val)} value={sort ?? ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_PRODUCT_OPTIONS.map(opt=>(
                    <SelectItem value={opt.value} key={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {sort &&
                <Button size="icon" variant="outline" onClick={()=>setSortInSearchParams(null)}><X/></Button>
              }
            </div>
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