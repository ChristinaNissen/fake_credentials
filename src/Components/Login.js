import React, { useState, useEffect, useRef } from "react";
import Footer from "./Footer.js";
import "./Login.css";
import "./Voting-system.css";
import ProcessBar from "./ProcessBar.js";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // install with: npm install react-icons
import getCurrentUser, { saveFailedRegularPasswordAttempt, saveFailedThematicPasswordAttempt, markContactedSupport, setEndTimeFirstPhase, saveRegularCheckFromInput, saveThematicCheckFromInput } from '../API/Voter.js'; // Adjust path as needed

const VALID_COLOURS = new Set([
  "red", "blue", "green", "yellow", "orange", "purple", "pink", "black",
  "white", "grey", "gray", "brown", "violet", "indigo", "cyan", "magenta",
  "turquoise", "teal", "gold", "silver", "beige", "ivory", "coral", "salmon",
  "maroon", "navy", "olive", "lime", "aqua", "fuchsia", "crimson", "lavender",
  "mint", "peach", "rose", "amber", "jade", "lilac", "tan", "khaki",
]);

const isColour = (value) => VALID_COLOURS.has(value.trim().toLowerCase());

const Login = ({ setIsLoggedIn }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [step, setStep] = useState(1); // Track which step we're on
  const [regularPassword, setRegularPassword] = useState("");
  const [thematicPassword, setThematicPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [regularPasswordError, setRegularPasswordError] = useState("");
  const [thematicPasswordError, setThematicPasswordError] = useState("");
  const [showRegularPasswordModal, setShowRegularPasswordModal] = useState(false);
  const [showThematicWarningModal, setShowThematicWarningModal] = useState(false);
  const [hasAcknowledgedThematicWarning, setHasAcknowledgedThematicWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [regularPasswordAttempts, setRegularPasswordAttempts] = useState(0);
  const thematicPasswordInputRef = useRef(null);
  const navigate = useNavigate();
  const checkAndSaveRegularPassword = async (enteredRegular) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        console.error("No current user found");
        return false;
      }

      return await saveRegularCheckFromInput(enteredRegular);
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

      return await saveThematicCheckFromInput(enteredThematic);
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
        // After 3 failed attempts, show an instruction modal and continue
        // to thematic password step after acknowledgment.
        setRegularPasswordError("");
        setIsLoading(false);
        setShowRegularPasswordModal(true);
        return;
      }

      setRegularPasswordError("Regular password not found.");
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

  if (!hasAcknowledgedThematicWarning) {
    setShowThematicWarningModal(true);
    setIsLoading(false);
    return;
  }

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

  const handleContinueToThematicStep = () => {
    setShowRegularPasswordModal(false);
    setStep(2);
  };

  const handleContactSupportClick = async () => {
    try {
      await setEndTimeFirstPhase();
      await markContactedSupport();
    } catch (error) {
      console.error("Failed to mark ContactedSupport:", error);
    }

    navigate("/studyinfothematicforgotten");
  };

  const handleThematicPasswordFocus = (event) => {
    if (hasAcknowledgedThematicWarning) {
      return;
    }

    setShowThematicWarningModal(true);
    event.target.blur();
  };

  const handleThematicWarningContinue = () => {
    setHasAcknowledgedThematicWarning(true);
    setShowThematicWarningModal(false);

    if (thematicPasswordInputRef.current) {
      thematicPasswordInputRef.current.focus();
    }
  };

  return (
    <div className="page-wrapper">
      <main className="welcome-main">
        <ProcessBar steps={steps} currentStep={1} />
        <h1>Login to your account</h1>
        <div className="text-main login-text">
          Please enter your details below to access the online voting system.
        </div>
        <section className="card login-main-card" style={{ maxWidth: "800px", marginBottom: "36px" }}>
          <h1 className="password-title">
            How to login
          </h1>

          <div className="login-auth-info-intro">
            Use the passwords you received before voting to access the online voting system. Enter your regular password, then enter your thematic password from a specific category. You must first enter your regular password correctly before the thematic password step becomes available.
          </div>

          <div className="login-auth-info-intro">
            The thematic password is designed to protect voters against coercion. If someone forces you to vote for a specific candidate, you can enter another word from the same theme, and the login will appear successful but the vote will not be counted in the results.
          </div>

          <details className="login-auth-scenarios-accordion">
            <summary className="login-auth-scenarios-summary">
              <span>How does the thematic password work?</span>
              <span className="login-auth-scenarios-toggle" aria-hidden="true" />
            </summary>
            <div className="login-auth-scenarios-content">
              <p className="login-auth-scenarios-intro">
                These examples illustrate how the thematic password works for login when the category is colours.
              </p>
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
                  <div className="login-input-scenario-subtitle">The thematic password is in the correct theme, but it is not your true thematic password.</div>
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
                  <div className="login-input-scenario-subtitle">The thematic password is outside the correct theme.</div>
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
          </details>

          <hr className="login-section-divider" />

          <form
            id="login-auth-form"
            onSubmit={step === 1 ? handleStep1Submit : handleStep2Submit}
            className="login-form login-form-contained"
          >
            <label htmlFor="regularPassword">Regular password</label>
            <div className="password-input-wrapper">
              <input
                id="regularPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter regular password"
                value={regularPassword}
                onChange={(e) => setRegularPassword(e.target.value)}
                className="login-input"
                autoComplete="username"
                disabled={step === 2}
                style={step === 2 ? { backgroundColor: "#fafafa", cursor: "not-allowed" } : undefined}
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
            {regularPasswordError && <div className="login-error">{regularPasswordError}</div>}

            {step === 2 && (
              <>
                <label htmlFor="thematicPassword">Thematic password</label>
                <div className="password-input-wrapper">
                  <input
                    ref={thematicPasswordInputRef}
                    id="thematicPassword"
                    className="login-input"
                    type="text"
                    value={thematicPassword}
                    onChange={(e) => {
                      if (!hasAcknowledgedThematicWarning) {
                        return;
                      }
                      setThematicPassword(e.target.value);
                    }}
                    onFocus={handleThematicPasswordFocus}
                    placeholder="Enter thematic password"
                    autoComplete="current-password"
                    readOnly={!hasAcknowledgedThematicWarning}
                  />
                </div>
                {thematicPasswordError && <div className="login-error login-error-thematic">{thematicPasswordError}</div>}
              </>
            )}

            <button
              type="submit"
              className="button login-submit-button"
              disabled={isLoading}
            >
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
        </section>

        {showRegularPasswordModal && (
          <div className="login-study-modal-backdrop">
            <div className="login-study-modal">
              <h2>Study instruction</h2>
              <p>
                Your regular password could not be confirmed. For this study, you can still continue to the thematic password step. In a real voting system, this would not be possible.
              </p>
              <div className="login-study-modal-actions">
                <button
                  type="button"
                  className="login-study-modal-button"
                  onClick={handleContinueToThematicStep}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {showThematicWarningModal && (
          <div className="modal-backdrop-confirmation">
            <div className="modal-confirmation">
              <p className="modal-confirmation-title">Important!</p>
              <p>
                If you cannot remember your thematic password, do not enter random values. <br />Please{" "}
                <span
                  onClick={handleContactSupportClick}
                  className="login-auth-warning-link"
                >
                  contact voter support
                </span>
                {" "}or vote in person at your local polling station.
              </p>
              <div className="modal-confirmation-actions">
                <button
                  type="button"
                  className="button"
                  onClick={handleThematicWarningContinue}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => setShowThematicWarningModal(false)}
                >
                  Cancel
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