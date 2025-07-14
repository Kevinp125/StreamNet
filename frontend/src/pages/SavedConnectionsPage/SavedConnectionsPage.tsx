import { useEffect, useState } from "react";
import StreamerGrid from "@/components/StreamerGrid/StreamerGrid";
import StreamerCard from "@/components/StreamerCard/StreamerCard";
import { fetchUserConnections } from "@/lib/api_client";
import { removeConnection } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import type { StreamerProfile } from "@/types/AppTypes";

export default function SavedConnectionsPage() {
  const { session } = useAuthContext();
  const [connections, setConnections] = useState<StreamerProfile[]>([]);
  const [selectedStreamer, setSelectedStreamer] = useState<StreamerProfile | null>(null);

  function handleStreamerClick(profile: StreamerProfile) {
    setSelectedStreamer(profile);
  }

  function handleCloseModal() {
    setSelectedStreamer(null);
  }

  async function handleRemoveConnection(streamerId: string) {
    try {
      if (!session?.access_token) return;

      const res = await removeConnection(session.access_token, streamerId);

      if (res.success) {
        setConnections(prev => prev.filter(connection => connection.id !== streamerId));
      }
    } catch (err) {
      console.error("Was not able to remove the connection", err);
    }
  }

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
      <StreamerGrid
        handleStreamerClick={handleStreamerClick}
        handleRemoveConnection={handleRemoveConnection}
        streamers={connections}
        isConnectionsPage={true}
      />

      {/*Below is modal view we only want it to render if a card is clicked and we call the handleStreamerClick and it setSelectedStreamer to be a profile */}
      {selectedStreamer && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <StreamerCard profile={selectedStreamer} onClose={handleCloseModal} isModal={true} />
        </div>
      )}
    </>
  );
}
