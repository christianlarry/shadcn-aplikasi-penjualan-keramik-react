import { cn } from "@/utils/ui"

const Container = ({
  children,
  className,
  ...props
}:React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn(className,"max-w-7xl mx-auto px-4")}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container