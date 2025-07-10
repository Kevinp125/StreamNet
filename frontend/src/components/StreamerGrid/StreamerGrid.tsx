import DiscoverStreamerCard from "../DiscoverStreamerCard/DiscoverStreamerCard";
import type { StreamerProfile } from "@/types/AppTypes";

type StreamerGridProps = {
  handleStreamerClick: (profile: StreamerProfile) => void;
  recommendedStreamers: StreamerProfile[];
};

//TODO: In a future branch StreamerGrid will be called from Disover page and will be passes information fetched from database after algorithm..
export default function StreamerGrid({
  handleStreamerClick,
  recommendedStreamers,
}: StreamerGridProps) {
  return (
    //making this grid responsive so on smallest screens only disply grird with one column as screen size goes up display more columns
    <div className='grid grid-cols-1 gap-6 p-[5%] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'>
      {recommendedStreamers.map(streamer => (
        //TODO: Create streamerCard component
        <DiscoverStreamerCard
          key={streamer.id}
          streamer={streamer}
          onStreamerClick={handleStreamerClick}
        />
      ))}
    </div>
  );
}
