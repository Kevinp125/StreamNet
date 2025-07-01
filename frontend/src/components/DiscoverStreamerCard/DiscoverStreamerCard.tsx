import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '../ui/badge';

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
}

type DisoverStreamerCardProps = {
  streamer: StreamerInfo
}


export default function DiscoverStreamerCard({streamer}: DisoverStreamerCardProps){

  return(
    <Card>
      <CardHeader>



      </CardHeader>
      
      <CardContent>



      </CardContent>

      <CardFooter>


        
      </CardFooter>


    </Card>


  )



}