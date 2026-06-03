import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import "./Login.css";
import "./Voting-system.css";
import ProcessBar from "./ProcessBar";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // install with: npm install react-icons
import getCurrentUser, { syncVideoInteractionCounters, saveFailedRegularPasswordAttempt, saveFailedThematicPasswordAttempt } from '../API/Voter.js'; // Adjust path as needed
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
  const [step, setStep] = useState(1); // Track which step we're on
  const [regularPassword, setRegularPassword] = useState("");
  const [thematicPassword, setThematicPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [regularPasswordError, setRegularPasswordError] = useState("");
  const [thematicPasswordError, setThematicPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [regularPasswordAttempts, setRegularPasswordAttempts] = useState(0);
  const navigate = useNavigate();


  const syncPendingVideoCountersAfterAuth = async () => {
    const pendingCounts = getPendingVideoInteractionCounts();
    const pendingTotal = Number(pendingCounts.howToVote || 0) + Number(pendingCounts.coercion || 0);
    if (pendingTotal <= 0) return;

    await syncVideoInteractionCounters(pendingCounts);
    clearPendingVideoInteractionCounts();
  };

  const checkAndSaveRegularPassword = async (enteredRegular) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error("No current user found");
        return false;
      }

      const assignedRegular = user.get("regular");
      const regularMatches = enteredRegular === assignedRegular;

      // Save regularCheck immediately
      user.set("regularCheck", regularMatches);
      await user.save();
      console.log("Regular password check saved:", { regularMatches });

      return regularMatches;
    } catch (error) {
      console.error("Error checking/saving regular password:", error);
      return false;
    }
  };

  const checkAndSaveThematicPassword = async (enteredThematic) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error("No current user found");
        return false;
      }

      const assignedThematic = user.get("thematic");
      const thematicMatches = enteredThematic === assignedThematic;

      // Save thematicCheck immediately
      user.set("thematicCheck", thematicMatches);
      await user.save();
      console.log("Thematic password check saved:", { thematicMatches });

      return thematicMatches;
    } catch (error) {
      console.error("Error checking/saving thematic password:", error);
      return false;
    }
  };


const handleStep1Submit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setRegularPasswordError("");

  if (!regularPassword.trim()) {
    setRegularPasswordError("Please enter your regular password");
    setIsLoading(false);
    return;
  }

  try {
    // Get the logged-in user and check their assigned regular password
    const user = getCurrentUser();
    if (!user) {
      setRegularPasswordError("No user session found. Please restart the study.");
      setIsLoading(false);
      return;
    }

    // Check and save regular password immediately
    const regularMatches = await checkAndSaveRegularPassword(regularPassword);

    if (!regularMatches) {
      // Save the failed attempt to database immediately
      await saveFailedRegularPasswordAttempt(regularPassword);

      const newAttempts = regularPasswordAttempts + 1;
      setRegularPasswordAttempts(newAttempts);

      if (newAttempts >= 3) {
        // After 3 failed attempts, redirect to StudyInfo page
        navigate("/studyinfopasswordforgotten");
        return;
      }

      setRegularPasswordError(`Regular password not found. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? '' : 's'} remaining.`);
      setIsLoading(false);
      return;
    }

    // Regular password is correct, proceed to step 2
    setIsLoading(false);
    setStep(2);
  } catch (error) {
    console.error("Error checking regular password:", error);
    setRegularPasswordError("An error occurred. Please try again.");
    setIsLoading(false);
  }
};

const handleStep2Submit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setThematicPasswordError("");

  if (!thematicPassword.trim()) {
    setThematicPasswordError("Please enter your thematic password");
    setIsLoading(false);
    return;
  }

  try {
    console.log("Checking thematic password...");

    // Check and save thematic password immediately
    const thematicMatches = await checkAndSaveThematicPassword(thematicPassword);

    // If thematic password doesn't match but IS a valid color, pretend success (coercion protection)
    if (!thematicMatches && isColour(thematicPassword)) {
      // Save the failed attempt
      await saveFailedThematicPasswordAttempt(regularPassword, thematicPassword);

      // Proceed as if login succeeded (to hide from attacker)
      await syncPendingVideoCountersAfterAuth();
      console.log("Coercion protection: fake success, thematicCheck=false saved");
      setIsLoggedIn(true);
      navigate("/voting");
      return;
    }

    // If thematic password is not a valid color at all, show error
    if (!thematicMatches && !isColour(thematicPassword)) {
      await saveFailedThematicPasswordAttempt(regularPassword, thematicPassword);
      setThematicPasswordError("The entered thematic password is not a colour. Please enter a valid colour (e.g. blue, red, green).");
      setIsLoading(false);
      return;
    }

    // Thematic password is correct
    await syncPendingVideoCountersAfterAuth();
    console.log("Password check successful");
    setIsLoggedIn(true);
    navigate("/voting");
  } catch (error) {
    setIsLoading(false);
    console.log("Error checking password:", error);
    setThematicPasswordError("An error occurred. Please try again.");
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
            {step === 1 ? "Step 1: Regular Password" : "Step 2: Thematic Password"}
          </h1>

          {step === 1 ? (
            <>
              <div className="text-main" style={{ width: "100%", textAlign: "left", marginLeft: "40px", marginRight: "40px", marginBottom: "0" }}>
                This system uses two-factor authentication for your security. First, please enter your <strong>regular password</strong>.
              </div>
              <div className="text-main" style={{ width: "100%", textAlign: "left", marginLeft: "40px", marginRight: "40px", marginTop: "16px", fontSize: "0.95rem", color: "#555" }}>
                After verifying your regular password, you will be asked to enter your thematic password in the next step.
              </div>
            </>
          ) : (
            <>
              <div className="text-main" style={{ width: "100%", textAlign: "left", marginLeft: "40px", marginRight: "40px", marginBottom: "0" }}>
                Now enter your <strong>thematic password</strong>. This system includes coercion protection. Here's how it responds to different inputs:
              </div>
              <div className="login-auth-scenarios" style={{ width: "100%", padding: "16px 40px 0 40px", boxSizing: "border-box" }}>
                <div className="login-auth-scenario">
                  <div className="login-auth-scenario-title">✓ Correct credentials</div>
                  <div className="login-auth-scenario-desc">
                    Your true thematic password is correct → Login succeeds and your vote will count in the final results.
                  </div>
                </div>
                <div className="login-auth-scenario">
                  <div className="login-auth-scenario-title">🔒 Coercion protection (security feature)</div>
                  <div className="login-auth-scenario-desc">
                    You enter a <strong>fake thematic password within the same theme</strong> (e.g., "purple" instead of "blue" if your theme is colours) → Login appears successful and you can cast a vote, but <strong>the vote will not count</strong>. This protects you if someone is forcing you to vote a certain way.
                  </div>
                </div>
                <div className="login-auth-scenario">
                  <div className="login-auth-scenario-title">✗ Invalid input</div>
                  <div className="login-auth-scenario-desc">
                    Thematic password is <strong>not within the correct theme</strong> (e.g., "pizza" when your theme is colours) → <strong>Error message will be displayed</strong>. The system only suppresses errors when you enter a valid fake password within your theme.
                  </div>
                </div>
              </div>
              <div className="login-auth-warning" style={{ margin: "16px 40px 0 40px" }}>
                <strong>⚠ Important:</strong> If you cannot remember your thematic password, do <strong>not</strong> enter arbitrary inputs. Random inputs that fall outside your theme will trigger error messages, potentially revealing to an observer that you don't know your credentials. Instead,{' '}
                <span
                  onClick={() => navigate("/studyinfothematicforgotten")}
                  style={{
                    color: "#1976d2",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  contact voter support
                </span>
                {' '}or vote in person at your local polling station.
              </div>
            </>
          )}

          <hr style={{ margin: "24px 40px", borderColor: "#e0e0e0", width: "calc(100% - 80px)" }} />

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="login-form" style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}>
              <label htmlFor="regularPassword">Regular password</label>
              <input
                id="regularPassword"
                type="text"
                placeholder="Enter regular password"
                value={regularPassword}
                onChange={(e) => setRegularPassword(e.target.value)}
                className="login-input"
                autoComplete="username"
                autoFocus
              />
              {regularPasswordError && <div className="login-error">{regularPasswordError}</div>}

              <button type="submit" className="button button-login" disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner-container">
                    <div className="spinner"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Next"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="login-form" style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}>
              <label htmlFor="regularPasswordDisplay">Regular password</label>
              <input
                id="regularPasswordDisplay"
                type="text"
                value={regularPassword}
                className="login-input"
                disabled
                style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
              />

              <label htmlFor="thematicPassword">Thematic password</label>
              <div className="password-input-wrapper">
                <input
                  id="thematicPassword"
                  className="login-input"
                  type={showPassword ? "text" : "password"}
                  value={thematicPassword}
                  onChange={(e) => setThematicPassword(e.target.value)}
                  placeholder="Enter thematic password"
                  autoComplete="current-password"
                  autoFocus
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
              {thematicPasswordError && <div className="login-error">{thematicPasswordError}</div>}

              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <button
                  type="button"
                  className="button button-login"
                  onClick={() => {
                    setStep(1);
                    setThematicPassword("");
                    setThematicPasswordError("");
                  }}
                  style={{ flex: 1, backgroundColor: "#6c757d" }}
                >
                  Back
                </button>
                <button type="submit" className="button button-login" disabled={isLoading} style={{ flex: 2 }}>
                  {isLoading ? (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login2;