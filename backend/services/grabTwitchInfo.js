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
async function getTwitchChannelData(twitchUserId, accessToken) {
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

    if (!res.ok) {
      throw new Error(`Failed to get the channel information: ${res.status}`);
    }

    //the api returns an array of channels but since we are only searching for ones information we dont want to return the channelInfo because it has a data property which is an array of obejcts. Just acces that data arrays first element
    const channelInfo = await res.json();
    const channel = channelInfo.data[0];

    if (!channel) {
      //just warn because we want registration to proceed as normal if there isnt a channel
      console.warn(`No channel found for user ID: ${twitchUserId}`);
      return null;
    }

    //otherwise return an object with all the information we want from the channel object have an or with a null set as a fall back
    return {
      twitch_game_name: channel.game_name || null,
      twitch_broadcaster_language: channel.broadcaster_language || null,
      twitch_tags: channel.tags || [],
    };
  } catch (err) {
    console.error(`Did not succeed in egetting twitch Channel data:`, err);
    throw err;
  }
}

//this function calls the two functions above. getTwitchAccestoken so then use that result and call the get twitch data
async function processTwitchUserData(twitchUserId) {
  try {
    if (!twitchUserId) {
      throw new Error("No twitch id provided");
    }

    const accessToken = await getTwitchAppAccessToken();
    const channelInfo = await getTwitchChannelData(twitchUserId, accessToken);

    //remember channelInfo coudl have null values if some fields werrent filled in that is ok not every user will have every field filled in
    return channelInfo;
  } catch (err) {
    console.error(`Failed to process twitch data`, err);
    //return default values in case error happens above so profike creation can still operate smoothly. Might be a network error or something in getTwitchChannelData so we gotta just return null for all values
    return {
      twitch_game_name: null,
      twitch_broadcaster_language: null,
      twitch_tags: [],
    };
  }
}

module.exports = processTwitchUserData;
