import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PENGAPLIKASIAN_SELECT_ITEMS, SIZE_SELECT_ITEMS } from "@/constants/home"
import { useSearchParams } from "@/hooks/use-search-params"
import { Search } from "lucide-react"
import { useRef, useState } from "react"

interface SearchBarInput{
  searchKeyword:string,
  application:string,
  size:string
}

const SearchBar = () => {

  const {setSearchParams,navigateWithParams} = useSearchParams()

  // STATE
  const [input,setInput] = useState<SearchBarInput>({
    searchKeyword: "",
    application: "",
    size: ""
  })

  // REF
  const inputKeywordRef = useRef<HTMLInputElement>(null)

  // HANDLER

  const handleSearch = ()=>{
    const isAllInputDone = Object.entries(input).some((val)=>{
      return val[1] !== ""
    })

    if(!isAllInputDone) {
      return inputKeywordRef.current?.focus()
    }

    let searchParams:URLSearchParams = new URLSearchParams()

    if(input.searchKeyword.length > 0){
      searchParams = setSearchParams("search",input.searchKeyword,{navigate:false})
    }
    if(input.application.length > 0){
      searchParams = setSearchParams("application",input.application,{navigate:false,defaultSearchParams:searchParams})
    }
    if(input.size.length > 0){
      searchParams = setSearchParams("size",input.size,{navigate:false,defaultSearchParams:searchParams})
    }

    navigateWithParams("/catalog/all-products",searchParams)
  }

  const handleOnKeydown = (e:React.KeyboardEvent<HTMLDivElement>)=>{
    if (e.key === "Enter") {
      e.preventDefault()

      handleSearch()
    }
  }

  return (
    <div 
      className="bg-white rounded-md p-6 py-3 flex justify-between items-center"
      onKeyDown={handleOnKeydown}
    >
      <div className="flex-1 text-start">
        <div className="grid grid-cols-3">
          <div className="flex">
            <div className="flex flex-col gap-1 max-w-[140px] relative">
              <Label htmlFor="searchKeywordInput">Keyword</Label>
              <input 
                ref={inputKeywordRef}
                id="searchKeywordInput"
                type="text"
                className="p-0 border-none shadow-none outline-none h-[20px] text-sm placeholder-muted-foreground pe-5"
                placeholder="Keyword Pencarian"
                value={input.searchKeyword}
                onChange={(e)=>setInput(prev=>({...prev,searchKeyword: e.target.value}))}
              />
              <Search className="size-3 text-muted-foreground absolute right-0 bottom-1"/>
            </div>
            <div className="self-stretch">
              <Separator orientation="vertical" className="mx-4"/>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col gap-1 max-w-[140px]">
              <Label htmlFor="searchApplicationInput">Pengaplikasian</Label>
              <Select
                onValueChange={(value)=>setInput(prev=>({...prev,application:value}))}
                value={input.application}
              >
                <SelectTrigger id="searchApplicationInput" className="w-[140px] p-0 !h-[20px] border-none shadow-none">
                  <SelectValue placeholder="Dinding/Lantai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PENGAPLIKASIAN_SELECT_ITEMS.map((item,idx)=>(
                      <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="self-stretch">
              <Separator orientation="vertical" className="mx-4"/>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-1 max-w-[140px]">
              <Label htmlFor="searchRuanganInput">Ukuran</Label>
              <Select
                value={input.size}
                onValueChange={(val)=>setInput(prev=>({...prev,size: val}))}
              >
                <SelectTrigger id="searchRuanganInput" className="w-[140px] p-0 !h-[20px] border-none shadow-none">
                  <SelectValue placeholder="Ukuran ubin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {SIZE_SELECT_ITEMS.map((item,idx)=>(
                      <SelectItem key={idx} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Button onClick={handleSearch}>
        <Search />Search
      </Button>
    </div>
  )
}

export default SearchBar