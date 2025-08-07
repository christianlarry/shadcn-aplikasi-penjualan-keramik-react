import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Props{
  onSearch?:(keyword:string)=>void
  value:string,
  onChange?:(keyword:string)=>void
  placeholder?:string
}

const SearchInput = ({
  onSearch,
  value,
  onChange,
  placeholder
}:Props) => {


  const handleInputChange:React.ChangeEventHandler<HTMLInputElement> = (e)=>{
    onChange?.(e.currentTarget.value)

    if(e.currentTarget.value.length === 0){
      onSearch?.("")
    }
  }

  return (
    <div className="flex">
      <Input
        className="border-e-0 rounded-e-none focus-visible:z-10"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch?.(value)
          }
        }}
        value={value}
        onChange={handleInputChange}
      />
      <Button
        variant="outline"
        className="rounded-s-none"
        onClick={()=>onSearch?.(value)}
      >
        <Search />
      </Button>
    </div>
  )
}

export default SearchInput