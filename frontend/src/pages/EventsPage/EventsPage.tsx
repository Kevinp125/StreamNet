import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EventsPage() {
  const [showEventForm, setShowEventForm] = useState(false);
  return (
    <div className='flex flex-col items-center p-16'>
      <Button className='bg-electric-indigo h-16 w-72' onClick={() => setShowEventForm(true)}>
        Post Event!
      </Button>

      {/*TODO here we will have the event grid that will map though all events and display them*/}

      {showEventForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'></div>
      )}
    </div>
  );
}
