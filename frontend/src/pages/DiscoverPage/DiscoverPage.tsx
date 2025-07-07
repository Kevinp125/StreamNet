import { useEffect, useState } from "react";
import StreamerGrid from "@/components/StreamerGrid/StreamerGrid";
import StreamerCard from "@/components/StreamerCard/StreamerCard";
import { fetchRecommendedStreamers } from "@/lib/api_client";
import { useAuthContext } from "@/Context/AuthProvider";
import type { StreamerProfile } from "@/Types/AppTypes";

export default function DiscoverPage() {
  const { session } = useAuthContext();

  const [recommendedStreamers, setRecommendedStreamers] = useState<StreamerProfile[]>([]);
  //below is state and functions that will take care of the modal popping up / interactions
  const [selectedStreamer, setSelectedStreamer] = useState<StreamerProfile | null>(null);

  {
    /*This will be passed through the StreamerGrid component and then to each card so when they are clicked this function is called with that cards info */
  }
  function handleStreamerClick(profile: StreamerProfile) {
    setSelectedStreamer(profile);
  }

  {
    /*This is just passed to modal so that when close is clicked it closes */
  }
  function handleCloseModal() {
    setSelectedStreamer(null);
  }

  //Stretch maybe in future add a not interested and connect button inside modal but for now click will just be detailed view
  //and user has to click out to connect or be not interested.

  useEffect(() => {
    async function storeRecommendedStreamers() {
      if (session?.access_token) {
        const recommendedStreamers = await fetchRecommendedStreamers(session.access_token);
        setRecommendedStreamers(recommendedStreamers);
      }
    }

    storeRecommendedStreamers();
  }, [session?.access_token]); //re-run if token changes like refreshes or when they log in

  return (
    <>
      <StreamerGrid
        handleStreamerClick={handleStreamerClick}
        recommendedStreamers={recommendedStreamers}
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
