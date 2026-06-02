import React from "react";
import "./ProcessBar.css";

const ProcessBar = ({ steps, currentStep }) => {
  return (
    <div className="process-bar-container">
      <div className="icon-row">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          let circleStatus = "";
          if (stepNumber < currentStep) circleStatus = "completed";
          else if (stepNumber === currentStep) circleStatus = "active";

          return (
            <React.Fragment key={index}>
              <div className="process-step">
                <div className="step-icon-container">
                  <div className={`step-icon ${circleStatus}`}>
                    {stepNumber}
                  </div>
                </div>
                <div className="step-label">{step}</div>
              </div>
              {index !== steps.length - 1 && (
                <div className="step-divider-container">
                  <div
                    className={`step-divider ${
                      index < currentStep - 1 ? "completed" : ""
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessBar;