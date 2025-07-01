import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";
//library with a function that can calculate the difference in years from today and someones birthday
import { differenceInYears } from "date-fns"; 

type StreamerInfo = {
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

type DisoverStreamerCardProps = {
  streamer: StreamerInfo;
};

export default function DiscoverStreamerCard({ streamer }: DisoverStreamerCardProps) {
  //using the date-fns library function differenceInYears to calculate someones age based on todays date and date_of_birth
  const age = differenceInYears(new Date(), new Date(streamer.date_of_birth));

  return (
    <Card className='w-full max-w-md transition-all duration-300 hover:scale-105'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <img
            className='h-12 w-12 rounded-full border-2 border-gray-200 object-cover'
            src={streamer.profilePic}
            alt={`${streamer.name}'s profile picture`}
          />

          <div className = "flex flex-col ">
            <h2 className = "font-semibold">{streamer.name}</h2>
            <h3 className = "text-sm text-gray-600">@{streamer.twitchUser}</h3>
          </div>

          <p className = "text-rigtht text-xs text-gray-600">Age: {age}</p>
        </div>
      </CardHeader>

      <CardContent></CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}
