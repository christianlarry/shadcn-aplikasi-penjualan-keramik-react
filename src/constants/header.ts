import { Grid2X2, Percent, Sparkles, Star } from "lucide-react"
import type { IconType } from "react-icons"

export interface NavigationMenuItem {
  title: string,
  description: string,
  Icon: IconType,
  path: string
}

export const KATALOG_NAV_ITEMS: NavigationMenuItem[] = [
  {
    title: "Semua Produk",
    description: "Lihat seluruh koleksi ubin yang tersedia di toko kami.",
    path: "/catalog/all-products",
    Icon: Grid2X2
  },
  {
    title: "Ubin Terlaris",
    description: "Temukan ubin yang paling banyak dibeli pelanggan.",
    path: "/catalog/best-seller",
    Icon: Star
  },
  {
    title: "Produk Terbaru",
    description: "Cek ubin terbaru yang baru saja rilis di toko.",
    path: "/catalog/new-arrivals",
    Icon: Sparkles
  },
  {
    title: "Sedang Diskon",
    description: "Lihat ubin-ubin dengan harga promo spesial.",
    path: "/catalog/discount",
    Icon: Percent
  }
]