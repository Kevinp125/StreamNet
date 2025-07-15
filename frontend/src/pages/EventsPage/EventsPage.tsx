import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import CreateEventForm from "@/components/CreateEventForm/CreateEventForm";
import { fetchEvents } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import EventsGrid from "@/components/EventsGrid /EventsGrid";

export default function EventsPage() {
  const { session } = useAuthContext();
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventList, setEventList] = useState([]);

  function handleFormClose() {
    setShowEventForm(false);
  }

  async function loadEvents() {
    try {
      if (!session?.access_token) return;
      const events = await fetchEvents(session?.access_token);
      setEventList(events);
    } catch (err) {
      console.error("could not fetch the events in the frontend", err);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [session?.access_token]);

  return (
    <div className='flex flex-col items-center p-16'>
      <Button
        className='bg-electric-indigo h-16 w-72 cursor-pointer'
        onClick={() => setShowEventForm(true)}
      >
        Post Event!
      </Button>

      <EventsGrid events = {eventList}/>

      {showEventForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <CreateEventForm onClose={handleFormClose} loadEvents={loadEvents} />
        </div>
      )}
    </div>
  );
}
