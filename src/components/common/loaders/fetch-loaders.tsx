import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

function FetchLoaders() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="secondary" disabled size="sm">
        <Spinner />
        Loading...
      </Button>
    </div>
  )
}

export default FetchLoaders