import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EventCard({ event }: any) {
  return (
    <Card className='w-full max-w-md flex-col gap-2'>
      <CardHeader>
        <div className='flex flex-col'>
          <div className='flex'>
            <h2>{event.title}</h2>
            <Badge>{event.privacy_level}</Badge>
          </div>

          <div className='flex'>
            <p>by {event.profiles.twitchUser}</p>
            <img
              className='border-light-purple h-13 w-13 rounded-full border-2 object-cover'
              src={event.profiles.profilePic}
              alt={`${event.profiles.name}'s profile picture`}
            />
          </div>

          <p className='text-sm text-gray-500'> 🗓️ {new Date(event.event_date).toLocaleDateString()} @ {new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </CardHeader>

      <CardContent>
        <p className='text-sm'>{event.description}</p>
        {/*Put tags in a flex container and allow them to wrap */}
        <div className='flex flex-wrap gap-1'>
          {/*We cant display every single event in the card. Slice from the array the first 3 and map through those and display tags */}
          {event.tags.slice(0, 3).map((tag: any, index: any) => (
            <Badge
            variant='outline'
            className='bg-electric-indigo text-white capitalize'
            key={index}
            >
              {tag}
            </Badge>
          ))}

          {/*After that check if the array length is more than the 3 we are displaying. If it is render one more badge that says how many extra tags the event has - 3 already displayed */}
          {event.tags.length > 3 && (
            <Badge variant='outline' className='text-xs text-gray-400'>
              +{event.tags.length - 3}
            </Badge>
          )}
        </div>
        <p className='mt-2 text-xs text-gray-500'>📍 {event.modality}</p>
      </CardContent>

      <CardFooter>
        <Button className='w-full'> I'm Attending</Button>
      </CardFooter>
    </Card>
  );
}
