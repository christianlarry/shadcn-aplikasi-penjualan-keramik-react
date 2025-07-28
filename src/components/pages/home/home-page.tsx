import Container from "@/components/common/container/container"
import Logo from "@/components/common/logo/logo"
import Navbar from "@/components/common/navbar/navbar"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

const HomePage = () => {
  return (
    <>
      <header>
        <Container className="flex justify-between items-center py-4">
          <Link to={"/"}>
            <div className="w-[120px]">
              <Logo/>
            </div>
          </Link>

          <div className="flex gap-2">
            <Navbar/>
            <div className="flex gap-2">
              <Button variant="outline">Sign in</Button>
              <Button>Find Shop</Button>
            </div>
          </div>
        </Container>
      </header>
    </>
  )
}

export default HomePage