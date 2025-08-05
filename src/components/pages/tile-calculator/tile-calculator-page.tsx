import Container from "@/components/common/container/container"
import Footer from "@/components/common/footer/footer"
import Header from "@/components/common/header/header"

const TileCalculatorPage = () => {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="flex-1">
        <Header/>
        <main className="mt-4">
          <Container>
              
            <h2>Tile Calculator page</h2>

          </Container>
        </main>
      </div>
      <Footer className="mt-20"/>
    </div>
  )
}

export default TileCalculatorPage