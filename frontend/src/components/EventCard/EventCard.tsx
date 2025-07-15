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



          </div>


        </div>
      </CardHeader>

      <CardContent>
        <p className='text-sm'>{event.description}</p>
        <p className='text-xs text-gray-500 mt-2'>📍 {event.modality}</p>
      </CardContent>

      <CardFooter>
        <Button className='w-full'> I'm Attending</Button>
      </CardFooter>
    </Card>
  );
}
