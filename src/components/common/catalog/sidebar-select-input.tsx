import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { ChevronRight } from "lucide-react"

export interface Options{
  label:string
  value:string
}

interface Props{
  headLabel:string
  options:Options[]
  value:Options[] | null
  onChange:(value:Options[])=>void
}

const SidebarSelectInput = ({
  headLabel,
  value,
  options,
  onChange
}:Props) => {

  const handleCheckboxChange = (checked:boolean,option:Options)=>{
    if(Array.isArray(value)){
      if(!checked){
        onChange(value.filter(val=>val.value !== option.value))
      }else{
        onChange([...value,option])
      }
    }else{
      onChange([option])
    }
  }

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="font-normal text-base w-full text-start py-2 h-fit flex justify-between group/collapsible">
          {headLabel}
          <ChevronRight
            className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="px-4 py-2 flex flex-col gap-1">
          {options.map((opt,idx)=>(
            <li key={idx}>
              <Button variant="ghost" className="font-normal text-base w-full text-start py-2 h-fit flex justify-start gap-3" asChild>
                <Label>
                  <Checkbox
                    checked={value ? value.some(val=>val.value === opt.value) : false}
                    value={opt.value} 
                    onCheckedChange={(checked)=>handleCheckboxChange((checked as boolean),opt)}
                  />
                  {opt.label}
                </Label>
              </Button>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default SidebarSelectInput