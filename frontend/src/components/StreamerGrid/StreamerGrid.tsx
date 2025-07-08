import DiscoverStreamerCard from "../DiscoverStreamerCard/DiscoverStreamerCard";
import type { StreamerProfile } from "@/types/AppTypes";

type StreamerGridProps = {
  handleStreamerClick: (profile: StreamerProfile) => void;
  handleStreamerConnect?: (streamerToConnectId: string) => void; //optional for discover page
  handleRemoveConnection?: (streamerId: string) => void; // Optional for connections page  
  streamers: StreamerProfile[];
  isConnectionsPage?: boolean; // To know which buttons to show
};

//TODO: In a future branch StreamerGrid will be called from Disover page and will be passes information fetched from database after algorithm..
export default function StreamerGrid({
  handleStreamerClick,
  handleStreamerConnect,
  isConnectionsPage,
  streamers,
}: StreamerGridProps) {
  return (
    //making this grid responsive so on smallest screens only disply grird with one column as screen size goes up display more columns
    <div className='grid grid-cols-1 gap-6 p-[5%] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'>
      {streamers.map(streamer => (
        //TODO: Create streamerCard component
        <DiscoverStreamerCard
          key={streamer.id}
          streamer={streamer}
          onStreamerClick={handleStreamerClick}
          onStreamerConnectClick = {handleStreamerConnect}
          isConnectionsPage = {isConnectionsPage}
        />
      ))}
    </div>
  );
}
