const { differenceInYears } = require("date-fns");

//function returns the match score between the currentUser and a streamer based off values. The higher the score the better the match
function calculateMatchScore(currentUser, streamerToCompare) {
  //to start off score can only go up.
  const score = 0;

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

  if (ageDifference <= 2) {
    score += 4;
  } else if (ageDifference <= 5) {
    score += 2;
  } else if (ageDifference <= 10) {
    score++;
  }

  //check targetAudience. This one is a BIG boost. If user and streamer we are comparing them with stream to same audience give them 3 points
  if (currentUser.targetAudience === streamerToCompare.targetAudience) {
    score = score + 6;
  }

  //Now we need to check tags. We can add points depending on how many tags are shared between the user and the streamer we are checking
  //filter through current users tags and return tags that are in the streamerTocompare tags
  sharedTags = currentUser.tags.filter( (tag) => {
    return streamerToCompare.tags.includes(tag);
  })

  //for each tag that is in common add 3 points to the score. Hence the sharedTags * 3
  score = sharedTags * 3;

  return score;
}
