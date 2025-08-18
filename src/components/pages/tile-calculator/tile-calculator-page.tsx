import TileCalculatorCanvas from "@/components/common/canvas/tile-calculator-canvas"
import Container from "@/components/common/container/container"
import Footer from "@/components/common/footer/footer"
import Header from "@/components/common/header/header"
import TileCanvasInput from "@/components/common/input/tile-canvas-input"

const TileCalculatorPage = () => {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="flex-1">
        <Header/>
        <main className="mt-4">
          <Container className="flex flex-col gap-12">
            
            <section>
              <TileCanvasInput/>
            </section>

            <TileCalculatorCanvas
              tileHeight={50}
              tileWidth={50}
            />
          </Container>
        </main>
      </div>
      <Footer className="mt-20"/>
    </div>
  )
}

export default TileCalculatorPage