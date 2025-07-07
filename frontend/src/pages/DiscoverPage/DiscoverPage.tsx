import { useState } from "react";
import StreamerGrid from "@/components/StreamerGrid/StreamerGrid";
import StreamerCard from "@/components/StreamerCard/StreamerCard";

type StreamerProfile = {
  id: string;
  name: string;
  twitchUser: string;
  email: string;
  profilePic: string;
  description: string;
  targetAudience: string;
  tags: string[];
  date_of_birth: string;
  created_at: string;
};

export default function DiscoverPage() {
  //below is state and functions that will take care of the modal popping up / interactions
  const [selectedStreamer, setSelectedStreamer] = useState<StreamerProfile | null>(null);

  {/*This will be passed through the StreamerGrid component and then to each card so when they are clicked this function is called with that cards info */}
  function handleStreamerClick(profile: StreamerProfile){
    setSelectedStreamer(profile);
  };

  {/*This is just passed to modal so that when close is clicked it closes */}
  function handleCloseModal(){
    setSelectedStreamer(null);
  };

  //Stretch maybe in future add a not interested and connect button inside modal but for now click will just be detailed view
  //and user has to click out to connect or be not interested.

  return (
    <>
      <StreamerGrid handleStreamerClick = {handleStreamerClick}/>

      {/*Below is modal view we only want it to render if a card is clicked and we call the handleStreamerClick and it setSelectedStreamer to be a profile */}
      {selectedStreamer && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <StreamerCard profile={selectedStreamer} onClose={handleCloseModal} isModal={true} />
        </div>
      )}

      
    </>
  );
}
