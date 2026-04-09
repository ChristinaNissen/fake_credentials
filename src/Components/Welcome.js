import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import "./Welcome.css";
import votingIllustration800 from "../Assets/chair-800.jpg";
import votingIllustration1200 from "../Assets/chair-1200.jpg";
import overviewImg from "../Assets/skærm3.png";

const infoData = [
	{
		title: "Vote in a Private and Safe Setting",
		content:
			"Please ensure you are alone and cannot be observed or influenced while voting. A private environment helps protect the secrecy of your vote and freedom to vote according to your own choice.",
	},
	{
		title: "Technical Requirements",
		content:
			"For a secure and reliable voting experience, use a modern web browser (such as the latest version of Chrome, Firefox, Safari, or Edge) and a stable internet connection.",
	},
	{
		title: "Need Assistance?",
		content: (
			<>
				If you experience any issues while voting or have questions, please visit the <Link to="/help" style={{ textDecoration: "underline" }}>Help</Link> section or contact voter support for assistance.
			</>
		),
	},
];

const Welcome = () => {
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="page-wrapper">
			<main className="welcome-main">
				<h1>Welcome to <br />The Online Voting System</h1>
				<div className="text-main text-welcome-main">
					Your secure platform for participating in democratic decision-making
				</div>
				{/* Move the visual overview below the welcome illustration and before the info card, and match width to info card */}
				<div className="welcome-illustration">
					<img
						src={votingIllustration1200}
						srcSet={`${votingIllustration800} 800w, ${votingIllustration1200} 1200w`}
						sizes="(max-width: 600px) 100vw, (max-width: 840px) 100vw, 800px"
						alt="Voting illustration"
						decoding="async"
						fetchPriority="high"
						style={{ width: "100%", borderRadius: "8px" }}
					/>
				</div>
				{/* Add a separate card for the steps above the info card */}
					<section className="card" style={{ maxWidth: "800px", marginBottom: "36px" }}>
					<div className="info-list">
						<h2 className="before-vote-heading">How to vote online</h2>
						<p className="welcome-process-intro">
							<span className="welcome-process-intro-lead">
								This voting system is designed to allow voters to update their vote during the election.
							</span>
							The voting process consists of several steps. First, you will log in to the system and answer whether you have already voted in the election. Depending on your answer, you may be asked to identify previous vote identifiers for ballots you have already cast. You will then proceed to cast your vote. After your vote has been submitted, you will receive a confirmation together with a vote identifier for the ballot you have just cast. It is important to remember this vote identifier, as you will need it if you want to update your vote later in the election.
						</p>
					<div className="info-item overview-image-container">
						<img src={overviewImg} alt="Voting process overview" className="overview-image" />
					</div>
					<ul className="voting-steps-mobile">
						<li>
						<strong>Login</strong>
							<div>Access the system with your credentials</div>
						</li>
						<li>
						<strong>Voted Before?</strong>
							<div>Answer the question to proceed</div>
						</li>
						<li>
						<strong>Identify Previous Votes</strong>
							<div>If yes, select the vote identifier(s) shown to you after casting your previous vote(s)</div>
						</li>
						<li>
						<strong>Voting</strong>
							<div>Choose your candidate and cast your ballot</div>
						</li>
						<li>
						<strong>Confirmation</strong>
							<div>Get your vote identifier</div>
						</li>
					</ul>
					<div className="coercion-video-block">
						<h3 className="coercion-video-title">How to avoid coercion</h3>
						<div className="coercion-video-frame">
							<iframe
								src="https://www.youtube.com/embed/h-zbqLmdkKI"
								title="Instruction video on avoiding coercion"
								loading="lazy"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
						<p className="coercion-video-help">
							If the video does not load, open it directly on
							<a href="https://www.youtube.com/watch?v=h-zbqLmdkKI" target="_blank" rel="noreferrer"> YouTube</a>.
						</p>
					</div>
					</div>
				</section>


				<section className="card" style={{ maxWidth: "800px" }}>
					<div className="info-list-card">
						<h2 className="before-vote-heading">Before You Vote</h2>
						{infoData.map((item, idx) => (
							<div key={idx} className="info-item">
								<h3>{item.title}</h3>
								<p>{item.content}</p>
							</div>
						))}
					</div>
				</section>
			
				<div className="login-button-container">
					<button 
						className="button welcome-button"
						onClick={() => navigate("/private-mode")}
					>
						Login
					</button>
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Welcome;
