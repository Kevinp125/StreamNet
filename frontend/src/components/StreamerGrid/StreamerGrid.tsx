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
//below is just hard coded streamers that are in database. Using this to display cards for now will get api endpoint to fetch from database later
// const mockStreamers = [
//   {
//     id: "11111111-1111-1111-1111-111111111111",
//     email: "ninja@example.com",
//     twitchUser: "ninja_fake",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png", // Pikachu
//     description:
//       "Professional gamer and streamer. I play Fortnite, Valorant, and other competitive games at the highest level.",
//     name: "Tyler Johnson",
//     date_of_birth: "1991-06-05",
//     targetAudience: "young_adults",
//     tags: ["gaming", "esports", "fortnite", "valorant"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "22222222-2222-2222-2222-222222222222",
//     email: "xqc@example.com",
//     twitchUser: "xqc_fake",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png", // Charizard
//     description:
//       "Variety streamer who loves reacting to videos and chatting with viewers. Come hang out!",
//     name: "Felix Lengyel",
//     date_of_birth: "1995-11-12",
//     targetAudience: "teens",
//     tags: ["variety", "reactions", "comedy", "gaming"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "33333333-3333-3333-3333-333333333333",
//     email: "pokimane@example.com",
//     twitchUser: "pokimane_fake",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png", // Jigglypuff
//     description:
//       "Content creator who loves gaming, chatting, and creating a positive community for everyone!",
//     name: "Imane Anys",
//     date_of_birth: "1996-05-14",
//     targetAudience: "all_ages",
//     tags: ["gaming", "variety", "community", "positivity", "test"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "44444444-4444-4444-4444-444444444444",
//     email: "shroud@example.com",
//     twitchUser: "shroud_fake",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png", // Blastoise
//     description:
//       "Former CS:GO pro turned variety streamer. I play FPS games and whatever looks fun!",
//     name: "Michael Grzesiek",
//     date_of_birth: "1994-06-02",
//     targetAudience: "young_adults",
//     tags: ["fps", "csgo", "valorant", "gaming", "hello"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "55555555-5555-5555-5555-555555555555",
//     email: "lirik@example.com",
//     twitchUser: "lirik_fake",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png", // Lapras
//     description:
//       "Variety gamer who tries out new indie games and hidden gems. Always looking for the next great game!",
//     name: "Saqib Zahid",
//     date_of_birth: "1990-10-29",
//     targetAudience: "adults",
//     tags: ["variety", "indie", "exploration", "gaming"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "66666666-6666-6666-6666-666666666666",
//     email: "bobross@example.com",
//     twitchUser: "digital_artist",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png", // Chansey
//     description:
//       "Digital artist who streams the creative process. Watch me paint landscapes, characters, and fan art!",
//     name: "Sarah Williams",
//     date_of_birth: "1988-03-15",
//     targetAudience: "all_ages",
//     tags: ["art", "creative", "digital", "tutorial"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "77777777-7777-7777-7777-777777777777",
//     email: "horror_king@example.com",
//     twitchUser: "horror_king",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png", // Gengar
//     description:
//       "Horror game enthusiast who plays the scariest games and somehow survives. Come get spooked with me!",
//     name: "Marcus Johnson",
//     date_of_birth: "1992-10-31",
//     targetAudience: "mature",
//     tags: ["horror", "scary", "survival", "gaming"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "88888888-8888-8888-8888-888888888888",
//     email: "speedrun_god@example.com",
//     twitchUser: "speedrun_god",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png", // Mew
//     description: "World record holder in several games. Watch me break games and set new records!",
//     name: "Alex Chen",
//     date_of_birth: "1993-07-20",
//     targetAudience: "young_adults",
//     tags: ["speedrun", "retro", "nintendo", "records"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "99999999-9999-9999-9999-999999999999",
//     email: "chat_master@example.com",
//     twitchUser: "chat_master",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png", // Mewtwo
//     description:
//       "I love talking to my community! We discuss everything from life advice to random shower thoughts.",
//     name: "Jessica Martinez",
//     date_of_birth: "1997-02-28",
//     targetAudience: "young_adults",
//     tags: ["chatting", "community", "advice", "discussion"],
//     created_at: new Date().toISOString(),
//   },
//   {
//     id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
//     email: "retro_gamer@example.com",
//     twitchUser: "retro_gamer",
//     profilePic: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png", // Snorlax
//     description:
//       "Bringing back the classics! I play retro games from the 80s, 90s, and early 2000s with nostalgic commentary.",
//     name: "David Thompson",
//     date_of_birth: "1985-12-10",
//     targetAudience: "adults",
//     tags: ["retro", "nostalgia", "classic", "gaming"],
//     created_at: new Date().toISOString(),
//   },
// ];

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
