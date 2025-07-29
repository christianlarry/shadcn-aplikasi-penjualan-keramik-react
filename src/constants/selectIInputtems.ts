interface SelectItems{
  label:string,
  value:string
}

export const PENGAPLIKASIAN_SELECT_ITEMS:SelectItems[] = [
  {
    label: "Lantai",
    value: "lantai"
  },
  {
    label: "Dinding",
    value: "dinding"
  },
  {
    label: "Lantai & Dinding",
    value: "lantaiDinding"
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