import React, { useState, useEffect } from "react";
import { getUserID, logoutVoter } from "../../API/Voter";
import "./study-info.css";

const StudyInfo2 = () => {
  const [userID, setUserID] = useState(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
    window.scrollTo(0, 0);
    
    // Prevent browser back button from leaving studyinfo2 page
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
    };
    
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  useEffect(() => {
    const fetchUserID = async () => {
      const id = await getUserID();
      setUserID(id);
    };
    fetchUserID();
  }, []);


  function copyIdToClipBoard() {
    if (userID) {
      navigator.clipboard.writeText(userID);
      setShowCopiedMessage(true);
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 3000); // Hide after 3 seconds
    }
  }

  return (
    <div className="study-center-bg">
      <div className="inner-box-info centered-info-page">
        <h2 className="h2-info-pages">Please continue to the next platform</h2>
        <p className="medium-body-text-info">
          You have finished using the online voting system.
        </p>

        <p className="medium-body-text-info">
          To connect your voting results with your response on the next platform,
          please copy the number below and paste it as the first step after you
          click the button.
        </p>

        <div style={{ marginTop: "2rem", width: "80%", position: "relative" }}>
          <input
            type="text"
            readOnly
            value={userID || ''}
            className="input-field-code medium-body-text-info"
            style={{ 
              width: "100%", 
              paddingRight: "3.5rem",
              padding: "12px 3.5rem 12px 12px",
              border: "1.5px solid #d1d5db",
              borderRadius: "8px",
              backgroundColor: "#f7f7f7",
              boxSizing: "border-box"
            }}
          />
          <button
            type="button"
            className="copy-button"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              height: "2.2rem",
              width: "2.2rem",
              border: "none",
              background: "#1976d2",
              color: "#fff",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem"
            }}
            onClick={copyIdToClipBoard}
            aria-label="Copy code"
            title="Copy code"
          >
            📋
          </button>
          {showCopiedMessage && (
            <div className="copied-tooltip">
              Successfully copied ✓ 
            </div>
          )}
        </div>

         <button
          className="study-button"
          style={{ marginTop: "2rem" }}
          onClick={() => setShowConfirmModal(true)}
        >
          Go to next platform
        </button>

        {showConfirmModal && (
          <div className="study-modal-backdrop">
            <div className="study-modal study-info-confirm-modal">
              <h2>Important</h2>
              <p>
                Once you proceed to the next platform, you may not be able to return to retrieve your number. Please make sure you have copied it before continuing.
              </p>
              <div className="study-modal-actions">
                <button
                  className="study-button-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="study-button"
                  onClick={async () => {
                    setShowConfirmModal(false);
                    await logoutVoter();
                    window.location.href =
                      "https://www.survey-xact.dk/LinkCollector?key=HZU52L1VLJ9K&condition=1.0&longvarnames=";
                  }}
                >
                  I understand
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyInfo2;
