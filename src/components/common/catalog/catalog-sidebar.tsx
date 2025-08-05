import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronRight } from 'lucide-react'
import SidebarFilterInput, { type Options } from './sidebar-filter-input'
import { useEffect, useState } from 'react'

const CatalogSidebar = () => {

  const [filters,setFilters] = useState<Record<string, Options[] | null>>({
    design: null,
    application: null,
    texture: null,
    finishing: null,
    color: null,
    size: null
  })

  useEffect(()=>{
    console.log(filters)
  },[filters])

  return (
    <aside className="max-w-xs w-full">
      <div className="rounded-md border-1 border-border p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <SidebarFilterInput 
              headLabel='Pengaplikasian'
              options={[
                {label: "test1", value: "test1"},
                {label: "test2", value: "test3"},
                {label: "test3", value: "test2"}
              ]}
              value={filters["design"]}
              onChange={(val)=>setFilters({
                ...filters,
                "design": val
              })}
              />
          </li>

          <Separator />

          <li>
            <Button variant="ghost" className="font-normal text-base w-full text-start py-2 h-fit flex justify-between">
              Texture
              <ChevronRight />
            </Button>
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default CatalogSidebar