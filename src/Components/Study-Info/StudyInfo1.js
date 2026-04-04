import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./study-info.css";
import Instructions from "../../Assets/Voting_System_Instructions.pdf";
import { downloadFile } from "../../util";

const StudyInfo1 = () => {
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChangeCheckbox = () => setChecked((prev) => !prev);

  const downloadInstructions = (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadFile(Instructions, "General-Election-2025.pdf");
  };

  const handleStart = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      navigate("/welcome");
    }, 500);
  };

  const startDisabled = !checked || isSubmitting;

  return (
    <div className="study-center-bg">
        <div className="inner-box-info padding-top-info-page" style={{ maxWidth: "35rem" }}>

        <h1>Before you start</h1>
                  <hr className="step-divider" />

        <form onSubmit={handleStart}>
          {/* Step 1 */}
          <div className="step-row">
            <div className="step-number">1</div>
            <div className="step-content">
              <p>
Imagine that today is the day of a general election in your country. You are at home, using your own device, and have decided to vote through a newly introduced online voting system designed to make participation easier and more accessible.
<br></br>
<br></br>
You have already decided to support the candidate John Doe. Please use the online voting system to go through the process and cast your vote for this candidate, just as you would if this were a real election.
<br></br>
<br></br>
Take your time and interact with the system in a way that feels natural to you, as if your vote truly matters.
              </p>
              <label className="check-box blue-bg-highlight">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleChangeCheckbox}
                  className="blue-bg-highlight"
                />
I understand that I should vote for “John Doe” in the election.
              </label>
            </div>
          </div>

          <hr className="step-divider" />

          {/* Step 2 */}
          <div className="step-row">
            <div className="step-number">2</div>
            <div className="step-content">
            <p>
                Please download the instructions which you need to follow to complete the General Election 2025.
         
              
                In a real election you would get these instructions as a physical or digital letter by the election authorities.
            </p>
            
              <button
                type="button"
                onClick={downloadInstructions}
                className="study-button"
              >
                Download
              </button>
            </div>
          </div>
          
           <hr className="step-divider" />

          {/* Step 3 */}
          <div className="step-row">
            <div className="step-number">3</div>
            <div className="step-content">
              <p>
                Please complete the full voting flow, including the pages after casting your vote. You will be redirected to Prolific at the end of the study.
              </p>
            </div>
          </div>

          <hr className="step-divider" />

          <div >
            <p> In the next step, you will be redirected to the front page of the voting system. Click “Start” to proceed.</p>
            <button
              id="submit-pid"
              type="submit"
              className="study-button"
              disabled={startDisabled}
            >
              {isSubmitting ? "Loading..." : "Start"}
            </button>
          </div>
        </form>
        </div>
      </div>
  );
};

export default StudyInfo1;
