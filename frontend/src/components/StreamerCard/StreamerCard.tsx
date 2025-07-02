import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

type UserProfile = {
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

type StreamerCardProps = {
  profile: UserProfile;
  isModal?: boolean;
  onClose: () => void;
};

export default function StreamerCard({ profile, onClose, isModal }: StreamerCardProps) {
  const formatAudience = (audience: string) => {
    switch (audience) {
      case "kids":
        return "Kids (0-12)";
      case "teens":
        return "Teens (13-17)";
      case "young_adults":
        return "Young Adults (18-25)";
      case "adults":
        return "Adults (26-35)";
      case "mature":
        return "Mature (35+)";
      case "all_ages":
        return "All Ages";
      default:
        return audience;
    }
  };

  return (
    <Card className='border-light-purple flex h-full w-[85%] flex-col border-6 p-6'>
      {/*Below close modal will only pop up if isModal boolean is set to true */}
      {isModal && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onClose}
          className='flex justify-end text-gray-500 hover:bg-transparent hover:text-gray-700'
        >
          X
        </Button>
      )}

      <CardHeader>
        <CardTitle className='flex flex-col items-center gap-4'>
          <h1 className='text-2xl'>@{profile.twitchUser}</h1>
          <img
            src={profile.profilePic}
            alt='Profile'
            className='border-primary/20 h-36 w-36 rounded-full border-2'
          />

          <div>
            <h2 className='text-xl font-bold'>{profile.name}</h2>
            <p className='text-muted-foreground text-sm'>{profile.email}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className='flex flex-col gap-3.5'>
        {/* TODO: Placeholder for fav clip will do that soo need to update database to include a clip url and figure out embed stuff */}
        <div className='bg-muted flex h-36 items-center justify-center rounded-lg'>
          <div className='text-muted-foreground text-center'>
            <div className='text-4xl'>🎬</div>
            <p className='text-sm'>Favorite Clip</p>
            <p className='text-xs'>Coming Soon</p>
          </div>
        </div>

        <div>
          <h3 className='text-md flex items-center gap-2 font-semibold'>
            <span>📝</span>
            About Me
          </h3>
          <p className='text-muted-foreground text-xs leading-relaxed'>{profile.description}</p>
        </div>

        {/*Below container will store the target audienc and streamer tags side by side */}
        <div className='gap- flex'>
          <div className='flex-1'>
            <h3 className='text-md flex items-center gap-2 pb-2 font-semibold'>
              <span>🎯</span>
              Target Audience
            </h3>
            <div className='bg-electric-indigo inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-white'>
              {/*In database audience is stored as sort of a label call this function to get text returned describing label */}
              {formatAudience(profile.targetAudience)}
            </div>
          </div>

          <div className='flex-1'>
            <h3 className='text-md mb-3 flex items-center gap-2 font-semibold'>
              <span>🏷️</span>
              Content Tags
            </h3>
            <div className='flex flex-wrap gap-2'>
              {profile.tags?.map((tag, index) => (
                <span
                  key={index}
                  className='border-electric-indigo rounded-md border-2 bg-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-400'
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
