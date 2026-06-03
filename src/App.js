import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ConsentForm from './Components/Study-Info/ConsentForm';
import ConsentForm2 from './Components/Study-Info/ConsenForm2';
import StudyInfo1 from './Components/Study-Info/StudyInfo1';
import Welcome from './Components/Welcome';
import Login2 from './Components/Login2';
import Voting from './Components/Voting';
import Confirmation from './Components/Confirmation';
import StudyInfo2 from './Components/Study-Info/StudyInfo2';
import StudyInfo3 from './Components/Study-Info/StudyInfo3';
import StudyInfo4 from './Components/Study-Info/StudyInfo4';
import Navbar from './Components/Navbar';
import './App.css';
import VoteContext from "./Contexts/VoteContext";
import NoPrivateMode from './Components/NoPrivateMode';
import Help from './Components/Help';
import Parse from "parse";


//const PARSE_APPLICATION_ID = "aFtAdHBZI5s04YUs47bPYdDTlnVrRhSI9Dpl9CJ5";
//const PARSE_HOST_URL = "https://parseapi.back4app.com/";
//const PARSE_JAVASCRIPT_KEY = "AXphTNbNhIt6mb9NK5xa2I5SKZ0UwxyBl3aAAH1u";

Parse.initialize(
  "n8mNDsedLNQgBQQ00wGYASqJ3RONsEM18BfXTkBb", // Application ID
  "MS3craonsJvGMNjx1hnWmR50scge1Izu7kd4JXj2"  // JavaScript Key
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
          <Route path="/login" element={<Login2 setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/voting" element={<Voting />} />
           <Route path="/confirmation" element={
            hasReachedStudyInfo2 ? <Navigate to="/studyinfo2" replace /> : <Confirmation setIsLoggedIn={setIsLoggedIn} />
          } />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/private-mode" element={<NoPrivateMode/>} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </VoteContext.Provider>
    </>
  );
}

export default App;
