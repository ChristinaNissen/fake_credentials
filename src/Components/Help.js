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
              To vote online, log in to the voting platform and follow the on-screen instructions. The process consists of the following steps:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Indicate whether you have voted before in this election.</li>
              <li>
                If you select <em>Yes</em>, identify your previous vote(s) by selecting the vote identifier(s) you saw when casting your previous vote(s).
              </li>
              <li>
                Cast your vote by choosing your candidate and submitting your ballot.
              </li>
              <li className="space-y-2">
  <span>
    After submitting your ballot, a confirmation screen will display a vote identifier linked to your submitted ballot. The vote identifier is shown only during this session and will not be shown again after you leave the voting system.
  </span>
  <p>
    For security reasons, you should not save, photograph, or record your vote identifier. The system is designed so that no proof of your vote can be created.
  </p>
</li>


            </ol>
            <p>
              You can change your online vote as many times as you wish until the election closes. Only your last submitted online vote will count, unless you also vote in person, in which case the in-person vote takes precedence.
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
              <li>Online voting allows you to change your vote until the election closes.</li>
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
    title: "Revoting",
    items: [
      {
        id: "revoting",
        title: "How does revoting work?",
        content: (
          <div className="space-y-2">
            <p>
              The online voting system allows you to recast your vote as many times as you wish until the election closes.
            </p>
            <p>
              Each time you revote, the system will ask you to identify your previous vote(s) using the vote identifier(s) you saw when voting earlier. This includes all previous voting attempts, even if a vote was later replaced.
            </p>
            <p>
              Only your last valid online vote will count. If you also vote in person, your in-person vote takes precedence.
            </p>
          </div>
        ),
      },
      {
        id: "previous-ballots",
        title: "How do I identify my previous vote(s)?",
        content: (
          <div className="space-y-2">
            <p>
              To identify your previously cast vote(s), you need to select the vote identifier(s) shown to you immediately after submitting your vote(s).
            </p>
            <p>
              <strong>Important:</strong> You must select <em>all</em> vote identifiers you have seen before, including identifiers from any previous attempts, even if a vote was later replaced.
            </p>
            <p>
              The system will not provide feedback on whether your selection is correct.
            </p>
            <p>
              If you do not select the correct vote identifier(s), your vote will not be changed. Your submission will be considered invalid.
            </p>
            <p>
              If you cannot remember or find your vote identifier(s), you can always vote in person at your local polling station.
            </p>
          </div>
        ),
      },
      {
        id: "ballot-verification-security",
        title: "Why do I need to identify my previous vote(s) to revote?",
        content: (
          <div className="space-y-2">
            <p>
              You need to identify your previous vote(s) to ensure the security and integrity of the revoting process. This helps the system both confirm your identity and protect your vote from potential coercion:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Identity verification:</strong> Only you can update your vote by recognising the vote identifier(s) that you saw during your previous vote(s). This confirms that you were the person who cast them.
              </li>
              <li>
                <strong>Anti-coercion protection:</strong> This allows you to invalidate a coerced vote without others knowing, either by intentionally selecting the wrong vote identifier(s) when identifying previous votes or by answering the question about whether you have voted before in a way that does not reveal your true voting history.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "revote-physical",
        title: "Can I change my vote if I already voted in person?",
        content: (
          <div className="space-y-2">
            <p>
              No. Physical votes are final and cannot be changed. If you vote both digitally and physically, only your in-person vote will be counted.
            </p>
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
              If someone is pressuring or forcing you to vote in a certain way, you can protect your vote using the system’s anti-coercion features:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Answer or select incorrectly:</strong> You can protect yourself by intentionally answering the question about whether you have voted before incorrectly, or by selecting the wrong vote identifier(s) when asked to identify previous votes. This will cause the coerced vote to be invalid.
              </li>
              <li>
                <strong>Vote again later:</strong> You may comply under pressure and cast a vote as instructed, then vote again later in private. If you correctly identify your previous votes when revoting, your new vote will be valid and replace the coerced one.
              </li>
              <li>
                <strong>Vote in person:</strong> You can choose to vote at a physical polling station, where privacy is guaranteed. Physical votes are final and always take precedence over online votes.
              </li>
            </ul>
            <p className="mt-2 font-medium">
              If you are in immediate danger, contact the authorities at the emergency number 112.
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
              The voting system itself never provides any information about what you voted for, whether you have voted before, or whether your selections are correct. However, traces left on your device could be used by someone nearby to see whether you have accessed the voting platform. Using a private browser helps prevent others from knowing whether or how you voted.
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
            Your voting privacy is protected through several system-level measures:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Votes are encrypted before being sent over the network, preventing
              anyone from seeing your selections.
            </li>
            <li>
              Your ballot is mixed with decoy votes in the database. This ensures
              that even in the event of a breach, your vote cannot be traced back to you.
            </li>
          </ul>
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
            No. The system does not display your vote history to maintain your privacy
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
					Below you find answers to frequently asked questions about the online voting system, including privacy protections, revoting, and safeguards against voter coercion. If you need help, please contact voter support or visit your local voting station.
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
				<button className="button" onClick={() => window.history.back()} style={{ marginTop: "40px" }}>
        Return
      </button>
			</main>
			<Footer />
		</div>
	);
};

export default Help;