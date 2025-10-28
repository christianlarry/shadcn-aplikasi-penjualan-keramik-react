import { Link } from "react-router"
import Container from "../container/container"
import Logo from "../logo/logo"
import Navbar from "../navbar/navbar"
import { Button } from "@/components/ui/button"
import { Map, User } from "lucide-react"
import CartSheet from "../../../features/order/components/cart-sheet"
import { INFORMASI_TOKO } from "@/constants/informasi-toko"

const DASHBOARD_BASE_URL = import.meta.env.VITE_DASHBOARD_BASE_URL || "/"

const Header = () => {
  return (
    <header className="relative z-50">
      <Container className="flex justify-between items-center py-6">
        <Link to={"/"}>
          <div className="w-[260px]">
            <Logo />
          </div>
        </Link>

        <div className="flex gap-2">

          <Navbar />

          <div className="flex gap-2">
            <CartSheet/>
            <Button variant="outline" asChild>
              <Link to={DASHBOARD_BASE_URL}>
                <User /> Sign In
              </Link>
            </Button>
            <Button asChild>
              <a href={INFORMASI_TOKO.MAP_LOCATION_URL} target="_blank">
                <Map /> Find Shop
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header