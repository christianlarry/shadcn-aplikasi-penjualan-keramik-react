
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FILTER_OPTIONS_CONFIG, SORT_PRODUCT_OPTIONS } from "@/constants/catalog"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"

const CatalogTop = () => {

  const [filters,setFilters] = useState<{key:string,value:string}[]>([])
  const [sort,setSort] = useState<string|undefined>(undefined)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{

    const searchParams = new URLSearchParams(location.search)

    const newFilter:{key:string,value:string}[] = []
    
    FILTER_OPTIONS_CONFIG.forEach(({key})=>{
      if(searchParams.has(key)){
        const filterParams = searchParams.getAll(key)

        filterParams.forEach(paramVal=>{
          newFilter.push({key,value:paramVal})
        })
      }
    })

    setFilters(newFilter)
    
    if(searchParams.has("sort_by")){
      setSort(searchParams.get("sort_by") ?? undefined)
    }else{
      setSort(undefined)
    }

  },[location])

  const removeFilter = (rmvFltr:{key:string,value:string})=>{
    const searchParams = new URLSearchParams(location.search)
    
    if(searchParams.has(rmvFltr.key)){
      searchParams.delete(rmvFltr.key,rmvFltr.value)
    }
    
    navigate([location.pathname,searchParams.toString()].join("?"))
  }

  const setSortInSearchParams = (sortValue:string|null)=>{
    const searchParams = new URLSearchParams(location.search)

    if(sortValue){
      searchParams.set("sort_by",sortValue)
    }else{
      searchParams.delete("sort_by")
    }


    navigate([location.pathname,searchParams.toString()].join("?"))
  }

  return (
    <section id="catalog-top">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center">
          <p className="text-sm">Menampilkan <span className="font-semibold">9</span> produk dari total <span className="font-semibold">105</span></p>
          <div className="flex items-center gap-2">
            <span className="text-sm">Urutkan Berdasarkan</span>
            <Select onValueChange={(val)=>setSortInSearchParams(val)} value={sort ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih" />
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