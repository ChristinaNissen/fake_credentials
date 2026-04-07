import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './study-info.css';

const ConsentForm = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChangeCheckbox = (e) => setChecked(e.target.checked);

  const handleStart = () => {
    setIsSubmitting(true);
    // Simulate async action, then navigate
    setTimeout(() => {
      navigate('/studyinfo1');
    }, 500);
  };

  return (
    <div className="study-center-bg">
      <div className="inner-box-info padding-top-info-page" style={{ maxWidth: "35rem" }}>
        <h1 className="h1-info-pages">Welcome to our study!</h1>
        <p>
          The purpose of this study is to investigate user experience in an online voting system intended for general elections. Before proceeding, we ask for your consent.
        </p>
        <h3 className="title-margin-top">Description of research</h3>
        <p>
          Before entering the voting system, you will be asked to download an
          instruction paper for the voting system and instructed which task to complete.
          This will be followed by a short questionnaire, which you will get
          redirected to from the last page of the voting system.
          Once you have completed the study tasks in the voting system, you will be redirected to Prolific. The
          total duration of the study is approximately 5 minutes. We highly
          recommend using a desktop device for the study.
        </p>
        <h3>Withdrawal</h3>
        <p>
          You can withdraw your consent about being part of the study at any
          time before the completion of the study, meaning before you submit the
          survey. In this case your collected data will be deleted by the
          researchers. For more information on how to withdraw from a study
          before completion in Prolific, see this link:{" "}
          <a
            className="info-link"
            href="https://participant-help.prolific.com/en/articles/445041-how-to-return-a-submission-on-prolific"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://participant-help.prolific.com/en/articles/445041-how-to-return-a-submission-on-prolific
          </a>
          After completing the study, you may still request to have your data deleted until 14 days after submitting the survey by contacting the researchers and providing your Prolific ID, which allows us to locate and remove your data. After this deadline, it will no longer be possible to delete your data.
        </p>
          <h3 className="title-margin-top">Ethical considerations and your wellbeing</h3>
        <p>
The voting system you are testing is designed to help prevent coercion in online voting. During the study, you may encounter situations that explore how the system handles different voting scenarios. If you experience any discomfort or distress at any point, you can leave the study without any penalty.        </p>
        <h3 className="title-margin-top">Compensation</h3>
        <p>
          Each participant will receive 0.75 £ at the conclusion of the study
          through Prolific.
        </p>
        <h3 className="title-margin-top">How we handle and delete the data</h3>
        <p>
          If a participant discloses any personal information about themselves
          or other people in the voting system, the researchers will remove this from the dataset and
          replace it with a placeholder.{" "}
        </p>
        <h3 className="title-margin-top">What data we collect</h3>
        <p >
          We collect the data that the participants are asked to provide within
          the voting system. Please note that all candidates on the digital
          voting paper are fictional and the participants are asked to vote for
          a specific candidate before they enter the voting system. Therefore,
          we do not collect any sensitive personal data on political interests.
        </p>
        <h3 className="title-margin-top">How we use the data</h3>
        <p>
          We collect and process your data for research purposes under the public interest legal basis. 
          These data will be used to derive statistical measures of users'
          attitudes towards internet voting systems, as well as qualitative insights from open-ended responses.. The data might be
          referenced or quoted, but not printed in full unless it is completely
          anonymized, in the published research reports and other academic
          publications.
        </p>
        <h3 className="title-margin-top">Who has access to the data?</h3>
        <p>
          The researchers have access to the original data until it has been
          edited to replace given personal information with placeholders as to
          anonymize it.
        </p>
        <h3 className="title-margin-top">Third parties</h3>
        <p>
          We use the following third party services in connection with this
          study:
        </p>
        <ul>
        
          <li className="text-margin-top">
            <span className="bold-text">Vercel:</span> We use Vercel to host
            the voting system. Vercel might collect your IP address and other
            personal data, however, we will not have access to this data and
            Vercel is not sharing any IP addresses or other personal data.
            Please refer to Vercel’s privacy policy for more information:{" "}
            <a
              className="info-link"
              href="https://vercel.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://vercel.com/privacy
            </a>
          </li>
          <li className="text-margin-top">
            <span className="bold-text">Back4App:</span> We use Back4App to
            store data connected to your testing of the voting system. This data
            is not considered personal (unless you choose to disclose
            identifying information about yourself when using the voting
            system). Back4app might collect personal data which we will not have
            access to. Please refer to Back4App’s privacy policy for more
            information:{" "}
            <a
              className="info-link"
              href="https://www.back4app.com/privacy.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.back4app.com/privacy.pdf
            </a>
          </li>

             <li className="text-margin-top">
            <span className="bold-text">SurveyXact:</span> We use SurveyXact to
            carry out the survey. Personal data (gender, age, nationality, level
            of education) will be collected through the questions and stored on
            the SurveyXact platform. Please refer to SurveyXact’s privacy
            policy for more information:{" "}
            <a
              className="info-link"
              href="https://www.surveyxact.com/product/data-security/"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.surveyxact.com/product/data-security/
            </a>
          </li>
          
        </ul>
        <h3 className="title-margin-top">Researchers</h3>
        <ul>
          <li>
            Christina Nissen (
            <a
              className="info-link"
              href="mailto:chfn@itu.dk"
              target="_blank"
              rel="noopener noreferrer"
            >
              chfn@itu.dk
            </a>
            )
          </li>
          <li>
            Oksana Kulyk (
            <a
              className="info-link"
              href="mailto:okku@itu.dk"
              target="_blank"
              rel="noopener noreferrer"
            >
              okku@itu.dk
            </a>
            )
          </li>
        </ul>
        <p className="text-margin-top">
          Researchers at the IT University of Copenhagen
        </p>
        <h3 className="title-margin-top">Questions</h3>
        <p>
          For any questions concerning our processing of your personal data,
          please contact one of the students involved in the project (see
          contact details above).
        </p>
        <div className="checkbox-container" style={{ margin: "2rem 0" }}>
          <label className="check-box">
            <input
              type="checkbox"
              checked={checked}
              onChange={handleChangeCheckbox}
              id="checkBox-vote-info"
            />
            I consent to serve as a subject in the research investigation
            described above. I confirm that I am fluent in English.
          </label>
        </div>
        <button
          onClick={handleStart}
          className="study-button"
          disabled={!checked || isSubmitting}
          id="submit-button"
        >
          {isSubmitting ? "Loading..." : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ConsentForm;
