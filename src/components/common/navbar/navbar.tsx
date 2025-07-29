import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { KATALOG_NAV_ITEMS } from "@/constants/navigation";
import type { IconType } from "react-icons";
import { Link } from "react-router"

const Navbar = () => {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to={"/"}>Beranda</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Katalog</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-2 md:grid-cols-1">
              {KATALOG_NAV_ITEMS.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.path}
                  Icon={item.Icon}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/tile-calculator">Kalkulator Ubin</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string,Icon:IconType }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="flex gap-2">
            <Icon className="size-[25px] text-muted-foreground"/>
            <div>
              <h3 className="text-sm leading-none font-medium mb-1">{title}</h3>
              <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export default Navbar