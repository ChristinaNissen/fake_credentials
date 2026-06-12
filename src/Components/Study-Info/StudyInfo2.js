import React, { useState, useEffect } from "react";
import { getUserID, logoutVoter, setSessionEnd } from "../../API/Voter";
import "./study-info.css";

const StudyInfo2 = () => {
  const [userID, setUserID] = useState(null);
  const [showCodeUnavailableMessage, setShowCodeUnavailableMessage] = useState(false);
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

      if (id) {
        setUserID(id);
      } else {
        setShowCodeUnavailableMessage(true);
      }
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
        <h2 className="h2-info-pages">Please continue to the survey</h2>
        <p className="medium-body-text-info">
          You have finished using the online voting system.
        </p>

        <p className="medium-body-text-info">
          To complete the study, please fill out a short survey.
        </p>
        <p className="medium-body-text-info">
          We need to be able to connect your results from the voting system with
          the survey. Therefore, you have to copy the number just below and
          paste it into the survey as the very first thing, after you click the button
          below. If no number appears, please proceed to the survey without it.
        </p>

        <div className="study-field-row study-section-spacing">
          <input
            type="text"
            readOnly
            value={userID || ''}
            className="input-field-code medium-body-text-info study-code-input"
          />
          <button
            type="button"
            className="copy-button"
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

        {showCodeUnavailableMessage && (
          <p className="medium-body-text-info study-subtle-spacing">
            We could not retrieve your number. Please proceed to the survey without it.
          </p>
        )}

         <button
          className="study-button study-section-spacing"
          onClick={() => setShowConfirmModal(true)}
        >
          Go to survey
        </button>

        {showConfirmModal && (
          <div className="study-modal-backdrop">
            <div className="study-modal study-info-confirm-modal">
              <h2>Important</h2>
              <p>
                Once you proceed to the survey, you may not be able to return to retrieve your number. Please make sure you have copied it before continuing.
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
                    await setSessionEnd();
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
