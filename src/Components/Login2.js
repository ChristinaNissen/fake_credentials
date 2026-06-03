import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import "./Login.css";
import "./Voting-system.css";
import ProcessBar from "./ProcessBar";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // install with: npm install react-icons
import { loginVoter, syncVideoInteractionCounters } from '../API/Voter.js'; // Adjust path as needed
import { getPendingVideoInteractionCounts, clearPendingVideoInteractionCounts } from "../util";

const VALID_COLOURS = new Set([
  "red", "blue", "green", "yellow", "orange", "purple", "pink", "black",
  "white", "grey", "gray", "brown", "violet", "indigo", "cyan", "magenta",
  "turquoise", "teal", "gold", "silver", "beige", "ivory", "coral", "salmon",
  "maroon", "navy", "olive", "lime", "aqua", "fuchsia", "crimson", "lavender",
  "mint", "peach", "rose", "amber", "jade", "lilac", "tan", "khaki",
]);

const isColour = (value) => VALID_COLOURS.has(value.trim().toLowerCase());

const Login2 = ({ setIsLoggedIn }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userIDError, setUserIDError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
  } else if (!isColour(password)) {
    setPasswordError("The entered thematic password is not a colour. Please enter a valid colour (e.g. blue, red, green).");
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
    navigate("/voting");
  } catch (error) {
    setIsLoading(false);
    console.log("Login error:", error);
    if (error.code === 100) {
      setPasswordError("Connection failed. Please check your internet connection.");
    } else {
      setPasswordError(`Login failed: ${error.message || "Please try again."}`);
    }
  }
};

  const steps = ["Login", "Voting", "Confirmation"];

  return (
    <div className="page-wrapper">
      <main className="welcome-main">
        <ProcessBar steps={steps} currentStep={1} />
        <h1>Login to your account</h1>
        <div className="text-main login-text">
          Please enter your details below to access the online voting system.
        </div>
        <div className="card-wide" style={{ alignItems: "flex-start" }}>
          <h1 className="card-title" style={{ width: "100%", textAlign: "left", margin: "0 0 10px 40px" }}>
            Authentication Behavior
          </h1>
          <div className="text-main" style={{ width: "100%", textAlign: "left", marginLeft: "40px", marginRight: "40px", marginBottom: "0" }}>
            This system uses two-factor authentication with coercion protection. Here's how the system responds to different inputs:
          </div>
          <div className="login-auth-scenarios" style={{ width: "100%", padding: "16px 40px 0 40px", boxSizing: "border-box" }}>
            <div className="login-auth-scenario">
              <div className="login-auth-scenario-title">✓ Correct credentials</div>
              <div className="login-auth-scenario-desc">
                Both your regular password and true thematic password are correct → Login succeeds and your vote will count in the final results.
              </div>
            </div>
            <div className="login-auth-scenario">
              <div className="login-auth-scenario-title">🔒 Coercion protection (security feature)</div>
              <div className="login-auth-scenario-desc">
                Regular password is correct, but you enter a <strong>fake thematic password within the same theme</strong> (e.g., "purple" instead of "blue" if your theme is colours) → Login appears successful and you can cast a vote, but <strong>the vote will not count</strong>. This protects you if someone is forcing you to vote a certain way.
              </div>
            </div>
            <div className="login-auth-scenario">
              <div className="login-auth-scenario-title">✗ Invalid input</div>
              <div className="login-auth-scenario-desc">
                Regular password is correct, but thematic password is <strong>not within the correct theme</strong> (e.g., "pizza" when your theme is colours) → <strong>Error message will be displayed</strong>. The system only suppresses errors when you enter a valid fake password within your theme.
              </div>
            </div>
          </div>
          <div className="login-auth-warning" style={{ margin: "16px 40px 0 40px" }}>
            <strong>⚠ Important:</strong> If you cannot remember your credentials, do <strong>not</strong> enter arbitrary inputs. Random inputs that fall outside your theme will trigger error messages, potentially revealing to an observer that you don't know your credentials. Instead, contact voter support or vote in person at your local polling station.
          </div>

          <hr style={{ margin: "24px 40px", borderColor: "#e0e0e0", width: "calc(100% - 80px)" }} />

          <form onSubmit={handleSubmit} className="login-form" style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}>
            <label htmlFor="userID">Regular password</label>
            <input
              id="userID"
              type="text"
              placeholder ="Enter regular password"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              className="login-input"
              autoComplete="username"
            />
            {userIDError && <div className="login-error">{userIDError}</div>}

            <label htmlFor="password">Thematic password</label>
            <div className="password-input-wrapper">
            <input
              id="password"
              className="login-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder = "Enter thematic password"
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
      </main>
      <Footer />
    </div>
  );
};

export default Login2;