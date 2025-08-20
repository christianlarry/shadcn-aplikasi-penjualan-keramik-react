import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircle, Calculator } from "lucide-react";
import type { Product } from "@/types/product";
import { formatCurrency, getProductImgUrl } from "@/lib/utils";
import { Link } from "react-router";



interface Props{
  product:Product
}

import { INFORMASI_TOKO } from "@/constants/informasiToko";
import SaveProductButton from "../button/save-product-button";

export default function ProductDetail({ product }:Props) {
; // ganti nomor WA toko
  const waMessage = encodeURIComponent(
    `Halo, saya mau tanya stok untuk produk: ${product.name}`
  );

  return (
    <>
      {/* Title + Badge */}
      <section>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            {product.isBestSeller && (
              <Badge className="bg-yellow-500 text-black">Best Seller</Badge>
            )}
            {product.isNewArrivals && (
              <Badge className="bg-green-500">New Arrival</Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">{product.brand}</p>
        </div>

        <Separator className="my-6" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border bg-muted">
            {product.image &&
              <img
                src={getProductImgUrl(product.image ?? "") || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            }
            {!product.image &&
              <div className="w-full h-full flex items-center justify-center bg-muted select-none">
                <p>{product.name}</p>
              </div>
            }
          </div>

          {/* Right: Details */}
          <div className="flex flex-col">
            {/* Price */}
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                {product.discount && (
                  <span className="text-lg text-muted-foreground line-through">
                    Rp{formatCurrency(product.price)}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  Rp{formatCurrency(product.finalPrice)}
                </span>

                <span className="font-medium">
                  ({product.tilesPerBox}pcs / box)
                </span>
              </div>
              {product.discount && (
                <Badge variant="destructive" className="mt-2">
                  Diskon {product.discount}%
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-muted-foreground">{product.description}</p>

            {/* Specification Accordion */}
            <Accordion type="single" collapsible className="mt-4" defaultValue="specs">
              <AccordionItem value="specs">
                <AccordionTrigger>Spesifikasi</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong>Ukuran:</strong>{" "}
                      {product.specification.size.width} x{" "}
                      {product.specification.size.height} cm
                    </li>
                    <li>
                      <strong>Penggunaan:</strong>{" "}
                      {product.specification.application.join(", ")}
                    </li>
                    <li>
                      <strong>Desain:</strong> {product.specification.design}
                    </li>
                    <li>
                      <strong>Warna:</strong>{" "}
                      {product.specification.color.join(", ")}
                    </li>
                    <li>
                      <strong>Finishing:</strong>{" "}
                      {product.specification.finishing}
                    </li>
                    <li>
                      <strong>Tekstur:</strong> {product.specification.texture}
                    </li>
                    <li>
                      <strong>Tahan Air:</strong>{" "}
                      {product.specification.isWaterResistant ? "Ya" : "Tidak"}
                    </li>
                    <li>
                      <strong>Anti Selip:</strong>{" "}
                      {product.specification.isSlipResistant ? "Ya" : "Tidak"}
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* CTA Buttons */}
            <div className="mt-8 flex gap-4 flex-wrap">
              <SaveProductButton productId={product._id ?? ""}/>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
                onClick={() =>
                  window.open(`https://wa.me/${INFORMASI_TOKO.NO_WA}?text=${waMessage}`, "_blank")
                }
              >
                <MessageCircle size={20} /> Tanya Stok
              </Button>
              <Button className="flex items-center gap-2" size="lg" asChild>
                <Link to={`/tile-calculator?product=${product._id}`}>
                  <Calculator size={20} /> Hitung Kebutuhan
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </section>
      
      <section>
        {/* Recommended Products */}
        {product.recommended && product.recommended.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Dapat Digunakan di</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.recommended.map((rec, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 hover:shadow-lg transition"
                >
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}