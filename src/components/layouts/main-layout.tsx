import { Outlet } from "react-router"

interface Props{
  children?:React.ReactNode
}

const MainLayout = ({
  children
}:Props) => {
  return (
    <div>
      {children || <Outlet/>}
    </div>
  )
}

export default MainLayout