import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./study-info.css";
import Instructions from "../../Assets/Voting_System_Instructions.pdf";
import { downloadFile } from "../../util";
import getCurrentUser, { markRegularPasswordAsSaved, markVotingInstructionsAsDownloaded } from "../../API/Voter.js";

const VALID_COLOURS = [
  "red", "blue", "green", "yellow", "orange", "purple", "pink", "black",
  "white", "grey", "gray", "brown", "violet", "indigo", "cyan", "magenta",
  "turquoise", "teal", "gold", "silver", "beige", "ivory", "coral", "salmon",
  "maroon", "navy", "olive", "lime", "aqua", "fuchsia", "crimson", "lavender",
  "mint", "peach", "rose", "amber", "jade", "lilac", "tan", "khaki",
];

const STUDY_INFO1_LOCK_KEY = "studyInfo1Locked";

const generateRegularPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

const createCredentials = () => {
  const regularPassword = generateRegularPassword();
  const thematicPassword = VALID_COLOURS[Math.floor(Math.random() * VALID_COLOURS.length)];
  return { regularPassword, thematicPassword };
};

const StudyInfo1 = () => {
  const [selectedTaskOption, setSelectedTaskOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordReminderModal, setShowPasswordReminderModal] = useState(false);
  const [credentials] = useState(createCredentials);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove legacy browser-stored credentials from earlier versions.
    sessionStorage.removeItem("studyRegularPassword");
    sessionStorage.removeItem("studyThematicPassword");

    if (sessionStorage.getItem(STUDY_INFO1_LOCK_KEY) === "1") {
      navigate("/welcome", { replace: true });
      return;
    }

    window.scrollTo(0, 0);
  }, [navigate]);

  const handleTaskOptionChange = (event) => {
    const { value } = event.target;
    setSelectedTaskOption(value);
  };

  const downloadInstructions = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await markVotingInstructionsAsDownloaded();
    } catch (error) {
      console.error("Failed to mark voting instructions as downloaded:", error);
    }

    downloadFile(Instructions, "General-Election-2025.pdf");
  };

  const downloadRegularPasswordFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await markRegularPasswordAsSaved();
    } catch (error) {
      console.error("Failed to mark regular password as saved:", error);
    }

    const fileContent = [
      `Regular password: ${credentials.regularPassword}`,
      "",
      "This study runs in two phases.",
      "Keep this regular password for phase 2.",
      "Do not store your thematic password.",
    ].join("\n");

    const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(fileContent)}`;
    downloadFile(dataUri, "study-regular-password.txt");
  };

  const startStudy = async () => {

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
      sessionStorage.setItem(STUDY_INFO1_LOCK_KEY, "1");
      navigate("/welcome");
    }, 500);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (isSubmitting || !selectedTaskOption) {
      return;
    }
    setShowPasswordReminderModal(true);
  };

  const handleConfirmStart = async () => {
    if (isSubmitting) {
      return;
    }
    setShowPasswordReminderModal(false);
    await startStudy();
  };

  const startDisabled = !selectedTaskOption || isSubmitting;

  return (
    <div className="study-center-bg">
        <div className="inner-box-info padding-top-info-page study-narrow-content">

        <h1>Study Instructions</h1>
                  <hr className="step-divider" />

        <form onSubmit={handleStart}>
          {/* Step 1 */}
          <div className="step-row">
            <div className="step-number">1</div>
            <div className="step-content">
              <p>
                Imagine that today is the day of a general election in your country. You are at home, using your own device, and have decided to vote through an online voting system designed to make participation easier and more accessible.
              </p>
              <p>
                You have already decided to support the candidate John Doe. Please use the online voting system to go through the process and cast your vote for this candidate, just as you would if this were a real election.
              </p>
              <div className="study-task-box">
                <p className="study-task-heading">Your task</p>
                <ul className="study-task-list">
                  <li><strong>Cast your vote for John Doe</strong></li>
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
                Download instructions
              </button>
            </div>
          </div>
          
          <hr className="step-divider" />

          {/* Step 3 - Passwords */}
          <div className="step-row">
            <div className="step-number">3</div>
            <div className="step-content">
              <p>
                You have been assigned the following passwords for this study. You will need these to log in to the voting system.
              </p>
              <div className="study-task-box study-credentials-box">
                <p className="study-task-heading">Your passwords</p>
                <div className="study-credential-row">
                  <span className="study-credential-label">Regular password:</span>
                  <span className="study-credential-value">{credentials.regularPassword}</span>
                </div>
                <div className="study-credential-row">
                  <span className="study-credential-label">Thematic password:</span>
                  <span className="study-credential-value">{credentials.thematicPassword}</span>
                </div>
              </div>
              <p>
                We highly recommend that you save your regular password. For security reasons, please do not store the thematic password.
              </p>
              <button
                type="button"
                onClick={downloadRegularPasswordFile}
                className="study-button study-button-tight-spacing"
              >
                Download regular password
              </button>
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
                    Cast your vote for Sofia Lee.
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

        {showPasswordReminderModal && (
          <div className="study-modal-backdrop">
            <div className="study-modal prolific-id-confirm-modal">
              <p>
                Before you continue, please confirm that you have stored your regular password.
              </p>

              <div className="study-modal-actions">
                <button
                  type="button"
                  className="study-button-secondary prolific-go-back-button"
                  onClick={() => setShowPasswordReminderModal(false)}
                >
                  Go back
                </button>
                <button
                  type="button"
                  className="study-button prolific-confirm-button"
                  onClick={handleConfirmStart}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Yes, I confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
  );
};

export default StudyInfo1;
