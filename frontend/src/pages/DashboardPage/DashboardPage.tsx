import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DISCOVER_PATH } from "@/lib/paths";
import StreamerCard from "@/components/StreamerCard/StreamerCard";

export default function DashboardPage() {
  const navigate = useNavigate();

  //keep in mind in future below discover streamers button wont be positioned absolutely but rather be in a flex box container that also contains prompt of day and recent activity
  return (
    
    <div className = "flex flex-row gap-1 p-14 min-h-screen">

      <div className = "flex-1">
        <StreamerCard />
      </div>

      <div className = "flex flex-col gap-6 flex-1 items-center">

        {/*Prompt of day and recent avtiviy components go here */}
      
      
        <Button
          onClick={() => {
            navigate(DISCOVER_PATH);
          }}
          className="position bg-electric-indigo h-16 w-72 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
        >
          Discover Streamers!
        </Button>

      </div>


    </div>

    
  );
}
