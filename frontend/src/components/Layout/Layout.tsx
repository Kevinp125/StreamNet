//using outlet so that whatever page user navigates to it gets autofilled to that
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
//Navigation Menu component from shadcn: https://ui.shadcn.com/docs/components/navigation-menu
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Layout() {
  const location = useLocation(); //using location to figure out what path we are currently on to highlight it to user
  const navigate = useNavigate();

  console.log("hello");
  
  return (
    <div className='w-full'>
      <NavigationMenu className='bg-light-purple w-full max-w-none [&>div]:w-full'>
        {" "}
        {/*Here I had to do something cheesy. So when I inspected element radix UI wrapped below MenuList in extra div that wasnt allowin it to take full space so justify-between wouldnt work. With [&>div]:w-full syntax I can choose this element > direct child whihc is a div and apply w-full  */}
        <NavigationMenuList className='w-full !justify-between px-60 pt-4 pb-4'>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer ${location.pathname === "/dashboard" ? "text-electric-indigo bg-accent hover:text-electric-indigo font-bold" : "hover:text-electric-indigo font-bold text-white transition-colors"}`}
              onClick={() => {
                navigate("./dashboard");
              }}
            >
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer ${location.pathname === "/discover" ? "text-electric-indigo bg-accent hover:text-electric-indigo font-bold" : "hover:text-electric-indigo font-bold text-white transition-colors"}`}
              onClick={() => {
                navigate("./discover");
              }}
            >
              Discover
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer ${location.pathname === "/connections" ? "text-electric-indigo bg-accent hover:text-electric-indigo font-bold" : "hover:text-electric-indigo font-bold text-white transition-colors"}`}
              onClick={() => {
                navigate("./connections");
              }}
            >
              Saved Connections
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer ${location.pathname === "/events" ? "text-electric-indigo bg-accent hover:text-electric-indigo font-bold" : "hover:text-electric-indigo font-bold text-white transition-colors"}`}
              onClick={() => {
                navigate("./events");
              }}
            >
              Collaboration
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </div>
  );
}
