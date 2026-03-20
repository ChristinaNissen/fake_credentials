import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ConsentForm from './Components/Study-Info/ConsentForm';
import ConsentForm2 from './Components/Study-Info/ConsenForm2';
import StudyInfo1 from './Components/Study-Info/StudyInfo1';
import Welcome from './Components/Welcome';
import Login from './Components/Login';
import VotedBefore from './Components/VotedBefore';
import Voting from './Components/Voting';
import Voting2 from './Components/Voting2';
import BallotConfirmationPicture from './Components/BallotConfirmation_Picture';
import BallotConfirmationPicture2 from './Components/BallotConfirmation_Picture2';
import VisualSelectionPicture from './Components/VisualSelection_Picture';
import StudyInfo2 from './Components/Study-Info/StudyInfo2';
import StudyInfo3 from './Components/Study-Info/StudyInfo3';
import StudyInfo4 from './Components/Study-Info/StudyInfo4';
import Navbar from './Components/Navbar';
import './App.css';
import VoteContext from "./Contexts/VoteContext";
import NoPrivateMode from './Components/NoPrivateMode';
import PrivateMode from './Components/PrivateModeWarning'; 
import Help from './Components/Help';
import Parse from "parse";


//const PARSE_APPLICATION_ID = "aFtAdHBZI5s04YUs47bPYdDTlnVrRhSI9Dpl9CJ5";
//const PARSE_HOST_URL = "https://parseapi.back4app.com/";
//const PARSE_JAVASCRIPT_KEY = "AXphTNbNhIt6mb9NK5xa2I5SKZ0UwxyBl3aAAH1u";

Parse.initialize(
  "iGNo4Zu6np1LHYw3EAufU4IuCjAvayYfy9cZr2As", // Application ID
  "1ZLNefl4GWrfi7rt9KCvUT7sNJfnZIo6WnrRcC4x"  // JavaScript Key
);
Parse.serverURL = "https://parseapi.back4app.com/";
//Parse.serverURL = PARSE_HOST_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const hideNavbarOn = ["/", "/studyinfo1", "/studyinfo2", "/studyinfo3", "/studyinfo4", "/consent", "/consent2"];
  const [userSelectedYes, setUserSelectedYes] = useState(false);
  const [hasReachedStudyInfo2, setHasReachedStudyInfo2] = useState(false); // Track if user reached studyinfo2

  // Initialize selectedImage from sessionStorage if it exists
  const [selectedImage, setSelectedImage] = useState(() => {
    const saved = sessionStorage.getItem('selectedImage');
    return saved || null;
  });
  
  const [selectedImageName, setSelectedImageName] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Save selectedImage to sessionStorage whenever it changes
  useEffect(() => {
    if (selectedImage) {
      sessionStorage.setItem('selectedImage', selectedImage);
    }
  }, [selectedImage]);

  // Track when user reaches studyinfo2
  useEffect(() => {
    if (location.pathname === '/studyinfo2') {
      setHasReachedStudyInfo2(true);
    }
  }, [location.pathname]);

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && (
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      )}

      <VoteContext.Provider value={{ userSelectedYes, setUserSelectedYes, selectedImage, setSelectedImage, selectedImageName, setSelectedImageName, selectedImageIndex, setSelectedImageIndex }}>
        <Routes>
          <Route path="/consent" element={<ConsentForm />} />
          <Route path="/" element={<ConsentForm2 />} />
          <Route path="/studyinfo1" element={<StudyInfo1 />} />
          <Route path="/studyinfo2" element={<StudyInfo2 />} />
          <Route path="/studyinfo3" element={<StudyInfo3 />} />
          <Route path="/studyinfo4" element={<StudyInfo4 />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/votedbefore" element={<VotedBefore />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/voting2" element={<Voting2  />} />
           <Route path="/confirmation" element={
            hasReachedStudyInfo2 ? <Navigate to="/studyinfo2" replace /> : <BallotConfirmationPicture setIsLoggedIn={setIsLoggedIn} />
          } />
          <Route path="/confirmation2" element={
            hasReachedStudyInfo2 ? <Navigate to="/studyinfo2" replace /> : <BallotConfirmationPicture2 setIsLoggedIn={setIsLoggedIn} />
          } />
          <Route path="/selection" element={<VisualSelectionPicture />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/private-mode" element={<NoPrivateMode/>} />
          <Route path="/private-mode2" element={<PrivateMode/>} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </VoteContext.Provider>
    </>
  );
}

export default App;
