import DiscoverStreamerCard from "../DiscoverStreamerCard/DiscoverStreamerCard";

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

type StreamerGridProps = {
  handleStreamerClick: (profile: StreamerProfile) => void;
  recommendedStreamers: StreamerProfile[];

}


//TODO: In a future branch StreamerGrid will be called from Disover page and will be passes information fetched from database after algorithm..
export default function StreamerGrid({handleStreamerClick, recommendedStreamers}: StreamerGridProps) {
  return (
    //making this grid responsive so on smallest screens only disply grird with one column as screen size goes up display more columns
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 p-[5%]'>
      {recommendedStreamers.map(streamer => (
        //TODO: Create streamerCard component
        <DiscoverStreamerCard key={streamer.id} streamer={streamer} handleStreamerClick = {handleStreamerClick}/>
      ))}
    </div>


  );
}
