import { Outlet } from "react-router-dom"; //using outlet so that whatever page user navigates to it gets autofilled to that
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

export default function Layout() {
  return (
    <>
      <NavigationMenu className = "w-full max-w-none bg-light-purple p-4">
        <NavigationMenuList className = "justify-between w-full">

          <NavigationMenuItem>
            <NavigationMenuLink>
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink>
              Discover
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink>
              Saved Connections
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink>
              Collaboration
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </>
  );
}
