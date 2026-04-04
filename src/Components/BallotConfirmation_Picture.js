import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./Voting-system.css";
import "./BallotConfirmation.css";
import ProcessBar from "./ProcessBar.js"; 
import { useLocation } from "react-router-dom";
import VoteContext from "../Contexts/VoteContext";
import { saveVisuaRepresentation, setSessionEnd, setEndTimeFirstPhase } from "../API/Voter";

// Import your images
//import img4 from "../Images/alligator.jpg";
//import img5 from "../Images/alpaca.jpg";
/*
import img6 from "../Images/Apples.png";
import img7 from "../Images/aquarium.jpg";
import img8 from "../Images/baby.jpg";
import img9 from "../Images/bacon.jpg";
import img10 from "../Images/ball.jpg";
import img11 from "../Images/balloon.jpg";
import img12 from "../Images/banana.jpg";
import img13 from "../Images/basketball.jpg";
import img14 from "../Images/beachball.jpg";
import img15 from "../Images/bead.jpg";
import img16 from "../Images/beanie.jpg";
import img17 from "../Images/bear.jpg";
import img18 from "../Images/beer.jpg";
import img19 from "../Images/bat.jpg";
import img20 from "../Images/bee.jpg";
import img21 from "../Images/beetle.jpg";
import img22 from "../Images/bell_pepper.jpg";
import img23 from "../Images/berry.jpg";
import img24 from "../Images/birthday.jpg";
import img25 from "../Images/bouquet.jpg";
import img26 from "../Images/bow.jpg";
import img27 from "../Images/bowl.jpg";
import img28 from "../Images/broccoli.jpg";
import img29 from "../Images/butterfly.jpg";
import img30 from "../Images/calf.jpg";
import img31 from "../Images/camera.jpg";
import img32 from "../Images/candle.jpg";
import img33 from "../Images/candy_cane.jpg";
import img34 from "../Images/candy.jpg";
import img35 from "../Images/carousel.jpg";
import img36 from "../Images/carriage.jpg";
import img37 from "../Images/carrot.jpg";
import img38 from "../Images/cat.jpg";
import img39 from "../Images/caviar.jpg";
import img40 from "../Images/cereal.jpg";
import img41 from "../Images/champagne.jpg";
import img42 from "../Images/cheeseburger.jpg";
import img43 from "../Images/chick.jpg";
import img44 from "../Images/chicken.jpg";
import img45 from "../Images/chips.jpg";
import img46 from "../Images/christmas_tree.jpg";
import img47 from "../Images/cobra.jpg";
import img48 from "../Images/coffee.jpg";
import img49 from "../Images/confetti.jpg";
import img50 from "../Images/crab.jpg";
import img51 from "../Images/crow.jpg";
import img52 from "../Images/crepe.jpg";
import img53 from "../Images/cucumber.jpg";
import img54 from "../Images/cushion.jpg";
import img55 from "../Images/dart.jpg";
import img56 from "../Images/deodorant.jpg";
import img57 from "../Images/dice.jpg";
import img58 from "../Images/dog.jpg";
import img59 from "../Images/dolphin.jpg";
import img60 from "../Images/dough.jpg";
import img61 from "../Images/eagle.jpg";
import img62 from "../Images/egg.jpg";
import img63 from "../Images/ear.jpg";
import img64 from "../Images/earring.jpg";
import img65 from "../Images/elephant.jpg";
import img66 from "../Images/eye.jpg";
import img67 from "../Images/face.jpg";
import img68 from "../Images/feather.jpg";
import img69 from "../Images/finger.jpg";
import img70 from "../Images/fire.jpg";
import img71 from "../Images/fireworks.jpg";
import img72 from "../Images/foot.jpg";
import img73 from "../Images/fox.jpg";
import img74 from "../Images/frog.jpg";
import img75 from "../Images/garlic.jpg";
import img76 from "../Images/gift.jpg";
import img77 from "../Images/gingerbread_man.jpg";
import img78 from "../Images/giraffe.jpg";
import img79 from "../Images/girl.jpg";
import img80 from "../Images/globe.jpg";
import img81 from "../Images/gorilla.jpg";
import img82 from "../Images/hand.jpg";
import img83 from "../Images/honey.jpg";
import img84 from "../Images/hotair_balloon.jpg";
import img85 from "../Images/hourglass.jpg";
import img86 from "../Images/ice_cream.jpg";
import img87 from "../Images/iceskate.jpg";
import img88 from "../Images/jam.jpg";
import img89 from "../Images/javelin.jpg";
import img90 from "../Images/jetski.jpg";
import img91 from "../Images/kayak.jpg";
import img92 from "../Images/key.jpg";
import img93 from "../Images/kimono.jpg";
import img94 from "../Images/ladybug.jpg";
import img95 from "../Images/lamb.jpg";*/
import img86 from "../Images/ice_cream.jpg";


//const allImages = [
//  img4, img5, img6, img7, img8, img9, img10, img11, img12, img13,
//  img14, img15, img16, img17, img18, img19, img20, img21, img22, img23,
// img24, img25, img26, img27, img28, img29, img30, img31, img32, img33,
//  img34, img35, img36, img37, img38, img39, img40, img41, img42, img43,
//  img44, img45, img46, img47, img48, img49, img50, img51, img52, img53,
// img54, img55, img56, img57, img58, img59, img60, img61, img62, img63,
//  img64, img65, img66, img67, img68, img69, img70, img71, img72, img73,
//  img74, img75, img76, img77, img78, img79, img80, img81, img82, img83,
// img84, img85, img86, img87, img88, img89, img90, img91, img92, img93,
//  img94, img95
//];

function BallotConfirmationPicture(setIsLoggedIn) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSelectedYes, setSelectedImage } = useContext(VoteContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use static ice cream image
  const image_visual = img86;
  const imageName = "Ice Cream";

  // Set the ice cream image in context so it's available for VisualSelection_Picture
  React.useEffect(() => {
    setSelectedImage(img86);
  }, [setSelectedImage]);

  // Retrieve candidate name from navigation state; fallback if not set.
  const votedCandidate = location.state?.votedCandidate || "Candidate Unknown";

  const now = new Date();
  const dateTime = now.toLocaleString();

  // Define the steps for each flow:
  const stepsNo = ["Voted Before", "Voting", "Confirmation"];
  const stepsYes = ["Voted Before", "Visual Selection", "Voting", "Confirmation"];

  // Determine which steps array and current step to use.
  // For "No": currentStep is 3.
  // For "Yes": currentStep is 4.
  const steps = userSelectedYes ?  stepsYes :stepsNo;
  const currentStep = userSelectedYes ? 4 : 3;

  const handleLogout = async () => {
       try {
          await saveVisuaRepresentation({ image_visual: "ice_cream" });
          await setEndTimeFirstPhase();
           await setSessionEnd();
         navigate("/studyinfo2");
       } catch (error) {
         console.error("Error during logout:", error);
       }
     };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="page-wrapper">
      <main className="welcome-main">
        <ProcessBar steps={steps} currentStep={currentStep} />

          <div className="intro-container">
          <h1 className="intro-title">Confirmation</h1>
          <div className="text-main text-main-confirmation">
            You have cast your ballot succesfully! Below is a vote identifier of your cast ballot. 
          </div>
           <div className="security-box-confirmation">
            <p className="text-small">
              <strong>Security Feature:</strong><br/>
              This unique vote identifier is linked to your voting record. You will need to remember this vote identifier if you wish to change your vote later in the election.
            </p>
          </div>
        </div>



        <div className="card-wide card-confirmation">
         <h1 className="card-title"style={{ width: "100%", textAlign: "left", margin: "0 0 10px 40px" }}>
            Vote Identifier
          </h1>

            <div
    className="instruction-list"
    style={{ maxWidth: "800px", margin: "0 auto 20px auto", textAlign: "left", paddingLeft: "35px" }}
  >
    <ul>
      <li>
        You need to <strong>remember</strong> your vote identifier(s) if you want to change your vote later in the election.
      </li>
      <li>
        You should <strong>not share</strong> your vote identifier(s) with anyone, and you should <strong>not save</strong> them anywhere.
      </li>
      <li>
        If you forget your vote identifier(s), you will <strong>not be able to update your vote succesfully</strong> later in the election.
      </li>
    </ul>
  </div>

   <div className="confirmation-info">
                 <div className="text-small" style={{ marginTop: "10px", marginBottom: "4px" }}>
            Your vote identifier is:
          </div>
                 <div className="confirmation-card-label" style={{fontWeight: "bold", fontSize: "2.5rem", marginTop: "0px"}}>
            {imageName}
          </div>
              <div className="confirmation-datetime">{dateTime}</div>
              <div className="confirmation-candidate"> {votedCandidate}</div>
            </div>
          <img
          className="image-picture"
            src={image_visual}
            alt="Visual ballot"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              marginTop: "0px",
              marginBottom: "20px",
              borderColor: "#c1bfbfff",
              borderWidth: "2px",
              borderStyle: "solid"
            }}
          />
       

           
        
        </div>
        

        <button className="button logout-button-confirmation" style={{marginTop: "40px"}} onClick={() => setShowLogoutConfirm(true)}>
          Logout
        </button>
    {showLogoutConfirm && (
  <div className="modal-backdrop-confirmation">
    <div className="modal-confirmation">
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>Are you sure you want to log out?</p>
       <p>
        You will not be able to view your vote identifier <strong>{imageName}</strong> again.<br />
        If you forget your vote identifier, you will not be able to update your vote successfully later in the election.
      </p>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "16px" }}>
        <button className="button" onClick={handleLogout}>Yes</button>
        <button className="button" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
      </main>
      <Footer />
    </div>
  );
}

export default BallotConfirmationPicture;



