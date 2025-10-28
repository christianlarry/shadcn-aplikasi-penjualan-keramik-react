import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"
import { Link } from "react-router"

const NotFoundRoute = () => {
  return (
    <div className="fixed inset-0 bg-background z-50">
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <XCircle className="h-10 w-10 text-destructive" />
          <h1 className="text-2xl font-bold tracking-tight">
            Oops! Page Not Found:(
          </h1>
          <p className="text-sm text-muted-foreground">Halaman tidak ditemukkan!</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundRoute