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
      setThematicPasswordError("The entered thematic password is not a colour. Please enter a valid colour.");
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
        <div className="card-wide">
          <h1 className="password-title">
            How to login
          </h1>

          <div className="login-auth-scenarios">
            <div className="login-auth-info-intro">
              Use the credentials you received before voting to access the online voting system. Enter your regular password, then enter your thematic password from a specific category. You have three attempts to enter your regular password correctly. If the regular password is incorrect, login will fail. The examples below show how the login process works for the thematic password when the category is colours.
            </div>

            <div className="login-input-scenarios-grid">
              <div className="login-input-scenario-card scenario-success">
                <div className="login-input-scenario-meta">
                  <span className="login-input-scenario-badge badge-success">Success</span>
                </div>
                <div className="login-input-scenario-header">Normal Authentication</div>
                <div className="login-input-scenario-subtitle">The thematic password is correct.</div>
                <div className="login-input-example-label">Example</div>
                <div className="login-input-mock">
                  <strong className="login-input-mock-value">blue</strong>
                </div>
                <div className="login-input-scenario-result login-result-panel result-success">
                  <div className="login-result-title">Login successful</div>
                  <div className="login-result-text">Your vote will count in the final results.</div>
                </div>
              </div>

              <div className="login-input-scenario-card scenario-coercion">
                <div className="login-input-scenario-meta">
                  <span className="login-input-scenario-badge badge-coercion">Coercion-safe</span>
                </div>
                <div className="login-input-scenario-header">Coercion Scenario</div>
                <div className="login-input-scenario-subtitle">The thematic password is in the correct category, but it is not your true thematic password.</div>
                <div className="login-input-example-label">Example</div>
                <div className="login-input-mock">
                  <strong className="login-input-mock-value">purple</strong>
                </div>
                <div className="login-input-scenario-result login-result-panel result-coercion">
                  <div className="login-result-title">Login appears successful</div>
                  <div className="login-result-text">Your vote will not count in the final results.</div>
                </div>
              </div>

              <div className="login-input-scenario-card scenario-invalid">
                <div className="login-input-scenario-meta">
                  <span className="login-input-scenario-badge badge-invalid">Invalid</span>
                </div>
                <div className="login-input-scenario-header">Input Outside Theme</div>
                <div className="login-input-scenario-subtitle">The thematic password is outside the correct category.</div>
                <div className="login-input-example-label">Example</div>
                <div className="login-input-mock">
                  <strong className="login-input-mock-value">pizza</strong>
                </div>
                <div className="login-input-scenario-result login-result-panel result-invalid">
                  <div className="login-result-title">Login fails</div>
                  <div className="login-result-text">An error is shown, and you can retry.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="login-auth-warning">
            <strong>Important:</strong> If you cannot remember your thematic password, do <strong>not</strong> enter random values. Please{" "}
            <span
              onClick={() => navigate("/studyinfothematicforgotten")}
              className="login-auth-warning-link"
            >
              contact voter support
            </span>
            {" "}or vote in person at your local polling station.
          </div>

          <hr className="login-section-divider" />

          <form
            onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit}
            className="login-form"
            style={{ width: "100%", padding: "0 40px", boxSizing: "border-box" }}
          >
            <label htmlFor="regularPassword">Regular password</label>
            <input
              id="regularPassword"
              type="text"
              placeholder="Enter regular password"
              value={regularPassword}
              onChange={(e) => setRegularPassword(e.target.value)}
              className="login-input"
              autoComplete="username"
              disabled={step === 2}
              style={step === 2 ? { backgroundColor: "#fafafa", cursor: "not-allowed" } : undefined}
            />
            {regularPasswordError && <div className="login-error">{regularPasswordError}</div>}

            {step === 2 && (
              <>
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
              </>
            )}

            <button type="submit" className="button button-login" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                  <span>{step === 1 ? "Verifying..." : "Logging in..."}</span>
                </div>
              ) : (
                step === 1 ? "Next" : "Login"
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