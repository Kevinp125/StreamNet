//using outlet so that whatever page user navigates to it gets autofilled to that
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { DASHBOARD_PATH, DISCOVER_PATH, CONNECTIONS_PATH, EVENTS_PATH } from "@/lib/paths";
import { LogOut } from "lucide-react"
import { useAuthContext } from "@/Context/AuthProvider";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Button } from "../ui/button";

export default function Layout() {

  const {signOut} = useAuthContext(); //grabbing the signOut function from our context so when button is clicked we can call the function
  const location = useLocation(); //using location to figure out what path we are currently on to highlight it to user
  const navigate = useNavigate();

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
                navigate(DASHBOARD_PATH);
              }}
            >
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer ${location.pathname === "/discover" ? "text-electric-indigo bg-accent hover:text-electric-indigo font-bold" : "hover:text-electric-indigo font-bold text-white transition-colors"}`}
              onClick={() => {
                navigate(DISCOVER_PATH);
              }}
            >
              Discover
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer ${location.pathname === "/connections" ? "text-electric-indigo bg-accent hover:text-electric-indigo font-bold" : "hover:text-electric-indigo font-bold text-white transition-colors"}`}
              onClick={() => {
                navigate(CONNECTIONS_PATH);
              }}
            >
              Saved Connections
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              className={`cursor-pointer ${location.pathname === "/events" ? "text-electric-indigo bg-accent hover:text-electric-indigo font-bold" : "hover:text-electric-indigo font-bold text-white transition-colors"}`}
              onClick={() => {
                navigate(EVENTS_PATH);
              }}
            >
              Collaboration
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>

        <Button className ="position absolute right-6 cursor-pointer hover:scale-105 transition-transform duration-200" variant = "destructive" onClick = {signOut}>
          <LogOut/>
        </Button>


      </NavigationMenu>
      <Outlet />
    </div>
  );
}
