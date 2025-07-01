import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Hard-coded data for testing
const mockProfile = {
  id: "12345",
  name: "Kevin", 
  twitchUser: "happy_mankey",
  email: "streamer@example.com",
  profilePic: "https://static-cdn.jtvnw.net/jtv_user_pictures/771d394f-1606-4f80-92df-28280668aeba-profile_image-300x300.png",
  description: "To be honest I'm just an average guy who plays games now and then. However, the times I decide to play, me and my friends have some hilarious and crazy moments. I figured I would stream it to share these crazy and funny moments with some other people. So enjoy!",
  targetAudience: "young_adults",
  tags: ["gaming", "comedy", "fps", "valorant", "twitch"],
  dob: "1995-08-15",
  created_at: "2024-01-15"
};

export default function StreamerCard({profile = mockProfile}){
  const formatAudience = (audience: string) => {
    switch(audience) {
      case 'kids': return 'Kids (0-12)';
      case 'teens': return 'Teens (13-17)';
      case 'young_adults': return 'Young Adults (18-25)';
      case 'adults': return 'Adults (26-35)';
      case 'mature': return 'Mature (35+)';
      case 'all_ages': return 'All Ages';
      default: return audience;
    }
  };

  return(
    <Card className = "w-[85%] h-full flex flex-col p-6 border-light-purple border-6">
      <CardHeader>
        <CardTitle className = "flex flex-col items-center gap-4">
          <h1 className = "text-2xl">@{profile.twitchUser}</h1>
          <img 
            src={profile.profilePic} 
            alt="Profile" 
            className="w-36 h-36 rounded-full border-2 border-primary/20"
          />

          <div>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3.5">

        {/* TODO: Placeholder for fav clip will do that soon need to update database to include a clip url and figure out embed stuff */}
        <div className="h-36 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl">🎬</div>
            <p className="text-sm">Favorite Clip</p>
            <p className="text-xs">Coming Soon</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-md flex items-center gap-2">
            <span>📝</span>
            About Me
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {profile.description}
          </p>
        </div>
        



      </CardContent>

    </Card>




  )





}