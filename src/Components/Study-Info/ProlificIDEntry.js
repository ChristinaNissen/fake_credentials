import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addVoter, loginVoter } from "../../API/Voter";
import "./study-info.css";

const ProlificIDEntry = () => {
  const [prolificID, setProlificID] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProlificIDConfirmModal, setShowProlificIDConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SECRET_SALT = "voting_system_secret_2024";

  const hashProlificID = async (id) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(id + SECRET_SALT);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const continueWithProlificID = async () => {
    setIsLoading(true);
    setError("");

    const normalizedProlificID = prolificID.trim();

    if (!normalizedProlificID) {
      setError("Please enter your Prolific ID");
      setIsLoading(false);
      return;
    }

    try {
      const hashedID = await hashProlificID(normalizedProlificID);

      try {
        await loginVoter(hashedID, hashedID);
        console.log("Existing account - logged in");
      } catch (loginError) {
        if (loginError.code === 101 || loginError.code === 205) {
          console.log("Creating new account...");
          await addVoter(hashedID, hashedID, "", "", "");
          console.log("Account created and logged in");
        } else {
          throw loginError;
        }
      }

      sessionStorage.setItem("prolificID", normalizedProlificID);
      navigate("/studyinfo1");
      //navigate("/studyinfo3");
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!prolificID.trim()) {
      setError("Please enter your Prolific ID");
      return;
    }

    setShowProlificIDConfirmModal(true);
  };

  const handleConfirmProlificID = async () => {
    await continueWithProlificID();
  };

  return (
    <div className="study-center-bg">
      <div className="inner-box-info centered-info-page">
        <h2 className="h2-info-pages">Please enter your Prolific ID</h2>
        <p className="medium-body-text-info">
          Your Prolific ID is salted and hashed before it is stored. We do not store your raw Prolific ID in the database.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="prolificID" className="study-field-label study-section-spacing">Prolific ID</label>
          <div className="study-field-row">
            <input
              id="prolificID"
              type="text"
              placeholder="Enter your Prolific ID"
              value={prolificID}
              onChange={(e) => setProlificID(e.target.value)}
              className="input-field-code medium-body-text-info study-text-input"
            />
          </div>
          {error && <div className="study-error">{error}</div>}

          <button type="submit" className="study-button study-section-spacing" disabled={isLoading}>
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

        {showProlificIDConfirmModal && (
          <div className="study-modal-backdrop">
            <div className="study-modal prolific-id-confirm-modal">
            
              <p>
                Please confirm that your Prolific ID is <strong>{prolificID.trim()}</strong>
              </p>
              <div className="study-modal-actions">
                <button
                  type="button"
                  className="study-button-secondary prolific-go-back-button"
                  onClick={() => setShowProlificIDConfirmModal(false)}
                  disabled={isLoading}
                >
                  Go back
                </button>
                <button
                  type="button"
                  className="study-button prolific-confirm-button"
                  onClick={handleConfirmProlificID}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner-container">
                      <div className="spinner"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Yes, I confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProlificIDEntry;