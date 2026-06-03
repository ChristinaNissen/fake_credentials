import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer.js";
import "./Voting-system.css";
import "./BallotConfirmation.css";
import ProcessBar from "./ProcessBar.js"; 
import { setSessionEnd, setEndTimeFirstPhase, logoutVoter } from "../API/Voter.js";


function Confirmation({ setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = async () => {
       try {
          await setEndTimeFirstPhase();
          await setSessionEnd();
          await logoutVoter();
         navigate("/studyinfo2");
       } catch (error) {
         console.error("Error during logout:", error);
       }
     };

  const steps = ["Login", "Voting", "Confirmation"];
  const currentStep = 3;

  return (
    <div className="page-wrapper">
      <main className="welcome-main">
        <ProcessBar steps={steps} currentStep={currentStep} />
        <div className="intro-container">
          <h1 className="intro-title">Confirmation</h1>
          <div className="text-main text-main-confirmation">
            You have cast your ballot succesfully! <br></br>Thank you for voting. You have completed the general election.
          </div>
        </div>
        <button className="button logout-button-confirmation"  onClick={handleLogout}>
          Logout
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default Confirmation;
