"use client";
import { useState, useEffect, useRef } from "react";
import VideoPlayer from "./video-player";

import {
	FaGithub,
	FaDiscord,
	FaCode,
	FaLightbulb,
	FaHammer,
	FaCube,
	FaCog,
	FaUsers,
	FaCalendarAlt,
} from "react-icons/fa";
import CCUFrame from "./ccuFrame";
import GameJamIcon from "./gamejam-icon";
import { useRobloxStats } from "./use-roblox-stats";

// Small helper component to show live stats on each Jam card, sourced
// from the static /data/roblox-stats.json file — no proxy, no CORS.
function GameJamStats({ placeId }: { placeId: string }) {
	const { stats, loading } = useRobloxStats(placeId);

	return (
		<div className="gamejam-stats">
			{loading ? (
				<code className="gamejam-stat loading">Loading stats...</code>
			) : stats ? (
				<>
					<code className="gamejam-stat live">{stats.playing.toLocaleString()} playing</code>
					<code className="gamejam-stat">{stats.visits.toLocaleString()} visits</code>
				</>
			) : null}
		</div>
	);
}
function RobloxIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="currentColor">
			<path d="M5.2 2L2 18.8 18.8 22 22 5.2 5.2 2ZM13.7 14.8L9.2 14 10 9.5l4.5.8-.8 4.5Z" />
		</svg>
	);
}

function Typewriter({ text, speed = 100 }: { text: string; speed?: number }) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		setCount(0);
		const interval = setInterval(() => {
			setCount((prev) => {
				if (prev >= text.length) {
					clearInterval(interval);
					return prev;
				}
				return prev + 1;
			});
		}, speed);
		return () => clearInterval(interval);
	}, [text, speed]);

	return <code className="terminal-tag terminal-tag--accent typewriter-cursor">{text.slice(0, count)}</code>;
}

export default function Home() {
	const mainRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const mainEl = mainRef.current;
		if (!mainEl) return;

		const handleScroll = () => {
			const parallaxFactor = 0.35;
			const offset = mainEl.scrollTop * parallaxFactor;
			document.body.style.setProperty("--bg-y", `${offset}px`);
		};

		mainEl.addEventListener("scroll", handleScroll, { passive: true });
		return () => mainEl.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (id: string) => (e: React.MouseEvent) => {
		e.preventDefault();
		document.getElementById(id)?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const [copied, setCopied] = useState(false);

	async function copyDiscord() {
		await navigator.clipboard.writeText("itzmrratsp");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<main ref={mainRef}>
			<header className="site-header">
				<nav>
					<ul>
						<li>
							<a
								href="#home"
								onClick={scrollToSection("home")}>
								HOME
							</a>
						</li>
						<li>
							<a
								href="#stats-jams"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("stats-jams")
										?.scrollIntoView({ behavior: "smooth", block: "start" });
								}}>
								STATS & JAMS
							</a>
						</li>
					</ul>
				</nav>
			</header>

			<section
				id="home"
				className="hero">
				<div className="hero-content">
					<div className="hero-top">
						<div className="image-frame">
							<img
								src="/main.png"
								alt="Profile"
							/>
						</div>
						<div className="terminal-frame">
							<code className="terminal-tag terminal-tag--dim">~/</code>
							<Typewriter
								text="ItzMrRatsP"
								speed={100}
							/>
						</div>
					</div>

					<div className="hero-info">
						<code className="terminal-tag terminal-tag--small">20 years old</code>
						<code className="terminal-tag terminal-tag--small">5 years of experience</code>
						<code className="terminal-tag terminal-tag--small">I love her 💖</code>
					</div>

					<div className="hero-buttons">
						<button
							className="terminal-button"
							onClick={copyDiscord}>
							<FaDiscord size={16} />
							{copied ? "Copied!" : "Discord"}
						</button>
						<a
							className="terminal-button terminal-button--outline"
							href="https://github.com/itzmrratsp"
							target="_blank"
							rel="noopener noreferrer">
							<FaGithub size={16} /> GitHub
						</a>
						<a
							className="terminal-button terminal-button--outline"
							href="https://roblox.com/users/2536605621/profile"
							target="_blank"
							rel="noopener noreferrer">
							<RobloxIcon /> Roblox
						</a>
					</div>

					<p className="hero-description">
						Full-stack Roblox developer building games, systems, and everything in between. Mentored by{" "}
						<a
							href="https://dylwithlt.github.io/"
							target="_blank"
							rel="noopener noreferrer"
							className="hero-description-link">
							DylWithIt
						</a>
						.
					</p>
				</div>
			</section>

			{/* NEW SPLIT SECTION */}
			<section
				id="stats-jams"
				className="hero hero-split-container">
				<div className="hero-split">
					{/* Left Side: Stats */}
					<div className="hero-split-panel">
						<code className="terminal-tag terminal-tag--small section-title">live stats</code>
						<CCUFrame />
					</div>

					{/* Right Side: Game Jams */}
					<div className="hero-split-panel">
						<code className="terminal-tag terminal-tag--small section-title">game jams</code>

						<div className="gamejam-main">
							<div className="gamejam-summary">
								<code className="terminal-tag terminal-tag--small">
									2 jams · 2 wins · built with Gearworks Studios
								</code>
							</div>

							<a
								href="https://www.roblox.com/communities/34692920/Gearworks-Studios#!/about"
								target="_blank"
								rel="noopener noreferrer"
								className="studio-banner">
								<FaCog
									size={20}
									className="studio-banner-icon"
								/>
								<code className="studio-banner-name">Gearworks Studios</code>
							</a>

							<div className="gamejam-grid">
								{/* 3M1 Card */}
								<a
									href="https://www.roblox.com/games/88481183745824/3M1"
									target="_blank"
									rel="noopener noreferrer"
									className="gamejam-card">
									<GameJamIcon placeId="88481183745824" />
									<div className="gamejam-badge gamejam-badge--gold">1st place</div>
									<code className="gamejam-event">RDC 2025</code>
									<code className="gamejam-game">3M1</code>
									<div className="gamejam-desc">
										3 vs 1 asymmetrical survival horror. Three survivors must work together to
										escape the single monster.
									</div>
									<div className="gamejam-meta-row">
										<span className="gamejam-tag">Theme: Break the System</span>
										<span className="gamejam-tag">
											<FaUsers size={12} /> 4-person team
										</span>
									</div>
									<GameJamStats placeId="88481183745824" />
								</a>

								{/* Malice Card */}
								<a
									href="https://www.roblox.com/games/18892236729/MALICE"
									target="_blank"
									rel="noopener noreferrer"
									className="gamejam-card">
									<GameJamIcon placeId="18892236729" />
									<div className="gamejam-badge gamejam-badge--silver">2nd place</div>
									<code className="gamejam-event">Inspire 2024</code>
									<code className="gamejam-game">Malice</code>
									<div className="gamejam-desc">
										Psychological horror platformer. Navigate a corrupted city while evading the
										relentless pursuit.
									</div>
									<div className="gamejam-meta-row">
										<span className="gamejam-tag">Theme: Time is Your Enemy</span>
										<span className="gamejam-tag">
											<FaUsers size={12} /> 4-person team
										</span>
									</div>
									<GameJamStats placeId="18892236729" />
								</a>
							</div>

							<div className="team-grid">
								<a
									href="https://www.roblox.com/users/2536605621/profile"
									target="_blank"
									rel="noopener noreferrer"
									className="team-member">
									<FaCode
										size={18}
										className="team-member-icon"
									/>
									<code className="team-member-name">ItzMrRatsP</code>
									<code className="team-member-role">Programmer / UI</code>
								</a>
								<a
									href="https://www.roblox.com/users/129843010/profile?friendshipSourceType=PlayerSearch"
									target="_blank"
									rel="noopener noreferrer"
									className="team-member">
									<FaLightbulb
										size={18}
										className="team-member-icon"
									/>
									<code className="team-member-name">BigUniverses</code>
									<code className="team-member-role">Programmer / Ideas / Story</code>
								</a>
								<a
									href="https://www.roblox.com/users/87768826"
									target="_blank"
									rel="noopener noreferrer"
									className="team-member">
									<FaHammer
										size={18}
										className="team-member-icon"
									/>
									<code className="team-member-name">Boneblox</code>
									<code className="team-member-role">Builder / Lead Story Writer</code>
								</a>
								<a
									href="https://www.roblox.com/users/4998832582/profile?friendshipSourceType=PlayerSearch"
									target="_blank"
									rel="noopener noreferrer"
									className="team-member">
									<FaCube
										size={18}
										className="team-member-icon"
									/>
									<code className="team-member-name">Stefano_css</code>
									<code className="team-member-role">Modeler / favorite italian</code>
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
