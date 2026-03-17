import React, { useEffect } from "react";
import { logoutVoter } from "../../API/Voter";
import "./study-info.css";

const StudyInfo2 = () => {
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

  return (
    <div className="study-center-bg">
      <div className="inner-box-info centered-info-page">
        <h2 className="h2-info-pages">Thank you for participating!</h2>
        <p className="medium-body-text-info">
          Congratulations! You have successfully completed this part of the study.
        </p>
        
        <p className="medium-body-text-info">
          We might invite you back to participate in the next part of the study within the next 12 hours. 
        </p>

        <p className="medium-body-text-info">
          You can return to Prolific by clicking the button below.
        </p>

        <button
          className="study-button"
          style={{ marginTop: "2rem" }}
          onClick={async () => {
            await logoutVoter();
            window.location.href = "https://app.prolific.com/submissions/complete?cc=C1Q49A6X";
          }}
        >
          Return to Prolific
        </button>
      </div>
    </div>
  );
};

export default StudyInfo2;
