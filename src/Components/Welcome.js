import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "./Footer";
import "./Welcome.css";
import votingIllustration800 from "../Assets/chair-800.jpg";
import votingIllustration1200 from "../Assets/chair-1200.jpg";
import overviewImg from "../Assets/VotingProcess_Overview.png";
import { incrementVideoInteractionCounter } from "../API/Voter";

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
	const [isHowToVoteVideoLoaded, setIsHowToVoteVideoLoaded] = useState(false);
	const [isCoercionVideoLoaded, setIsCoercionVideoLoaded] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const handleLoadHowToVoteVideo = async () => {
		try {
			await incrementVideoInteractionCounter("howToVote");
		} catch (error) {
			console.error("Failed to increment how-to-vote video count:", error);
		}
		setIsHowToVoteVideoLoaded(true);
	};

	const handleLoadCoercionVideo = async () => {
		try {
			await incrementVideoInteractionCounter("coercion");
		} catch (error) {
			console.error("Failed to increment coercion video count:", error);
		}
		setIsCoercionVideoLoaded(true);
	};

	const handleHowToVoteYoutubeClick = async () => {
		try {
			await incrementVideoInteractionCounter("howToVote");
		} catch (error) {
			console.error("Failed to increment how-to-vote YouTube click count:", error);
		}
	};

	const handleCoercionYoutubeClick = async () => {
		try {
			await incrementVideoInteractionCounter("coercion");
		} catch (error) {
			console.error("Failed to increment coercion YouTube click count:", error);
		}
	};

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
						<p className="welcome-process-description">
							The voting process consists of several steps. First, you will log in to the system with the passwords you have received. The password consists of a regular password and a thematic password. The thematic password is designed to protect you against coercion. You will then proceed to cast your vote for your preferred candidate. After your vote has been submitted, you will receive a confirmation for the ballot you have just cast. You can update your vote online until the end of the election, and only your last online vote counts. If you vote at a physical polling station, your in-person vote is counted in the final results.
						</p>
							<div className="info-item overview-image-container">
								<img src={overviewImg} alt="Voting process overview" className="overview-image" />
							</div>
					<ul className="voting-steps-mobile">
						<li>
						<strong>Login</strong>
							<div>Access the system with your passwords that consist of a regular password and a thematic password.</div>
						</li>
						<li>
						<strong>Voting</strong>
							<div>Choose your candidate and cast your ballot</div>
						</li>
						<li>
						<strong>Confirmation</strong>
							<div>Confirmation of your vote</div>
						</li>
					</ul>
					<div className="welcome-flowchart-inline">
						<h3 className="welcome-flowchart-title">How does the login process work</h3>
						<p className="welcome-flowchart-intro">
							You have a regular password and a thematic password. Start with your regular password. Then enter your thematic password based on whether you are safe or being coerced.
						</p>
						<div className="welcome-login-process" aria-label="Login process for normal voting and voting under coercion">
							<div className="welcome-login-steps-inline" aria-label="Two-step login sequence">
								<div className="welcome-login-step-inline">
									<span className="welcome-login-step-number">1</span>
									<span className="welcome-login-step-inline-text">Enter regular password</span>
								</div>
								<span className="welcome-login-step-divider" aria-hidden="true">→</span>
								<div className="welcome-login-step-inline">
									<span className="welcome-login-step-number">2</span>
									<span className="welcome-login-step-inline-text">Enter thematic password</span>
								</div>
							</div>

							<div className="welcome-login-outcomes" aria-label="Outcomes for safe and pressured scenarios">
								<div className="welcome-login-outcome-row welcome-login-outcome-safe">
									<div className="welcome-login-outcome-title">Safe environment:</div>
									<div className="welcome-login-outcome-text">Use your true thematic password. Login is successful and your vote is counted.</div>
								</div>
								<div className="welcome-login-outcome-row welcome-login-outcome-coerced">
									<div className="welcome-login-outcome-title">Under coercion:</div>
									<div className="welcome-login-outcome-text">Use another word from the same theme. Login appears successful, but that vote is not counted.</div>
								</div>
							</div>
						</div>
					</div>
					<div className="coercion-video-block">
						<h3 className="coercion-video-title">How to vote online</h3>
						<div className="coercion-video-frame">
							{isHowToVoteVideoLoaded ? (
								<iframe
									src="https://www.youtube.com/embed/t0kPAPVxaGU?autoplay=1"
									title="Instruction video on how to vote online"
									loading="lazy"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							) : (
								<button
									type="button"
									className="video-launch-button"
									onClick={handleLoadHowToVoteVideo}
									aria-label="Play how to vote online video"
								>
									<img
										src="https://img.youtube.com/vi/t0kPAPVxaGU/maxresdefault.jpg"
										alt="Preview of how to vote online video"
										className="video-launch-thumbnail"
									/>
									<span className="video-launch-overlay">
										<span className="video-launch-play-icon" aria-hidden="true">▶</span>
										<span className="video-launch-label">Click to play video</span>
									</span>
								</button>
							)}
						</div>
						<p className="coercion-video-help">
							If the video does not load, open it directly on
							<a href="https://www.youtube.com/watch?v=t0kPAPVxaGU" target="_blank" rel="noreferrer" onClick={handleHowToVoteYoutubeClick}> YouTube</a>.
						</p>
					</div>
					<details className="optional-video-accordion">
						<summary className="optional-video-summary">
							<span>Optional safety guidance: How to avoid coercion</span>
							<span className="optional-video-toggle" aria-hidden="true" />
						</summary>
						<div className="optional-video-content">
							<div className="coercion-video-block">
								<div className="coercion-video-frame">
									{isCoercionVideoLoaded ? (
										<iframe
											src="https://www.youtube.com/embed/7dwukfTmB-k?autoplay=1"
											title="Instruction video on avoiding coercion"
											loading="lazy"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									) : (
										<button
											type="button"
											className="video-launch-button"
											onClick={handleLoadCoercionVideo}
											aria-label="Play how to avoid coercion video"
										>
											<img
												src="https://img.youtube.com/vi/7dwukfTmB-k/maxresdefault.jpg"
												alt="Preview of how to avoid coercion video"
												className="video-launch-thumbnail"
											/>
											<span className="video-launch-overlay">
												<span className="video-launch-play-icon" aria-hidden="true">▶</span>
												<span className="video-launch-label">Click to play video</span>
											</span>
										</button>
									)}
								</div>
								<p className="coercion-video-help">
									If the video does not load, open it directly on
									<a href="https://www.youtube.com/watch?v=7dwukfTmB-k" target="_blank" rel="noreferrer" onClick={handleCoercionYoutubeClick}> YouTube</a>.
								</p>
							</div>
						</div>
					</details>
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
