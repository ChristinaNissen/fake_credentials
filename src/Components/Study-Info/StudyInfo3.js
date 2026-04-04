import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./study-info.css";
import Instructions from "../../Assets/Voting_System_Instructions.pdf";
import { downloadFile } from "../../util";

const StudyInfo3 = () => {
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
Imagine that the general election in your country is still ongoing, and that voters can access the system at any time during the election period to update their vote for flexibility.
<br></br>
<br></br>
Earlier in the election period, you used this system to cast your vote for John Doe.
<br></br>
<br></br>
Now imagine that some time has passed. After having already voted, you are faced with a situation where another person attempts to pressure you to vote for another candidate, without knowing that you have already voted.
<br></br>
<br></br>
The system includes built-in security features designed to help voters protect their original vote in situations like this. For this task, please use the system’s security feature to protect your original vote for John Doe.
<br></br>
<br></br>
Take your time and complete the process as you would in a real-life situation.

 </p>
              <label className="check-box blue-bg-highlight">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleChangeCheckbox}
                  className="blue-bg-highlight"
                />
I understand that I should use the system’s security feature to protect my original vote for 'John Doe' in the election.      </label>
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
              <p className="text-margin-top">
                <span className="blue-bg-highlight">
                  Make sure that you can access the letter throughout the study.
                </span>
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
                Please complete the full voting flow and the following survey. You will be redirected to Prolific at the end of the study.
              </p>
            </div>
          </div>

          <hr className="step-divider" />

          <div>
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

export default StudyInfo3;
