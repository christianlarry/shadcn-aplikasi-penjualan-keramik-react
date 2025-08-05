import { Outlet } from "react-router"
import Header from "../common/header/header"
import Container from "../common/container/container"
import Footer from "../common/footer/footer"
import TilecalculatorFeatureSection from "../common/sections/tilecalculator-feature-section"

interface Props{
  children?:React.ReactNode
}

const MainLayout = ({
  children
}:Props) => {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <div className="flex-1">
        <Header/>
        <main className="mt-4">
          <Container>
            {children || <Outlet/>}
          </Container>
        </main>
      </div>
      <TilecalculatorFeatureSection/>
      <Footer className="mt-20"/>
    </div>
  )
}

export default MainLayout