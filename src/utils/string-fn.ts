export const capitalize = (str:string)=>{
  return str[0].toUpperCase()+str.slice(1)
}

export function formatCurrency(value: number): string{
  return value.toLocaleString("id-ID", {
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) + ",00";
}