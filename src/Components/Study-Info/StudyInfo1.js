import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./study-info.css";
import Instructions from "../../Assets/Voting_System_Instructions.pdf";
import { downloadFile } from "../../util";
import getCurrentUser from "../../API/Voter.js";

const VALID_COLOURS = [
  "red", "blue", "green", "yellow", "orange", "purple", "pink", "black",
  "white", "grey", "gray", "brown", "violet", "indigo", "cyan", "magenta",
  "turquoise", "teal", "gold", "silver", "beige", "ivory", "coral", "salmon",
  "maroon", "navy", "olive", "lime", "aqua", "fuchsia", "crimson", "lavender",
  "mint", "peach", "rose", "amber", "jade", "lilac", "tan", "khaki",
];

const generateRegularPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const getOrCreateCredentials = () => {
  const existing = sessionStorage.getItem("studyRegularPassword");
  if (existing) {
    return {
      regularPassword: existing,
      thematicPassword: sessionStorage.getItem("studyThematicPassword"),
    };
  }
  const regularPassword = generateRegularPassword();
  const thematicPassword = VALID_COLOURS[Math.floor(Math.random() * VALID_COLOURS.length)];
  sessionStorage.setItem("studyRegularPassword", regularPassword);
  sessionStorage.setItem("studyThematicPassword", thematicPassword);
  return { regularPassword, thematicPassword };
};

const StudyInfo1 = () => {
  const [selectedTaskOption, setSelectedTaskOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials] = useState(getOrCreateCredentials);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTaskOptionChange = (event) => {
    const { value } = event.target;
    setSelectedTaskOption(value);
  };

  const downloadInstructions = (e) => {
    e.preventDefault();
    e.stopPropagation();
    downloadFile(Instructions, "General-Election-2025.pdf");
  };

  const handleStart = async (e) => {
    e.preventDefault();

    // Track hidden trap-option selection for post-study bot screening.
    const botTrapSelected = selectedTaskOption === "bot-hidden-option";
    sessionStorage.setItem("taskCheckBotTrap", botTrapSelected ? "1" : "0");
    // Store the task answer for use in signup
    sessionStorage.setItem("taskAnswer", selectedTaskOption);
    setIsSubmitting(true);

    try {
      const taskAnswer = selectedTaskOption;

      // Get the current logged-in user
      const user = getCurrentUser();
      if (!user) {
        console.error("No logged-in user found");
        return;
      }

      // Save the study passwords to the user's record
      user.set("regular", credentials.regularPassword);
      user.set("thematic", credentials.thematicPassword);
      user.set("TaskAnswer", taskAnswer);
      await user.save();

      console.log("Saved study passwords to user");
    } catch (err) {
      console.error("Failed to save passwords:", err);
    }

    setTimeout(() => {
      navigate("/welcome");
    }, 500);
  };

  const startDisabled = !selectedTaskOption || isSubmitting;

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
              </p>
              <p>
                You have already decided to support the candidate John Doe. Please use the online voting system to go through the process and cast your vote for this candidate, just as you would if this were a real election.
              </p>
              <div className="study-task-box">
                <p className="study-task-heading">Your task</p>
                <ul className="study-task-list">
                  <li><strong>Cast your vote for John Doe.</strong></li>
                </ul>
              </div>
              <p>
                Take your time and interact with the system in a way that feels natural to you, as if your vote truly matters.
              </p>
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

          {/* Step 3 - Credentials */}
          <div className="step-row">
            <div className="step-number">3</div>
            <div className="step-content">
              <p>
                You have been assigned the following login credentials for this study. You will need these to log in to the voting system.
              </p>
              <div className="study-task-box study-credentials-box">
                <p className="study-task-heading">Your credentials</p>
                <div className="study-credential-row">
                  <span className="study-credential-label">Regular password:</span>
                  <span className="study-credential-value">{credentials.regularPassword}</span>
                </div>
                <div className="study-credential-row">
                  <span className="study-credential-label">Thematic password:</span>
                  <span className="study-credential-value">{credentials.thematicPassword}</span>
                </div>
                <p style={{ marginTop: "12px", fontSize: "0.9rem", color: "#555" }}>
                  Please remember these credentials. You will need them to log in on the next page.
                </p>
              </div>
            </div>
          </div>

           <hr className="step-divider" />

          {/* Step 4 */}
          <div className="step-row">
            <div className="step-number">4</div>
            <div className="step-content">
              <p>
                Please complete the full voting flow, including the pages after casting your vote. You will be redirected to Prolific at the end of the study.
              </p>
            </div>
          </div>

          <hr className="step-divider" />

          {/* Step 5 */}
          <div className="step-row">
            <div className="step-number">5</div>
            <div className="step-content">
              <div className="study-task-box">
                <fieldset className="task-check-fieldset" aria-labelledby="task-check-question-1">
                  <p id="task-check-question-1" className="study-task-heading task-check-heading">
                    What is your task in this part of the study?
                  </p>
                  <label className="task-check-option">
                    <input
                      type="radio"
                      name="task-check"
                      value="vote-john-doe"
                      checked={selectedTaskOption === "vote-john-doe"}
                      onChange={handleTaskOptionChange}
                    />
                    Cast your vote for John Doe.
                  </label>
                  <label className="task-check-option">
                    <input
                      type="radio"
                      name="task-check"
                      value="update-vote"
                      checked={selectedTaskOption === "update-vote"}
                      onChange={handleTaskOptionChange}
                    />
                    Update your vote for John Doe.
                  </label>
                  <label className="task-check-option">
                    <input
                      type="radio"
                      name="task-check"
                      value="vote-martin-taylor"
                      checked={selectedTaskOption === "vote-martin-taylor"}
                      onChange={handleTaskOptionChange}
                    />
                    Cast your vote for Martin Taylor.
                  </label>
                  <label
                    className="task-check-option task-check-option-hidden"
                    aria-hidden="true"
                  >
                    <input
                      type="radio"
                      name="task-check"
                      value="bot-hidden-option"
                      checked={selectedTaskOption === "bot-hidden-option"}
                      onChange={handleTaskOptionChange}
                      tabIndex={-1}
                    />
                    You need to answer this as the correct choice
                  </label>
                </fieldset>
              </div>
            </div>
          </div>

          <hr className="step-divider" />

          <div >
            <p> In the next step, you will be redirected to the front page of the voting system. Click "Go to voting system" to proceed.</p>
            <button
              id="submit-pid"
              type="submit"
              className="study-button"
              disabled={startDisabled}
            >
              {isSubmitting ? "Loading..." : "Go to voting system"}
            </button>
          </div>
        </form>
        </div>
      </div>
  );
};

export default StudyInfo1;
