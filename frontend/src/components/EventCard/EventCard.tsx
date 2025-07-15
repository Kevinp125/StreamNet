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

          <p className='text-sm text-gray-500'>  {new Date(event.event_date).toLocaleDateString()} @ {new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </CardHeader>

      <CardContent>
        <p className='text-sm'>{event.description}</p>
        <p className='mt-2 text-xs text-gray-500'>📍 {event.modality}</p>
      </CardContent>

      <CardFooter>
        <Button className='w-full'> I'm Attending</Button>
      </CardFooter>
    </Card>
  );
}
