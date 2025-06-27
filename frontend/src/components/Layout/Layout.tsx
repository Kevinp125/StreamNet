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
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              Item One
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>
                Link
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </>
  );
}
