interface SelectItems{
  label:string,
  value:string
}

export const PENGAPLIKASIAN_SELECT_ITEMS:SelectItems[] = [
  {
    label: "Lantai",
    value: "Lantai"
  },
  {
    label: "Dinding",
    value: "Dinding"
  }
]

export const RUANGAN_SELECT_ITEMS: SelectItems[] = [
  { label: "Dapur", value: "dapur" },
  { label: "Kamar Mandi", value: "kamarMandi" },
  { label: "Kamar Tidur", value: "kamarTidur" },
  { label: "Ruang Tamu", value: "ruangTamu" },
  { label: "Ruang Keluarga", value: "ruangKeluarga" },
  { label: "Luar Ruangan", value: "luarRuangan" },
]

export const SIZE_SELECT_ITEMS: SelectItems[] = [
  { label: "20 x 20 cm", value: "20x20" },
  { label: "25 x 25 cm", value: "25x25" },
  { label: "30 x 30 cm", value: "30x30" },
  { label: "40 x 40 cm", value: "40x40" },
  { label: "45 x 45 cm", value: "45x45" },
  { label: "50 x 50 cm", value: "50x50" },
  { label: "60 x 60 cm", value: "60x60" },
  { label: "80 x 80 cm", value: "80x80" },
  { label: "100 x 100 cm", value: "100x100" },
  { label: "120 x 60 cm", value: "120x60" } // ukuran panjang populer untuk lantai besar
]