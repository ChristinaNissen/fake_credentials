import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import "./Welcome.css";
import votingIllustration from "../Assets/Banner.png";
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
						src={votingIllustration}
						alt="Voting illustration"
						style={{ width: "100%", borderRadius: "8px" }}
					/>
				</div>
				{/* Add a separate card for the steps above the info card */}
					<section className="card" style={{ maxWidth: "800px", marginBottom: "36px" }}>
					<div className="info-list">
						<h2 className="before-vote-heading">How to vote online</h2>
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
