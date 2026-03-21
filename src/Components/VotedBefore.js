import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoteContext from "../Contexts/VoteContext";
import ProcessBar from "./ProcessBar";
import Footer from "./Footer";
import { saveVotedBefore } from "../API/Voter";
import "./Voting-system.css";
import "./VotedBefore.css";

const VotedBefore = () => {
  const navigate = useNavigate();
  const { setUserSelectedYes } = useContext(VoteContext);
  const [selected, setSelected] = useState(null);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (value) => {
    if (selected === value) {
      setSelected(null);
    } else {
      setSelected(value);
    }
  };

  const handleNext = async () => {
     if (selected === null) {
      setShowError(true);
      return;
    }
    setIsLoading(true);
    try {
      if (selected === true) {
        setUserSelectedYes(true);
        await saveVotedBefore(true);
        navigate("/selection");
      } else if (selected === false) {
        setUserSelectedYes(false);
        await saveVotedBefore(false);
        navigate("/voting");
        //navigate("/voting2");
      }
    } catch (error) {
      console.error("Error saving vote:", error);
      setIsLoading(false);
    }
  };

  const stepsNo = ["Voted Before", "Voting", "Confirmation"];
  const stepsYes = ["Voted Before", "Identification of Previous Ballots", "Voting", "Confirmation"];

  return (
    <div className="page-wrapper">
      <main className="welcome-main" >
        <ProcessBar steps={selected ? stepsYes : stepsNo} currentStep={1} />
        <h1 className="voted-before-h1">Have you voted before in this election?</h1>
        <div className="text-main text-voted-before" style={{ marginBottom: "1px" }}>
          Please select below whether you have voted in this election before or not.
        </div>
        <div className="security-box-voted-before">
          <p className="text-small">
            <strong>Security Feature:</strong><br />
            This step ensures that you can update your vote. If this is your first time voting in this election, click "<strong>No</strong>" below. If you want to update your previous vote, click "<strong>Yes</strong>" below, then identify your previous vote(s) by selecting the pictures you have seen before, and cast your new vote.        </p>
        </div>
        <div className="card-wide voted-before" style={{ padding: "40px 20px" }}>
          <div className="box-container">
            <div
              className={`yellow-box ${selected === false ? "selected" : ""}`}
              onClick={() => handleSelect(false)}
            >
              <p className="text-small">
                <strong>No</strong>
                <br />
                This is my first time voting in this election
              </p>
            </div>

             <div
              className={`yellow-box ${selected === true ? "selected" : ""}`}
              onClick={() => handleSelect(true)}
            >
              <p className="text-small">
                <strong>Yes</strong>
                <br />
                I have voted before in this election
              </p>
            </div>
          </div>
        </div>
          <div>
        <button 
          className="button next-voted-before" 
          onClick={handleNext}
          disabled={isLoading}
        >
            {isLoading ? "Processing..." : "Next"}
          </button>
           </div>



        {showError && (
          <div className="error-overlay">
            <div className="error-message">
              <p>Please select an option</p>
              <button className="button" onClick={() => setShowError(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default VotedBefore;