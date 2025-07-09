//below function fetches an access token given by twitch through our client secret and id. This token will allow us to successfully make fetch request to get user channel data
async function getTwitchAppAccessToken() {
  try {
    const res = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
    });

    if (!res.ok) {
      throw new Error(`Could not get the twitch app token:${res.status}`);
    }

    const token = await response.json();
    //above returns a token object with like 3 different fields we just want access token field.
    return token.access_token;
  } catch (err) {
    console.error("Could not get the twitch app token", err);
    throw err;
  }
}

//this function will make fetch request to twitch api with access token we got and retrieve some extra channel information such as the language, game last played, and twitch's own tags
async function getTwitchChannelData(twtichUserId, accessToken) {
  try {
    //fetching channel data based off the twitch userID we got from auth flow and we pass in to this function
    const res = await fetch(
      `https://api.twitch.tv/helix/channels?broadcaster_id=${twitchUserId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
      }
    );



  } catch (err) {}
}
