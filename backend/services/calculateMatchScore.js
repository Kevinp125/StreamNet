const { mergeAndDeduplicateTags } = require("./mergeArrays");
const { differenceInYears } = require("date-fns");

// Age difference thresholds (in years)
const VERY_CLOSE_AGE_THRESHOLD = 2;
const CLOSE_AGE_THRESHOLD = 5;
const SOMEWHAT_CLOSE_AGE_THRESHOLD = 10;

//function returns the match score between the currentUser and a streamer based off values. The higher the score the better the match
function calculateMatchScore(currentUser, streamerToCompare, userWeights) {
  //calculate each base score for the five data points we have on each streamer
  const ageScore = calcAgeScore(currentUser, streamerToCompare);
  const audienceScore = calcAudienceScore(streamerToCompare, userWeights);
  const tagScore = calcTagScore(streamerToCompare, userWeights);
  const gameScore = calcGameScore(currentUser, streamerToCompare);
  const languageScore = calcLanguageScore(currentUser, streamerToCompare);

  //once we have base scores just multiply those base scores by the weight we have in our users table and sum them all up this is the streamers match score
  return (
    ageScore * userWeights.age_weight +
    audienceScore +
    tagScore +
    gameScore * userWeights.game_weight +
    languageScore * userWeights.language_weight
  );
}

function calcAgeScore(currentUser, streamerToCompare) {
  //converting the date of births of both the current user and streamer we are comparing with to years so we can check if they are close in age.
  const currentUserAge = differenceInYears(
    new Date(),
    new Date(currentUser.date_of_birth)
  );
  const streamerAge = differenceInYears(
    new Date(),
    new Date(streamerToCompare.date_of_birth)
  );

  //get the age difference and depending on how far the gap is we assign more points if the gap is closer and less if further apart
  const ageDifference = Math.abs(currentUserAge - streamerAge);

  if (ageDifference <= VERY_CLOSE_AGE_THRESHOLD) {
    return 2;
  } else if (ageDifference <= CLOSE_AGE_THRESHOLD) {
    return 1;
  } else if (ageDifference <= SOMEWHAT_CLOSE_AGE_THRESHOLD) {
    return 0.5;
  }
  return 0.25;
}

//This one is smart like the tags. All we have to do is check what audience the streamer we are comparing to has and m
function calcAudienceScore(streamerToCompare, userWeights) {
  const audiencePreferences = userWeights.audience_preferences;
  //store the streamer we are comparing what audience they stream to
  const streamerAudience = streamerToCompare.targetAudience;

  //then just get the preference for that streamers audience based off of our user audience preference json. Default to 1 if not set (it will be)
  const audiencePreference = audiencePreferences[streamerAudience] || 1.0;

  //then just multiply that by number 3 out of whim similar to my tags so that the score isnt like just the weight whuch could be 1.1,1.2
  return audiencePreference * 3;
}

//refactored this function fully so that we can do smart tag checking based on user preference
function calcTagScore(streamerToCompare, userWeights) {
  //ehanced twitchtags now includes the current channels tags as well as tags labeled from past streams for better matchin
  const noDupTags = mergeAndDeduplicateTags(
    streamerToCompare.tags,
    streamerToCompare.twitch_tags //more enhanced data!
  );

  let totalPreference = 0; //going with an average approach so that users with more tags dont beat user with less amount of tags but better perfefnce to them

  noDupTags.forEach((tag) => {
    const preference = userWeights.preferred_tags[tag] || 1.0; //for every tag the streamer we are comparting to has check the weight for that tag on user side default to 1 if no preference yet
    totalPreference += preference; //add that to the total preference (weights) for the tags
  });

  //Then average it if there are some heavy weighted tags and a small amount of them this will get a good score
  const averagePreference = totalPreference / noDupTags.length;

  // Scale it up (multiply by 3 for meaningful range)
  return averagePreference * 3;
}

function calcGameScore(currentUser, streamerToCompare) {
  //now using enhanced userGames array
  const userGames =
    currentUser.twitch_games || [currentUser.twitch_game_name].filter(Boolean);
  const streamerGames =
    streamerToCompare.twitch_games ||
    [streamerToCompare.twitch_game_name].filter(Boolean);

  if (userGames.length === 0 || streamerGames.length === 0) {
    return 0.5; // Can't compare, return base score
  }

  // Enhanced: Check for any game overlap between arrays
  const gameOverlap = userGames.some((game) => streamerGames.includes(game));

  if (gameOverlap) {
    return 2; // Found matching game in their history
  } else {
    return 0.5; // No games in common
  }
}

function calcLanguageScore(currentUser, streamerToCompare) {
  //handle if the language is other
  if (
    currentUser.twitch_broadcaster_language === "other" ||
    streamerToCompare.twitch_broadcaster_language === "other"
  ) {
    return 1; // Neutral score
  }

  if (
    currentUser.twitch_broadcaster_language ===
    streamerToCompare.twitch_broadcaster_language
  ) {
    return 2.5; // Same language
  } else {
    return 0.5; // Different language
  }
}

module.exports = {
  calculateMatchScore,
  calcAgeScore,
  calcAudienceScore,
  calcGameScore,
  calcLanguageScore,
  calcTagScore,
};
