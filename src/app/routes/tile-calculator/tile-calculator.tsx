import TileCalculatorCanvas from "@/features/tile-calculator/components/tile-calculator-canvas"
import Container from "@/components/common/container/container"
import Footer from "@/components/common/footer/footer"
import Header from "@/components/common/header/header"
import TileCanvasInput from "@/features/tile-calculator/components/tile-canvas-input"
import type { Product } from "@/features/catalog/types/product"
import { useState } from "react"
import { Head } from "@/components/seo/head"

const TileCalculatorPage = () => {

  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null)

  const handleSelectProduct = (product:Product|null) => {
    setSelectedProduct(product)
  }

  return (
    <>
      <Head
        title="Kalkulator Ubin"
        description="Hitung kebutuhan ubin dalam ruangan dengan fitur kanvas sketsa tata letak ruangan!"
      />

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
    </>
  )
}

export default TileCalculatorPage