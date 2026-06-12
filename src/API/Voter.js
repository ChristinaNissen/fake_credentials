import Parse from "parse";


export async function addVoter(ID, password, regular, thematic, taskAnswer = "") {
  if (!ID || !password) {
    throw new Error("ID and password are required");
  }
  await Parse.User.logOut();
  let user = new Parse.User();
  user.set("username", ID);
  user.set("password", password);
  user.set("regular", regular);
  user.set("thematic", thematic);
  user.set("regularPasswordAttempts", []);
  user.set("thematicPasswordAttempts", []);
  user.set("Candidate", "");
  user.set("TaskAnswer", taskAnswer);
  user.set("HowToVoteVideoClickCount", 0);
  user.set("CoercionVideoClickCount", 0);
  user.set("savedRegularPassword", "No");
  user.set("downloadVotingInstructions", "No");
  try {
    await user.signUp();
  } catch (err) {
    console.error("addVoter error:", err, err.name, err.message, err.code);
    if (err.xhr) console.error("err.xhr:", err.xhr);
    if (err.rawResponse) console.error("rawResponse:", err.rawResponse);
    throw err;
  }
}

export async function markRegularPasswordAsSaved() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }

  try {
    user.set("savedRegularPassword", "Yes");
    await user.save();
    return true;
  } catch (error) {
    console.error("Error setting savedRegularPassword to Yes:", error);
    throw error;
  }
}

export async function markVotingInstructionsAsDownloaded() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }

  try {
    user.set("downloadVotingInstructions", "Yes");
    await user.save();
    return true;
  } catch (error) {
    console.error("Error setting downloadVotingInstructions to Yes:", error);
    throw error;
  }
}

export async function markContactedSupport() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }

  try {
    user.set("ContactedSupport", "yes");
    await user.save();
    return true;
  } catch (error) {
    console.error("Error setting ContactedSupport to yes:", error);
    throw error;
  }
}

export async function incrementVideoInteractionCounter(videoKey) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }

  if (videoKey !== "howToVote" && videoKey !== "coercion") {
    throw new Error(`Invalid videoKey: ${videoKey}`);
  }

  const targetField = videoKey === "howToVote" ? "HowToVoteVideoClickCount" : "CoercionVideoClickCount";

  try {
    const currentCount = Number(user.get(targetField) || 0);
    user.set(targetField, currentCount + 1);
    await user.save();
    return Number(user.get(targetField) || 0);
  } catch (error) {
    console.error(`Error incrementing ${targetField}:`, error);
    throw error;
  }
}



export async function loginVoter(ID, password) {
  try {
    await Parse.User.logOut();
    const user = await Parse.User.logIn(ID, password);
    console.log("Login successful:", user);
    const startTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' });
    user.set("StartTimeSecondPhase", startTime);
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

export async function getRegular() {
  const user = getCurrentUser();
  if (!user) {
    console.log("No logged-in user found");
    return null;
  }

  try {
    await user.fetch();
    const regularValue = user.get("regular");
    console.log("getRegular() value from database:", regularValue);
    return regularValue;
  } catch (error) {
    console.log("Error retrieving regular password value: " + error);
    return null;
  }
}

export async function getThematic() {
  const user = getCurrentUser();
  if (!user) {
    console.log("No logged-in user found");
    return null;
  }

  try {
    await user.fetch();
    const thematicValue = user.get("thematic");
    console.log("getThematic() value from database:", thematicValue);
    return thematicValue;
  } catch (error) {
    console.log("Error retrieving thematic password value: " + error);
    return null;
  }
}

export async function saveRegularCheckFromInput(enteredRegular) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }

  const regularValue = await getRegular();
  const regularMatches = enteredRegular === regularValue;

  user.set("regularCheck", regularMatches);
  await user.save();
  console.log("saveRegularCheckFromInput result:", { regularMatches, enteredRegular, regularValue });

  return regularMatches;
}

export async function saveThematicCheckFromInput(enteredThematic) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("No user is currently logged in");
  }

  const thematicValue = await getThematic();
  const thematicMatches = enteredThematic === thematicValue;

  user.set("thematicCheck", thematicMatches);
  await user.save();
  console.log("saveThematicCheckFromInput result:", { thematicMatches, enteredThematic, thematicValue });

  return thematicMatches;
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


// Save failed regular password attempt to user object
export async function saveFailedRegularPasswordAttempt(enteredPassword) {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log("No logged-in user found");
      return;
    }

    // Get existing attempts and add the new one
    const existingAttempts = user.get("regularPasswordAttempts") || [];
    existingAttempts.push(enteredPassword);
    user.set("regularPasswordAttempts", existingAttempts);

    await user.save();
    console.log("Saved failed regular password attempt");
  } catch (error) {
    console.error("Error saving failed regular password attempt:", error);
  }
}

// Save failed thematic password attempt to user object
export async function saveFailedThematicPasswordAttempt(correctRegularPassword, enteredPassword) {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log("No logged-in user found");
      return;
    }

    // Get existing attempts and add the new one
    const existingAttempts = user.get("thematicPasswordAttempts") || [];
    existingAttempts.push(enteredPassword);
    user.set("thematicPasswordAttempts", existingAttempts);

    await user.save();
    console.log("Saved failed thematic password attempt");
  } catch (error) {
    console.error("Error saving failed thematic password attempt:", error);
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

