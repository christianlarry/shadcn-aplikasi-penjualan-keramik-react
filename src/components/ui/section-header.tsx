import { cn } from "@/utils/ui"

interface Props extends React.HTMLAttributes<HTMLDivElement>{
  title:string,
  description?:string
}

const SectionHeader = ({
  title,
  description,
  className,
  ...props
}:Props) => {
  return (
    <div className={cn("flex flex-col mb-8",className)} {...props}>
      <h2 className="text-3xl font-semibold ">{title}</h2>
      {description &&
      <p className="text-base text-muted-foreground">{description}</p>
      }
    </div>
  )
}

export default SectionHeader