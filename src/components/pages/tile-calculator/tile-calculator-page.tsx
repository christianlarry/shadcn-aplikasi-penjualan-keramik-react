import TileCalculatorCanvas from "@/components/common/canvas/tile-calculator-canvas"
import Container from "@/components/common/container/container"
import Footer from "@/components/common/footer/footer"
import Header from "@/components/common/header/header"
import TileCanvasInput from "@/components/common/input/tile-canvas-input"
import type { Product } from "@/types/product"
import { useState } from "react"

const TileCalculatorPage = () => {

  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null)

  const handleSelectProduct = (product:Product|null) => {
    setSelectedProduct(product)
  }

  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="flex-1">
        <Header/>
        <main className="mt-4">
          <Container className="flex flex-col gap-12">
            
            <section>
              <TileCanvasInput onSelect={handleSelectProduct}/>
            </section>

            {selectedProduct &&
              <TileCalculatorCanvas
                tileHeight={selectedProduct.specification.size.height}
                tileWidth={selectedProduct.specification.size.width}
                tilePrice={selectedProduct.finalPrice}
                tilesPerBox={selectedProduct.tilesPerBox}
              />
            }
          </Container>
        </main>
      </div>
      <Footer className="mt-20"/>
    </div>
  )
}

export default TileCalculatorPage