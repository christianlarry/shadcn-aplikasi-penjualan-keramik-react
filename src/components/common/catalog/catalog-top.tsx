
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

const CatalogTop = () => {

  

  return (
    <section id="catalog-top">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center">
          <p className="text-sm">Menampilkan <span className="font-semibold">9</span> produk dari total <span className="font-semibold">105</span></p>
          <div className="flex items-center gap-2">
            <span className="text-sm">Urutkan Berdasarkan</span>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  Harga | Besar ke Kecil
                </SelectItem>
                <SelectItem value="dark">
                  Harga | Kecil ke Besar
                </SelectItem>
                <SelectItem value="system">
                  Nama | A ke Z
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm">Applied Filter :</span>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="font-normal">
              Dinding <X />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CatalogTop