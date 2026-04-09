import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import "./Login.css";
import "./Voting-system.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // install with: npm install react-icons
import { addVoter, loginVoter, syncVideoInteractionCounters } from '../API/Voter.js'; // Adjust path as needed
import { getPendingVideoInteractionCounts, clearPendingVideoInteractionCounts } from "../util";

const Login = ({ setIsLoggedIn }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userIDError, setUserIDError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showStudyModal, setShowStudyModal] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Secret salt for hashing - in production, this should be in an environment variable
  const SECRET_SALT = "voting_system_secret_2024";

  // Function to hash the UserID using SHA-256
  const hashUserID = async (prolificID) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(prolificID + SECRET_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // Function to hash the Password using SHA-256
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + SECRET_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const persistParticipantCode = (code) => {
    if (!code) return;
    sessionStorage.setItem("participantCode", code);
    localStorage.setItem("participantCode", code);
  };

  const syncPendingVideoCountersAfterAuth = async () => {
    const pendingCounts = getPendingVideoInteractionCounts();
    const pendingTotal = Number(pendingCounts.howToVote || 0) + Number(pendingCounts.coercion || 0);
    if (pendingTotal <= 0) return;

    await syncVideoInteractionCounters(pendingCounts);
    clearPendingVideoInteractionCounts();
  };



const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  let hasError = false;

  if (!userID.trim()) {
    setUserIDError("Please enter your user ID");
    hasError = true;
  } else {
    setUserIDError("");
  }

  if (!password.trim()) {
    setPasswordError("Please enter your password");
    hasError = true;
  } else {
    setPasswordError("");
  }

  if (hasError) {
    setIsLoading(false);
    return;
  }

 try {
    // Hash the UserID and Password before sending to API
    const hashedUserID = await hashUserID(userID);
    const hashedPassword = await hashPassword(password);
    const taskAnswerPart2 =
      sessionStorage.getItem("taskAnswerPart2") ||
      localStorage.getItem("taskAnswerPart2") ||
      "";
    
    console.log("Attempting login...");
    // Try to log in first
    await loginVoter(hashedUserID, hashedPassword, taskAnswerPart2);
    await syncPendingVideoCountersAfterAuth();
    persistParticipantCode(hashedUserID);
    if (taskAnswerPart2) {
      sessionStorage.removeItem("taskAnswerPart2");
      localStorage.removeItem("taskAnswerPart2");
    }
    console.log("Login successful");
    setIsLoggedIn(true);
    navigate("/votedbefore");
  } catch (error) {
    setIsLoading(false);
    console.log("Login error:", error);
      // If login fails, try to sign up
      if (
        error.message.includes("Invalid username/password") ||
        error.message.includes("user not found") ||
        error.code === 101
      ) {
        try {
          console.log("Attempting signup...");
          // Hash the UserID and Password before creating account
          const hashedUserID = await hashUserID(userID);
          const hashedPassword = await hashPassword(password);
          // Generate a random 4-digit number
          const random4Digit = Math.floor(1000 + Math.random() * 9000).toString();
          // Get the task answer from sessionStorage
          const taskAnswer = sessionStorage.getItem("taskAnswer") || "";
          await addVoter(hashedUserID, hashedPassword, random4Digit, taskAnswer);
          await syncPendingVideoCountersAfterAuth();
          persistParticipantCode(hashedUserID);
          console.log("Signup successful");
          
          // Verify user is logged in after signup
          const Parse = require('parse');
          const currentUser = Parse.User.current();
          console.log("Current user after signup:", currentUser?.get("username"));
          console.log("Session token:", currentUser?.getSessionToken());
          
          if (currentUser) {
            setIsLoggedIn(true);
            navigate("/votedbefore");
          } else {
            console.error("No current user after signup!");
            setPasswordError("Signup succeeded but login failed. Please try logging in manually.");
          }
        } catch (signupError) {
          console.error("Signup error:", signupError);
          if (
            signupError.message.includes("Account already exists") ||
            signupError.code === 202
          ) {
            setUserIDError("This user ID is already taken. Please choose another.");
          } else if (signupError.code === 100) {
            setPasswordError("Connection failed. Please check your internet connection.");
          } else {
            setPasswordError(`Login failed: ${signupError.message || "Please try again."}`);
          }
        }
      } else if (error.code === 100) {
        setPasswordError("Connection failed. Please check your internet connection.");
      } else {
        setPasswordError(`Login failed: ${error.message || "Please try again."}`);
      }
    }
};

  return (
    <div className="page-wrapper">
      <main className="welcome-main">
        <h1>Login to your account</h1>
        <div className="text-main login-text">
          Please enter your details below to access the online voting system.
        </div>
        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="userID">ProlificID</label>
            <input
              id="userID"
              type="text"
              placeholder ="Enter Prolific ID"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="login-input"
              autoComplete="username"
            />
            {userIDError && <div className="login-error">{userIDError}</div>}

            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
            <input
              id="password"
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder = "Enter password"
              autoComplete="current-password"
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
            {passwordError && <div className="login-error">{passwordError}</div>}

            <button type="submit" className="button button-login" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {showStudyModal && (
          <div className="study-modal-backdrop">
            <div className="study-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Study Information</h2>
              <p>
                For this study, please use your <strong>Prolific ID</strong> as both your ID and password.<br /><br />
                Your Prolific ID is salted and hashed before it is stored in this system. We do not store your raw Prolific ID in this database.<br /><br />
                In a real election, this login would use secure personal credentials.
              </p>
              <div className="study-modal-actions">
                <button className="study-button" onClick={() => setShowStudyModal(false)}>
                  Got it
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Login;