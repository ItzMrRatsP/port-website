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
	FaLaptopCode,
	FaCoins,
	FaChevronDown,
} from "react-icons/fa";
import CCUFrame from "./ccuFrame";
import GameJamIcon from "./gamejam-icon";
import ThemeToggle from "./theme-toggle";
import Reviews from "./reviews";

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

function DevMeIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="currentColor">
			<path d="M0 1.12L0.45 7.05L13.91 7.42L16.91 10.42L16.88 13.69L13.91 16.54L7.27 16.5L6.41 13.84L0 14.25L0.38 18.56L3.52 22.46L6.67 23.62L14.29 23.62L18.56 22.09L21.71 19.31L23.96 14.59L23.96 9.75L22.46 5.77L19.69 2.62L14.29 0.34L1.05 0.34Z" />
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
								<span className="nav-prompt">ls ~/</span> HOME
							</a>
						</li>
						<li>
							<a
								href="#plans"
								onClick={scrollToSection("plans")}>
								<span className="nav-prompt">ls ~/</span> PLANS
							</a>
						</li>
						{/* <li>
							<a
								href="#stats-jams"
								onClick={(e) => {
									e.preventDefault();
									document
										.getElementById("stats-jams")
										?.scrollIntoView({ behavior: "smooth", block: "start" });
								}}>
								<span className="nav-prompt">~/</span> STATS & JAMS
							</a>
						</li> */}
					</ul>
				</nav>
				<ThemeToggle />
			</header>

			<section
				id="home"
				className="hero">
				<div className="hero-content">
					<div className="hero-top">
						<code className="terminal-tag terminal-tag--dim">cat ~/whoami.json</code>
						{/* <div className="terminal-frame">
							<code className="terminal-tag terminal-tag--dim">~/</code>
							<Typewriter
								text="ItzMrRatsP"
								speed={100}

							/>
						</div> */}
						<div className="image-frame">
							<img
								src="/light-art.png"
								alt="Profile"
								className="art-light"
							/>
						</div>
					</div>

					{/* <div className="hero-info"> */}
					{/* <code className="terminal-tag terminal-tag--small">20 years old</code> */}
					{/* <code className="terminal-tag terminal-tag--small">experienced in luau</code> */}
					{/* <code className="terminal-tag terminal-tag--small"></code> */}
					{/* <code className="terminal-tag terminal-tag--small">I love her 💖</code> */}
					{/* </div> */}

					<p className="hero-description">
						Full-stack Roblox developer building games, systems, and everything in between - mentored by{" "}
						<a
							href="https://dylwithlt.github.io/"
							target="_blank"
							rel="noopener noreferrer"
							className="hero-description-link">
							DylWithIt
						</a>
						. I've spent the last couple years building on Roblox, from gameplay systems to full game loops.
						I care about clean code, fast iteration, and turning weird ideas into something people can
						actually play. Outside of scripting I'm usually learning something new or helping other devs get
						unstuck.
					</p>

					<div className="hero-buttons">
						<button
							className="terminal-button"
							onClick={copyDiscord}>
							<FaDiscord size={16} />
							{copied ? "Copied!" : "Discord"}
						</button>
						<a
							className="terminal-button terminal-button--outline"
							href="https://devme.app/@itzmrratsp"
							target="_blank"
							rel="noopener noreferrer">
							<DevMeIcon /> DevMe
						</a>
						<a
							className="terminal-button terminal-button--outline"
							href="https://roblox.com/users/2536605621/profile"
							target="_blank"
							rel="noopener noreferrer">
							<RobloxIcon /> Roblox
						</a>
					</div>

					<a
						href="#plans"
						onClick={scrollToSection("plans")}
						className="hero-cta-banner">
						<span>Want to work together?</span>
						<span className="hero-cta-banner-link">
							View Plans <span className="hero-cta-banner-arrow">→</span>
						</span>
					</a>
				</div>

				<a
					href="#plans"
					onClick={scrollToSection("plans")}
					className="scroll-cue"
					aria-label="Scroll to plans">
					<FaChevronDown size={14} />
				</a>
			</section>

			<section
				id="payment"
				className="hero">
				<div
					id="plans"
					className="plans-wrap">
					<div className="plans-heading">
						<code className="terminal-tag terminal-tag--dim">cat ~/plans.json</code>
						<h2>Work with me</h2>
						<p>
							Two ways to get help - pick whichever fits what you need, then hit me up on Discord to lock
							in details.
						</p>
					</div>

					{/* <div className="plans-status">
						<span className="plans-status-dot" />
						<span className="plans-status-text">Available for new projects</span>
						<span className="plans-status-sep">•</span>
						<span className="plans-status-sub">Usually responds within a few hours</span>
					</div> */}

					<div className="plans-grid">
						<div className="plan-card plan-card--featured">
							<span className="plan-card-badge">Most booked</span>
							<div className="plan-card-top">
								<div className="plan-card-heading">
									<span className="plan-card-icon">
										<FaLaptopCode size={16} />
									</span>
									<div>
										<div className="plan-card-title">Long Term</div>
										<div className="plan-card-tagline">ongoing hourly development</div>
									</div>
								</div>
								<div className="plan-card-price">
									<strong>$20</strong>
									<span>/hr</span>
								</div>
							</div>
							<ul className="plan-card-features">
								<li>Systems, mechanics & gameplay scripting</li>
								<li>Tooling, optimization & bug fixes</li>
								<li>Full projects or drop-in collab work</li>
								<li>Regular progress updates as we go</li>
							</ul>
						</div>

						<div className="plan-card">
							<div className="plan-card-top">
								<div className="plan-card-heading">
									<span className="plan-card-icon">
										<FaHammer size={16} />
									</span>
									<div>
										<div className="plan-card-title">Short Term</div>
										<div className="plan-card-tagline">commission-based / single systems</div>
									</div>
								</div>
								<div className="plan-card-price">
									<strong>$40</strong>
									<span>min</span>
								</div>
							</div>
							<ul className="plan-card-features">
								<li>One-off systems - shops, inventories, admin panels</li>
								<li>Fixed price, scoped before we start</li>
								<li>Good fit for a single feature or fix</li>
								<li>Delivered complete, ready to drop in</li>
							</ul>
						</div>
					</div>

					<div className="process-strip">
						<div className="process-step">
							<span className="process-step-num">01</span>
							<div className="process-step-title">Reach out</div>
							<p className="process-step-desc">Message me on Discord with what you need</p>
						</div>
						<div className="process-step">
							<span className="process-step-num">02</span>
							<div className="process-step-title">Get a quote</div>
							<p className="process-step-desc">I'll scope the work and give you a price</p>
						</div>
						<div className="process-step">
							<span className="process-step-num">03</span>
							<div className="process-step-title">I get to work</div>
							<p className="process-step-desc">Regular updates as progress happens</p>
						</div>
						<div className="process-step">
							<span className="process-step-num">04</span>
							<div className="process-step-title">Delivery</div>
							<p className="process-step-desc">Final handoff plus any revisions</p>
						</div>
					</div>
					{/* <Reviews /> */}
				</div>
			</section>

			{/* NEW SPLIT SECTION */}
		</main>
	);
}
