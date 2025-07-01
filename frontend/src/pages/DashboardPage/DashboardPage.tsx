import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DISCOVER_PATH } from "@/lib/paths";

export default function DashboardPage() {
  const navigate = useNavigate();

  //keep in mind in future below discover streamers button wont be positioned absolutely but rather be in a flex box container that also contains prompt of day and recent activity
  return (
    <>
      <h1 className="text-white">In Dash</h1>
      <Button
        onClick={() => {
          navigate(DISCOVER_PATH);
        }}
        className="position bg-electric-indigo absolute right-20 bottom-20 h-16 w-72 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
      >
        Discover Streamers!
      </Button>
    </>
  );
}
