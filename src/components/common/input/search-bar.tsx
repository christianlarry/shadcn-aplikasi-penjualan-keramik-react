import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { PENGAPLIKASIAN_SELECT_ITEMS, RUANGAN_SELECT_ITEMS } from "@/constants/selectIInputtems"
import { Search } from "lucide-react"

const SearchBar = () => {

  const handleSearch = ()=>{
    
  }

  return (
    <div 
      className="bg-white rounded-md p-6 py-3 flex justify-between items-center"
    >
      <div className="flex-1 text-start">
        <div className="grid grid-cols-3">
          <div className="flex">
            <div className="flex flex-col gap-1 max-w-[140px] relative">
              <Label htmlFor="searchKeywordInput">Keyword</Label>
              <input 
                id="searchKeywordInput"
                type="text"
                className="p-0 border-none shadow-none outline-none h-[20px] text-sm placeholder-muted-foreground pe-5"
                placeholder="Keyword Pencarian"
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
              <Select>
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
              <Label htmlFor="searchRuanganInput">Ruangan</Label>
              <Select>
                <SelectTrigger id="searchRuanganInput" className="w-[140px] p-0 !h-[20px] border-none shadow-none">
                  <SelectValue placeholder="Tentukan Ruangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {RUANGAN_SELECT_ITEMS.map((item,idx)=>(
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