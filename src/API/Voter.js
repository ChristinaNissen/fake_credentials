import Parse from "parse";


export async function addVoter(ID, password, RandomID, taskAnswer = "") {
  if (!ID || !password) {
    throw new Error("ID and password are required");
  }
  await Parse.User.logOut();
  let user = new Parse.User();
  user.set("username", ID);
  user.set("password", password);
  user.set("Candidate", "");
  user.set("BallotSelection", "");
  user.set("TrackingID", RandomID);
  user.set("TaskAnswer", taskAnswer);
  user.set("HowToVoteVideoClickCount", 0);
  user.set("CoercionVideoClickCount", 0);
  user.set("StartTimeFirstPhase", new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
  try {
    await user.signUp();
  } catch (err) {
    console.error("addVoter error:", err, err.name, err.message, err.code);
    if (err.xhr) console.error("err.xhr:", err.xhr);
    if (err.rawResponse) console.error("rawResponse:", err.rawResponse);
    throw err;
  }
}

export async function loginVoter(ID, password, taskAnswerPart2 = "") {
  try {
    await Parse.User.logOut();
    const user = await Parse.User.logIn(ID, password);
    console.log("Login successful:", user);
    const startTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    user.set("StartTimeSecondPhase", startTime);
    if (taskAnswerPart2) {
      user.set("TaskAnswerPart2", taskAnswerPart2);
    }
    await user.save();
    return user;
  } catch (err) {
    console.error("loginVoter error:", err, err.name, err.message, err.code);
    if (err.xhr) console.error("err.xhr:", err.xhr);
    if (err.rawResponse) console.error("rawResponse:", err.rawResponse);
    throw err;
  }
}



export async function logoutVoter(){
  try {
    await Parse.User.logOut();
    // Clear all session storage and local storage
    sessionStorage.clear();
    localStorage.clear();
    console.log("Logout successful - all sessions cleared");
  } catch (err) {
    console.error("Logout error:", err);
    throw err;
  }
}

export default function getCurrentUser() {
  let currentUser = Parse.User.current();
  return currentUser;
}


export async function saveVote(vote1) {
  const Voter = getCurrentUser();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
  const voteWithTimestamp = `${vote1}_${timestamp}`;
  Voter.set("Candidate", voteWithTimestamp);
  try {
    await Voter.save();
  } catch (error) {
    console.log("Error saving vote: " + error);
  }
}

export async function saveVote2(vote2) {
  const Voter = getCurrentUser();
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
  const voteWithTimestamp = `${vote2}_${timestamp}`;
  Voter.set("Candidate", voteWithTimestamp);
  try {
    await Voter.save();
  } catch (error) {
    console.log("Error saving vote: " + error);
  }
}



export async function saveVisuaRepresentation(visualRepresentation) {
  const Voter = getCurrentUser();
  Voter.set("Visual_represenation", visualRepresentation);
  try {
    await Voter.save();
  } catch (error) {
    console.log("Error saving ballot representation: " + error);
  }
}

export async function getVisualRepresentation() {
  const Voter = getCurrentUser();
  try {
    const visualRepresentation = Voter.get("Visual_represenation");
    return visualRepresentation;
  } catch (error) {
    console.log("Error retrieving visual representation: " + error);
    return null;
  }
}


export async function saveBallotSelections(ballotSelections) {
  const Voter = getCurrentUser();
  Voter.set("Ballot_Selections", ballotSelections);
  try {
    await Voter.save();
  } catch (error) {
    console.log("Error saving ballot selections: " + error);
  }
}

export async function saveCorrectSelections(correctSelections) {
  const Voter = getCurrentUser();
  Voter.set("Correct_selections", Boolean(correctSelections)); // Ensure boolean
  try {
    await Voter.save();
  } catch (error) {
    console.log("Error saving correct selections: " + error);
  }
}

export async function getTrackingID() {
  const Voter = getCurrentUser();
  try {
    const trackingID = Voter.get("TrackingID");
    return trackingID;
  } catch (error) {
    console.log("Error retrieving tracking ID: " + error);
    return null;
  }
}

export async function getUserID() {
  const Voter = getCurrentUser();
  try {
    const userID = Voter.get("username");
    return userID;
  } catch (error) {
    console.log("Error retrieving user ID: " + error);
    return null;
  }
}

export async function getCandidate() {
  const Voter = getCurrentUser();
  try {
    const candidate = Voter.get("Candidate");
    return candidate;
  } catch (error) {
    console.log("Error retrieving candidate: " + error);
    return null;
  }
}

export async function getBooleanSelection() {
  const Voter = getCurrentUser();
  try {
    const correctSelection = Voter.get("Correct_selections");
    return correctSelection;
  } catch (error) {
    console.log("Error retrieving correct selections: " + error);
    return null;
  }
}

// Increment Help_Visit_Counter for the current user
export async function incrementHelpVisitCounter() {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("No user is currently logged in");
  }
  try {
    let currentCount = user.get("Help_Visit_Counter") || 0;
    user.set("Help_Visit_Counter", currentCount + 1);
    await user.save();
    return user.get("Help_Visit_Counter");
  } catch (error) {
    console.error("Error incrementing user's Help_Visit_Counter:", error);
    throw error;
  }
}

// Set Session_End to current date for the current user
export async function setSessionEnd() {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("No user is currently logged in");
  }
  try {
    user.set("Session_End", new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
    await user.save();
    return true;
  } catch (error) {
    console.error("Error setting Session_End:", error);
    throw error;
  }
}

// Set EndTimeFirstPhase to current date for the current user
export async function setEndTimeFirstPhase() {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("No user is currently logged in");
  }
  try {
    user.set("EndTimeFirstPhase", new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
    await user.save();
    return true;
  } catch (error) {
    console.error("Error setting EndTimeFirstPhase:", error);
    throw error;
  }
}

// Set EndTimeSecondPhase to current date for the current user
export async function setEndTimeSecondPhase() {
  const user = Parse.User.current();
  if (!user) {
    throw new Error("No user is currently logged in");
  }
  try {
    user.set("EndTimeSecondPhase", new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
    await user.save();
    return true;
  } catch (error) {
    console.error("Error setting EndTimeSecondPhase:", error);
    throw error;
  }
}



// Save the user's selection on "Have you voted before?" page
export async function saveVotedBefore(votedBefore) {
  const Voter = getCurrentUser();
  Voter.set("VotedBefore", Boolean(votedBefore));
  try {
    await Voter.save();
  } catch (error) {
    console.log("Error saving voted before: " + error);
  }
}

export async function getVotedBefore() {
  const Voter = getCurrentUser();
  try {
    const votedBefore = Voter.get("VotedBefore");
    return votedBefore;
  } catch (error) {
    console.log("Error retrieving voted before: " + error);
    return null;
  }
}

export async function syncVideoInteractionCounters(pendingCounts = {}) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }

  const howToVoteIncrement = Math.max(0, Number(pendingCounts.howToVote) || 0);
  const coercionIncrement = Math.max(0, Number(pendingCounts.coercion) || 0);

  if (howToVoteIncrement === 0 && coercionIncrement === 0) {
    return {
      howToVote: Number(user.get("HowToVoteVideoClickCount") || 0),
      coercion: Number(user.get("CoercionVideoClickCount") || 0),
    };
  }

  try {
    await user.fetch();

    const currentHowToVote = Number(user.get("HowToVoteVideoClickCount") || 0);
    const currentCoercion = Number(user.get("CoercionVideoClickCount") || 0);

    user.set("HowToVoteVideoClickCount", currentHowToVote + howToVoteIncrement);
    user.set("CoercionVideoClickCount", currentCoercion + coercionIncrement);

    await user.save();

    return {
      howToVote: Number(user.get("HowToVoteVideoClickCount") || 0),
      coercion: Number(user.get("CoercionVideoClickCount") || 0),
    };
  } catch (error) {
    console.error("Error syncing video interaction counters:", error);
    throw error;
  }
}

