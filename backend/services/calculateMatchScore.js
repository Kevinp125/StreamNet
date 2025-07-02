const { differenceInYears} = require('date-fns');

//function returns the match score between the currentUser and a streamer based off values. The higher the score the better the match
function calculateMatchScore(currentUser, streamerToCompare){
  //to start off score can only go up.
  const score = 0;

  //converting the date of births of both the current user and streamer we are comparing with to years so we can check if they are close in age. 
  const currentUserAge = differenceInYears(new Date(), new Date(currentUser.date_of_birth));
  const streamerAge = differenceInYears(new Date(), new Date(streamerToCompare.date_of_birth));

  //if the user and streamer we are comparing them to are withing three years of age add a point to the score
  if(Math.abs(currentUserAge - streamerAge) <= 3){
    score++;
  }






  return score;



}