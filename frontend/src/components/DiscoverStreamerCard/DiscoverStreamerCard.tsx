import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Heart, X, Users } from "lucide-react";
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
            className='h-13 w-13 rounded-full border-2 border-gray-200 object-cover'
            src={streamer.profilePic}
            alt={`${streamer.name}'s profile picture`}
          />

          <div className='flex flex-col'>
            <h2 className='font-semibold'>{streamer.name}</h2>
            <h3 className='text-sm text-gray-600'>@{streamer.twitchUser}</h3>
          </div>

          <p className='text-rigtht text-xs text-gray-600'>Age: {age}</p>
        </div>
      </CardHeader>

      <CardContent>
        <p className='line-clamp-2 pb-0.5 text-xs text-gray-600'>{streamer.description}</p>

        {/*This div keeps in the col but the inside is a row so that the audience and users tag are side by side */}
        <div className='flex flex-row items-center gap-2 pb-2'>
          <Users className='h-4 w-4 text-gray-400' />

          <Badge variant='secondary'>
            {/*In Database audience types are stored with _ using replace we can quickly change that to a space */}
            <p className='text-xs capitalize'>{streamer.targetAudience.replace("_", " ")}</p>
          </Badge>
        </div>

        {/*Put tags in a flex container and allow them to wrap */}
        <div className='flex flex-wrap gap-1'>
          {/*We cant display every single streamer tag in the preview card. Slice from the array the first 3 and map through those and display tags */}
          {streamer.tags.slice(0, 3).map((tag, index) => (
            <Badge
              variant='outline'
              className='bg-electric-indigo text-white capitalize'
              key={index}
            >
              {tag}
            </Badge>
          ))}

          {/*After that check if the array length is more than the 3 we are displaying. If it is render one more badge that says how many extra tags streamer has based off total tags - 3 already displayed */}
          {streamer.tags.length > 3 && (
            <Badge variant='outline' className='text-xs text-gray-400'>
              +{streamer.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
