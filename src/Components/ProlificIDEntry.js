import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { addVoter, loginVoter } from "../API/Voter";

const ProlificIDEntry = () => {
  const [prolificID, setProlificID] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Secret salt for hashing
  const SECRET_SALT = "voting_system_secret_2024";

  const hashProlificID = async (id) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(id + SECRET_SALT);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!prolificID.trim()) {
      setError("Please enter your Prolific ID");
      setIsLoading(false);
      return;
    }

    try {
      const hashedID = await hashProlificID(prolificID);

      // Try to login first (in case account already exists)
      try {
        await loginVoter(hashedID, hashedID);
        console.log("Existing account - logged in");
      } catch (loginError) {
        // If login fails, create new account
        if (loginError.code === 101 || loginError.code === 205) {
          console.log("Creating new account...");
          await addVoter(hashedID, hashedID, "", "", "");
          console.log("Account created and logged in");
        } else {
          throw loginError;
        }
      }

      // Store Prolific ID in session for reference
      sessionStorage.setItem("prolificID", prolificID);

      // Navigate to StudyInfo1
      navigate("/studyinfo1");
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <main className="welcome-main">
        <h1>Welcome to the Study</h1>
        <div className="text-main login-text">
          Please enter your Prolific ID to begin.
        </div>
        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="prolificID">Prolific ID</label>
            <input
              id="prolificID"
              type="text"
              placeholder="Enter your Prolific ID"
              value={prolificID}
              onChange={(e) => setProlificID(e.target.value)}
              className="login-input"
              autoFocus
            />
            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="button button-login"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner-container">
                  <div className="spinner"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProlificIDEntry;
