const { differenceInYears } = require("date-fns");

// Age difference thresholds (in years)
const VERY_CLOSE_AGE_THRESHOLD = 2;
const CLOSE_AGE_THRESHOLD = 5;
const SOMEWHAT_CLOSE_AGE_THRESHOLD = 10;

//function returns the match score between the currentUser and a streamer based off values. The higher the score the better the match
function calculateMatchScore(currentUser, streamerToCompare, userWeights) {
  //calculate each base score for the five data points we have on each streamer
  const ageScore = calcAgeScore(currentUser, streamerToCompare);
  const audienceScore = calcAudienceScore(currentUser, streamerToCompare);
  const tagScore = calcTagScore(currentUser, streamerToCompare);
  const gameScore = calcGameScore(currentUser, streamerToCompare);
  const languageScore = calcLanguageScore(currentUser, streamerToCompare);

  //once we have base scores just multiply those base scores by the weight we have in our users table and sum them all up this is the streamers match score
  return (
    ageScore * userWeights.age_weight +
    audienceScore * userWeights.audience_weight +
    tagScore * userWeights.tags_weight +
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
    return 4;
  } else if (ageDifference <= CLOSE_AGE_THRESHOLD) {
    return 2;
  } else if (ageDifference <= SOMEWHAT_CLOSE_AGE_THRESHOLD) {
    return 1;
  }
  return 0.5;
}

function calcAudienceScore(currentUser, streamerToCompare) {
  //check targetAudience. This one is a BIG boost. If user and streamer we are comparing them with stream to same audience give them 6 points
  if (currentUser.targetAudience === streamerToCompare.targetAudience) {
    return 5;
  } else {
    return 1; //small base score if audience isnt the saem but at least weights will still affect it.
  }
}

function calcTagScore(currentUser, streamerToCompare) {
  //TODO: CASE INSENSITIVITY if user has tag "valorant" vs "Valorant" should still match
  //Now we need to check tags. We can add points depending on how many tags are shared between the user and the streamer we are checking
  //filter through current users tags and return tags that are in the streamerTocompare tags
  const sharedTags = currentUser.tags.filter((tag) => {
    return streamerToCompare.tags.includes(tag);
  });

  //for each tag that is in common add 2 points to the score. Hence the sharedTags * 2
  return Math.max(1, sharedTags.length * 2); //return min 1 point so it isnt 0 if no shared tags
}

function calcGameScore(currentUser, streamerToCompare) {
  // Handle missing game data not all twitch users might have it most do though
  if (!currentUser.twitch_game_name || !streamerToCompare.twitch_game_name) {
    return 1; // Can't compare, return base score
  }

  if (currentUser.twitch_game_name === streamerToCompare.twitch_game_name) {
    return 3; // Same game
  } else {
    return 1; // Different game
  }
}

function calcLanguageScore(currentUser, streamerToCompare) {
  //handle missing language data should have it but some twitch streamers donbt have it set
  if (
    !currentUser.twitch_broadcaster_language ||
    !streamerToCompare.twitch_broadcaster_language
  ) {
    return 1; // Can't compare, return base score
  }

  if (
    currentUser.twitch_broadcaster_language ===
    streamerToCompare.twitch_broadcaster_language
  ) {
    return 4; // Same language
  } else {
    return 1; // Different language
  }
}

module.exports = { calculateMatchScore, calcAgeScore, calcAudienceScore, calcGameScore, calcLanguageScore };
