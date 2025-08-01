import { Link } from "react-router"
import Container from "../container/container"
import Logo from "../logo/logo"
import { Separator } from "@/components/ui/separator"

const Footer = (props:React.HTMLAttributes<HTMLElement>) => {
  return (
    <footer {...props}>
      <div className="bg-muted py-12 pb-8">
        <Container className="flex flex-col gap-4">
          <section className="grid lg:grid-cols-3 gap-16">
            <div className="flex flex-col gap-2">
              <div className="w-[250px]">
                <Logo/>
              </div>
              <p className="text-justify text-muted-foreground">
                Berbagai pilihan ubin keramik berkualitas tinggi untuk mempercantik rumah dan bangunan Anda. CV Aneka Keramik siap memenuhi kebutuhan interior dan eksterior Anda.
              </p>
            </div>

            <div className="lg:col-span-2 flex">
              <div className="self-stretch lg:me-12">
                <Separator orientation="vertical" className="bg-muted-foreground/20 hidden lg:block"/>
              </div>

              <div className="flex flex-wrap lg:flex-nowrap gap-16 text-nowrap lg:justify-end">
                <div>
                  <h3 className="font-semibold mb-3">KATALOG</h3>
                  <ul className="flex flex-col gap-1 text-muted-foreground">
                    <li>
                      <FooterLink to="/catalog/all-products">Semua Produk</FooterLink>
                    </li>
                    <li>
                      <FooterLink to="/catalog/best-seller">Best Seller</FooterLink>
                    </li>
                    <li>
                      <FooterLink to="/catalog/new-arrivals">New Arrivals</FooterLink>
                    </li>
                    <li>
                      <FooterLink to="/catalog/discount">Diskon</FooterLink>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">TOOLS</h3>
                  <ul className="flex flex-col gap-1 text-muted-foreground">
                    <li>
                      <FooterLink to="/tile-calculator">Kalkulator Ubin</FooterLink>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">KONTAK</h3>
                  <ul className="flex flex-col gap-1 text-muted-foreground">
                    <li>
                      Call Center : 0000-0000-0000
                    </li>
                    <li>
                      Email : xxxx@xxxx.com
                    </li>
                    <li className="text-wrap">
                      Lokasi : Jl. Wolter Monginsidi No.14C, Bahu, Kec. Malalayang, Kota Manado, Sulawesi Utara
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <Separator className="bg-muted-foreground/20 my-8"/>
            
            <p className="text-center text-muted-foreground font-semibold">© 2025 Christian Larry Jo Rondonuwu. All Rights Reserved</p>
          </section>
        </Container>
      </div>
    </footer>
  )
}

const FooterLink = ({to,children}:{to:string,children?:React.ReactNode})=>{
  return (
    <Link to={to} className="hover:underline">
      {children}
    </Link>
  )
}

export default Footer