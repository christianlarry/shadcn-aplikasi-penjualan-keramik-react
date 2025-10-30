import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router"
import Container from "../container/container"

import tileCalculatorFeatureVideo from "@/assets/videos/tile-calculator-feature.webm"

const TileCalculatorFeatureSection = () => {
  return (
    <Container className="w-full mt-20">
      <section>
        <div className="w-full bg-primary flex rounded-md overflow-hidden flex-col lg:flex-row">
          <div className="w-full lg:w-[45%] relative">
            <div className="relative lg:absolute inset-0">
              <video
                src={tileCalculatorFeatureVideo}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                className="w-full h-full block object-cover object-center"
                onContextMenu={(e)=>e.preventDefault()}
              />
            </div>
          </div>
          <div className="flex-1 text-primary-foreground p-10 py-16">
            <div className="flex flex-col gap-8 items-start">
              <div>
                <span className="font-semibold text-muted underline">Fitur Utama</span>
                <h2 className="text-5xl font-bold mt-2">Bingung berapa ubin yang anda butuhkan?</h2>
                <p className="mt-2">Gunakan kalkulator otomatis kami buat hitung ubin hanya dalam hitungan detik.</p>
              </div>
              <Button variant="secondary" asChild>
                <Link to="/tile-calculator">
                  Coba Sekarang <ChevronRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Container>
  )
}

export default TileCalculatorFeatureSection