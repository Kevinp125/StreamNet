import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Heart, X, Users } from "lucide-react";
import { Trash } from "lucide-react";
import { Twitch } from "lucide-react";
import { Clock } from "lucide-react";
//library with a function that can calculate the difference in years from today and someones birthday
import { differenceInYears } from "date-fns";

import type { StreamerProfile } from "@/types/AppTypes";

type DisoverStreamerCardProps = {
  streamer: StreamerProfile;
  onStreamerClick: (profile: StreamerProfile) => void;
  onStreamerConnectClick?: (streamerToConnectId: string) => void;
  onRemoveConnectionClick?: (streamerId: string) => void;
  onStreamerNotInterestedClick?: (streamerId: string) => void;
  isConnectionsPage?: boolean;
};

export default function DiscoverStreamerCard({
  streamer,
  isConnectionsPage,
  onStreamerClick,
  onStreamerConnectClick,
  onStreamerNotInterestedClick,
  onRemoveConnectionClick,
}: DisoverStreamerCardProps) {
  function handleConnectClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (onStreamerConnectClick) onStreamerConnectClick(streamer.id);
  }

  function handleNotInterestedClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (onStreamerNotInterestedClick) onStreamerNotInterestedClick(streamer.id);
  }

  function handleRemoveConnectionClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (onRemoveConnectionClick) onRemoveConnectionClick(streamer.id);
  }

  const twitchUrl = "https://twitch.tv/";
  //using the date-fns library function differenceInYears to calculate someones age based on todays date and date_of_birth
  const age = differenceInYears(new Date(), new Date(streamer.date_of_birth));

  const connectStatusText = streamer.requestStatus === "pending" ? "Pending..." : "Connect";
  const isDisabled = streamer.requestStatus === "pending";

  return (
    <Card
      onClick={() => onStreamerClick(streamer)}
      className='w-full max-w-md cursor-pointer flex-col gap-2 transition-all duration-300 hover:scale-105'
    >
      <CardHeader>
        <div className='flex items-start justify-between'>
          <img
            className='border-light-purple h-13 w-13 rounded-full border-2 object-cover'
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

      <CardContent className='flex flex-1 flex-col gap-4'>
        <p className='line-clamp-2 text-xs text-gray-600'>{streamer.description}</p>

        {/*This div keeps in the col but the inside is a row so that the audience and users tag are side by side */}
        <div className='flex flex-row items-center gap-2'>
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
      <CardFooter className='flex justify-between'>
        {/*isConnectionsPage bool lets us render different buttons. So if we are on discover page it wont be true so !isConnectionsPage will be !false which means display the discover page buttons */}
        {!isConnectionsPage && (
          <>
            <Button
              onClick={handleConnectClick}
              variant='ghost'
              className='cursor-pointer'
              disabled={isDisabled}
            >
              {connectStatusText !== "Pending..." ? (
                <Heart className='h-3 w-3' />
              ) : (
                <Clock className='h-3 w-3' />
              )}
              <span className='text-sm'>{connectStatusText}</span>
            </Button>

            <Button
              onClick={handleNotInterestedClick}
              variant='ghost'
              className='cursor-pointer text-red-500 hover:text-red-500'
            >
              <X className='h-3 w-3' />
              <span className='text-sm'>Not Interested</span>
            </Button>
          </>
        )}

        {isConnectionsPage && (
          <>
            {/*For this button it it just takes user to that streamers twitch channel now that they are connected. Just provisional for mvp no handler needs to get called we just redirect with window.open*/}
            <Button
              variant='ghost'
              className='text-twitch-purple hover:text-twitch-purple cursor-pointer'
              onClick={e => {
                e.stopPropagation();
                window.open(`${twitchUrl}${streamer.twitchUser}`, "_blank");
              }}
            >
              <Twitch className='h-3 w-3' />
              <span className='text-sm'>Visit Twitch</span>
            </Button>

            {/*TODO: add below the function that calls parent function whenever we remove a saved connection onRemoveClick */}
            <Button
              variant='ghost'
              className='cursor-pointer text-red-500 hover:text-red-500'
              onClick={handleRemoveConnectionClick}
            >
              <Trash className='h-3 w-3' />
              <span className='text-sm'>Remove</span>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
