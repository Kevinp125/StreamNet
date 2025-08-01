import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import CreateEventForm from "@/components/CreateEventForm/CreateEventForm";
import { fetchEvents } from "@/lib/api_client";
import { postEventRsvp } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import EventsGrid from "@/components/EventsGrid /EventsGrid";
import { Loader2 } from "lucide-react";

export default function EventsPage() {
  const { session } = useAuthContext();
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  function handleFormClose() {
    setShowEventForm(false);
  }

  async function handleRSVP(eventId: string, userStatus: string) {
    //putting all rsvp info in an object because that is what utol function takes in
    const rsvpInfo = {
      event_id: eventId,
      status: userStatus,
    };
    try {
      if (!session?.access_token) return;

      //when user clicks the im in button itll call handleRSVP with attending status and button changes to opt out. If they click opt out it will call with status not going and button changes back to Im in
      await postEventRsvp(session?.access_token, rsvpInfo);
      //whenever rsvp gets updated remember to fetch our events again because it will put all the new rsvp info in the events which we access in our event card to figure out user rsvp status. This way it persists across pages
      loadEvents();
    } catch (err) {
      console.error("Failed to update RSVP", err);
    }
  }

  async function loadEvents() {
    try {
      if (!session?.access_token) return;
      const events = await fetchEvents(session?.access_token);
      setEventList(events);
      setLoading(false);
    } catch (err) {
      console.error("could not fetch the events in the frontend", err);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [session?.access_token]);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-white' />
        <div className='font-bold text-white'>Finding events...</div>
      </div>
    );
  }

  if (eventList.length === 0) {
    return (
      <div className='flex flex-col items-center gap-60 p-16'>
        <Button
          className='bg-electric-indigo h-16 w-72 cursor-pointer hover:bg-purple-700'
          onClick={() => setShowEventForm(true)}
        >
          Post Event!
        </Button>

        <div className='mb-2 text-xl font-bold text-white'>No events yet</div>

        {showEventForm && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <CreateEventForm onClose={handleFormClose} loadEvents={loadEvents} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center p-16'>
      <Button
        className='bg-electric-indigo h-16 w-72 cursor-pointer hover:bg-purple-700'
        onClick={() => setShowEventForm(true)}
      >
        Post Event!
      </Button>

      <EventsGrid events={eventList} handleRSVP={handleRSVP} />

      {showEventForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <CreateEventForm onClose={handleFormClose} loadEvents={loadEvents} />
        </div>
      )}
    </div>
  );
}
