import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/features/order/store/use-cart-store"
import { Trash } from "lucide-react"


const ConfirmationResetCartDialog = () => {

  const clearCart = useCartStore((state) => state.clearCart)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="cursor-pointer"><Trash/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anda yakin kosongkan keranjang?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan menghapus semua item dalam keranjang belanja Anda. Apakah Anda yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button variant={"destructive"} onClick={()=>clearCart()} asChild>
            <AlertDialogAction>Kosongkan</AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmationResetCartDialog