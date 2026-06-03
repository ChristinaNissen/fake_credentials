import React, { useEffect, useState } from "react";
import { logoutVoter } from "../../API/Voter";
import "./study-info.css";

const StudyInfoPasswordForgotten = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Prevent browser back button
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

  return (
    <div className="study-center-bg">
      <div className="inner-box-info centered-info-page">
        <h2 className="h2-info-pages">Unable to remember your password</h2>

        <p className="medium-body-text-info">
          Don't worry, this is completely normal and not a problem for the study.
        </p>

        <p className="medium-body-text-info">
          Many participants find it difficult to remember newly assigned credentials.
          Your participation is still valuable to us.
        </p>

        <p className="medium-body-text-info">
          Please continue to a short survey where you can share your experience with the system.
        </p>

        <button
          className="study-button"
          style={{ marginTop: "2rem" }}
          onClick={() => setShowConfirmModal(true)}
        >
          Continue to survey
        </button>

        {showConfirmModal && (
          <div className="study-modal-backdrop">
            <div className="study-modal study-info-confirm-modal">
              <h2>Continue to survey</h2>
              <p>
                You will be redirected to the survey. Thank you for your participation in this study.
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

export default StudyInfoPasswordForgotten;
