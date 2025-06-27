import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {

  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-white">In Dash</h1>
      <Button onClick = {() => {navigate('/discover')}} className="position bg-electric-indigo hover: absolute right-20 bottom-20 h-16 w-72 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105">
        Discover Streamers!
      </Button>
    </>
  );
}
