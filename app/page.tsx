"use client";
import { useState, useEffect, useRef } from "react";
import VideoPlayer from "./video-player";

import { FaGithub, FaDiscord } from "react-icons/fa";

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
			// background scrolls slower than the content (classic parallax),
			// so as you move between sections the grid visibly drifts too
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

		setTimeout(() => {
			setCopied(false);
		}, 2000);
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
								href="#videos"
								onClick={scrollToSection("videos")}>
								WORKS
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
							<img src="/main.png" />
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
							<span className="prompt">&gt;</span>
							<FaDiscord size={16} />
							{copied ? "Copied!" : "Discord"}
						</button>

						<a
							className="terminal-button terminal-button--outline"
							href="https://github.com/itzmrratsp"
							target="_blank"
							rel="noopener noreferrer">
							<FaGithub size={16} />
							GitHub
						</a>

						<a
							className="terminal-button terminal-button--outline"
							href="https://roblox.com/users/2536605621/profile"
							target="_blank"
							rel="noopener noreferrer">
							<RobloxIcon />
							Roblox
						</a>
					</div>
				</div>
			</section>

			<section
				id="videos"
				className="hero hero--works">
				<div className="hero-content">
					<code className="terminal-tag terminal-tag--small">previous works</code>

					<div className="video-grid">
						<VideoPlayer
							src="https://vz-973fa720-e4f.b-cdn.net/40868fc2-03cc-4686-a5ff-ce5b40faa675/playlist.m3u8"
							title="Clean Keyboard"
						/>

						<VideoPlayer
							src="https://vz-973fa720-e4f.b-cdn.net/45e093fe-911b-4e05-b224-9f6f4e701ffb/playlist.m3u8"
							title="+1 Pogo Stick"
						/>

						<VideoPlayer
							src="https://vz-973fa720-e4f.b-cdn.net/3550f645-18b6-405a-9d33-4b0e72304e7e/playlist.m3u8"
							title="Slide for Dumplings"
						/>
					</div>

					<code className="copyright">© {new Date().getFullYear()} ItzMrRatsP. All rights reserved.</code>
				</div>
			</section>
		</main>
	);
}
