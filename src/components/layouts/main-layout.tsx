import { Outlet } from "react-router"
import Header from "../common/header/header"
import Container from "../common/container/container"

interface Props{
  children?:React.ReactNode
}

const MainLayout = ({
  children
}:Props) => {
  return (
    <div>
      <Header/>
      <main className="mt-4">
        <Container>
          {children || <Outlet/>}
        </Container>
      </main>
    </div>
  )
}

export default MainLayout