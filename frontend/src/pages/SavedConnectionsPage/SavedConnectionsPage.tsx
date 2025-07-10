import { useEffect, useState } from "react";
import StreamerGrid from "@/components/StreamerGrid/StreamerGrid";
import StreamerCard from "@/components/StreamerCard/StreamerCard";
import { fetchUserConnections } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import type { StreamerProfile } from "@/types/AppTypes";

export default function SavedConnectionsPage() {
  const { session } = useAuthContext();
  const [connections, setConnections] = useState<StreamerProfile[]>([]);
  const [selectedStreamer, setSelectedStreamer] = useState<StreamerProfile | null>(null);

  function handleStreamerClick(profile: StreamerProfile) {
    setSelectedStreamer(profile);
  }

  {
    /*This is just passed to modal so that when close is clicked it closes */
  }
  function handleCloseModal() {
    setSelectedStreamer(null);
  }

  //TODO: This function will be built next. Will allow user to remove a connection
  async function handleRemoveConnection(streamerId: string) {}

  useEffect(() => {
    //wrapper function because useEffect cannot be async and we are going to make a fetch request so we need async function
    async function loadConnections() {
      if (session?.access_token) {
        try {
          const userConnections = await fetchUserConnections(session.access_token);
          setConnections(userConnections);
        } catch (err) {
          console.error("Fetch function failed to load connections", err);
        }
      }
    }

    loadConnections();
  }, [session?.access_token]);

  return (
    <>
      <StreamerGrid handleStreamerClick={handleStreamerClick} streamers={connections} />

      {/*Below is modal view we only want it to render if a card is clicked and we call the handleStreamerClick and it setSelectedStreamer to be a profile */}
      {selectedStreamer && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <StreamerCard profile={selectedStreamer} onClose={handleCloseModal} isModal={true} />
        </div>
      )}
    </>
  );
}
