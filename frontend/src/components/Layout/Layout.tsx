import { Outlet } from "react-router-dom"; //using outlet so that whatever page user navigates to it gets autofilled to that
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  return (
    <div className = "w-full">
      <NavigationMenu className = "w-full max-w-none bg-light-purple [&>div]:w-full"> {/*Here I had to do something cheesy. So when I inspected element radix UI wrapped below MenuList in extra div that wasnt allowin it to take full space so justify-between wouldnt work. With [&>div]:w-full syntax I can choose this element > direct child whihc is a div and apply w-full  */}
        <NavigationMenuList className = "!justify-between w-full pt-4 pb-4 px-60 ">

          <NavigationMenuItem>
            <NavigationMenuLink onClick = {()=>{navigate('./dashboard')}}>
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink onClick = {()=>{navigate('./discover') }}>
              Discover
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink onClick = {()=>{navigate('./connections') }}>
              Saved Connections
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink onClick = {()=>{navigate('./events') }}>
              Collaboration
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </div>
  );
}
