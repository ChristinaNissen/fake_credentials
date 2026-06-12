import React, { useState, useEffect, useRef } from "react";
import "./Help.css";
import "./Voting-system.css";
import "./Welcome.css"; // Assuming Welcome.css defines the chevron icons
import Footer from "./Footer";
import { incrementHelpVisitCounter } from "../API/Voter";

const helpSections = [
  {
    title: "General Information",
    items: [
      {
        id: "general",
        title: "Who can vote online?",
        content: (
          <div className="space-y-2">
            <p>
              You can vote online if you are eligible to vote in the election. Citizens aged 18 or older are automatically eligible to vote.
            </p>
            <p>
              If you are eligible to vote, you are automatically registered and do not need to sign up in advance.
            </p>
            <p>
              Eligible voters can access the online voting platform using the digital credentials already used for public services.
            </p>
          </div>
        ),
      },
      {
        id: "authentication",
        title: "What do I need to vote online?",
        content: (
          <div className="space-y-2">
            <p>To vote online, you need the following:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>A device such as a computer, tablet, or smartphone</li>
              <li>
                A modern web browser (Chrome, Firefox, Safari, or Edge) in its
                latest version
              </li>
              <li>A stable internet connection</li>
            </ul>
            <p>
              Make sure your device is private and secure while voting, for example by voting alone and ensuring no one can see your screen.
            </p>
          </div>
        ),
      },
      {
        id: "how-to-vote-online",
        title: "How do I vote online?",
        content: (
          <div className="space-y-2">
            <p>
              To vote online, follow the on-screen instructions. The process consists of the following steps:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Login to the voting system by entering your regular password and thematic password.
                  For security reasons, you should not save your thematic password, as the system is designed so that no proof of your vote can be created.
              </li>
              <li>
                Cast your vote by choosing your preferred candidate and submitting your ballot.
              </li>
              <li className="space-y-2">

    You will receive a confirmation of your cast ballot. 

</li>


            </ol>
            <p>
              You can also vote in person, in which case the in-person vote takes precedence.
            </p>
          </div>
        ),
      },
      {
        id: "difference",
        title: "What are the differences between voting online or in person?",
        content: (
          <div className="space-y-2">
            <p>
              You are free to choose whether to vote online or at a polling station. However, there are important differences:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>In-person (physical) voting is final and cannot be changed.</li>
              <li>If you vote both online and in person, only your physical vote will count.</li>
              <li>
                Online voting cannot guarantee privacy from people physically near you, such as family members or others in the same room.
              </li>
              <li>
                In-person voting takes place in a private voting booth and guarantees physical privacy.
              </li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    title: "Anti-Coercion Measures",
    items: [
      {
        id: "what-is-coercion",
        title: "What is voter coercion?",
        content: (
          <div className="space-y-2">
            <p>
              Voter coercion happens when someone pressures or forces you to vote in a particular way against your will. This can take several forms:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Direct threats:</strong> Someone threatens harm if you do not vote as they demand.</li>
              <li><strong>Intimidation:</strong> Creating fear or discomfort to influence your vote.</li>
              <li><strong>Monitoring:</strong> Someone watching over your shoulder while you vote.</li>
              <li><strong>Family pressure:</strong> Relatives insisting that you vote according to family preferences.</li>
              <li><strong>Financial leverage:</strong> Promises of rewards or threats of financial consequences based on how you vote.</li>
            </ul>
            <p>
              Online voting is particularly vulnerable to coercion because it occurs outside the privacy of an official voting booth. The anti-coercion measures in this system are designed to help you protect your true voting intentions, even under pressure.
            </p>
          </div>
        ),
      },
      {
        id: "coercion-risk",
        title: "What can I do if I am being coerced?",
        content: (
          <div className="space-y-2">
            <p>
              If someone is pressuring or forcing you to vote in a certain way, you can protect your vote using the system’s anti-coercion feature:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Use another word from the same theme:</strong> Enter your regular password as normal, but replace your thematic password with another word from the same theme. For example, "purple" instead of "blue" if your theme is colours. The system will silently register the coercion and discard the vote. No error message will appear and the login will look completely successful, so you can cast the vote as instructed.

                <div className="coercion-important-note">
                  <strong>Important:</strong> Do not write the thematic password down or save it anywhere, as it can weaken the protection against coercion. If you enter a word outside the theme, a visible error message will appear and may alert the coercer that you are trying to deceive them.
                </div>
              </li>
              <li>
                <strong>Vote again later in private:</strong> Once you are alone, log in using your true regular and thematic passwords to cast your real vote.
              </li>
              <li>
                <strong>Vote in person:</strong> You can choose to vote at a physical polling station, where privacy is guaranteed. Physical votes are final and always take precedence over online votes.
              </li>
            </ul>
            <p className="mt-2 font-medium">
              If you are in immediate danger, contact the authorities at the emergency number.
            </p>
          </div>
        ),
      },
      {
        id: "incognito-mode",
        title: "Why do I need a private browser to protect against coercion?",
        content: (
          <div className="space-y-2">
            <p>
              You need to use a private browser to prevent your device from leaving traces of your activity, such as browsing history or cookies.
            </p>
            <p>
              The voting system itself never provides any information about what you voted for or whether you have voted before. However, traces left on your device could be used by someone nearby to see whether you have accessed the voting platform. Using a private browser helps prevent others from knowing whether or how you voted.
            </p>
          </div>
        ),
      },
    ],
  },
  {
  title: "Vote Privacy",
  items: [
    {
      id: "privacy-protection",
      title: "Protection of your voting privacy",
      content: (
        <div className="space-y-2">
          <p>
              Votes are encrypted before being sent over the network, preventing
              anyone from seeing your selection.
          </p>
          <p>
            Keep in mind that privacy cannot be guaranteed if someone is physically
            watching your screen or if your device is compromised by malware.
          </p>
          <p>
            Always vote in a private, secure environment and ensure your device
            has the latest security updates. If you are unsure, you can vote in person
            at your local polling station.
          </p>
        </div>
      ),
    },
    {
      id: "see-how-i-voted",
      title: "Can I see how I voted?",
      content: (
        <div className="space-y-2">
          <p>
            No. The voting system does not display your vote history to maintain your privacy
            and to prevent coercion. This ensures that no one, including the system itself,
            can verify how you voted, even if they observe your activity.
          </p>
        </div>
      ),
    },
  ],
}
];


const Help = () => {
  // Prevent double increment in development (e.g., React Strict Mode)
  const hasIncremented = useRef(false);
  useEffect(() => {
    if (!hasIncremented.current) {
      incrementHelpVisitCounter().catch((err) => {
        // Optionally handle/log error
        console.error("Failed to increment Help page visit counter:", err);
      });
      hasIncremented.current = true;
    }
  }, []);
	// Manage open/close state per FAQ item.
	const [openItems, setOpenItems] = useState(() => {
	const initial = {};
	helpSections.forEach(section => {
		if (section.title === "Support & Contact") {
			section.items.forEach(item => { initial[item.id] = true; });
		}
	});
	return initial;
});

	const toggleItem = (id) => {
		setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<div className="page-wrapper">
			<main className="welcome-main">
				<h1>Help &amp; FAQ</h1>
				<div className="text-main">
					Below you find answers to frequently asked questions about the online voting system. <br></br>If you need help, please contact voter support or visit your local voting station.
				</div>
				<div className="card">
					<div className="accordion">
						{helpSections.map((section) => (
							<div key={section.title} className="accordion__section">
								<h2 className="accordion__header">{section.title}</h2>
								<div className="accordion__content">
									{section.items.map((item) => (
										<div key={item.id} className="accordion__item">
											<button
												className="accordion__subheader"
												onClick={() => toggleItem(item.id)}
											>
												{item.title}
												<span className="accordion-arrow">
										{openItems[item.id] ? "▲" : "▼"}
									</span>
											</button>
										<div className={`accordion__subcontent ${!openItems[item.id] ? 'collapsed' : ''}`}>
											{item.content}
										</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
				<button className="button help-return-button" onClick={() => window.history.back()}>
        Return
      </button>
			</main>
			<Footer />
		</div>
	);
};

export default Help;
