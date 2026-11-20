import { FaDiscord } from "react-icons/fa";
import CopyDiscord from "./copy-discord";
import Stars from "./stars";
import ThemeToggle from "./theme-toggle";
import WorkShowcase from "./work-showcase";
import { companies, projects } from "./projects-data";

// Edit these to match what you're currently taking on.
const SHORT_TERM_OPEN = true;
const LONG_TERM_OPEN = false;

const SKILLS = [
	{ title: "Gameplay systems", text: "Combat, abilities, round loops" },
	{ title: "Interfaces", text: "HUDs and menus wired to game data" },
	{ title: "Economies", text: "Shops, items and currencies, server-validated" },
	{ title: "Data and saving", text: "Player data that survives updates" },
	{ title: "Tools", text: "Admin panels and in-studio helpers" },
	{ title: "Optimization", text: "Profiling, cleanup and bug fixes" },
];

function Status({ label, open }: { label: string; open: boolean }) {
	return (
		<span className={open ? "pill pill--open" : "pill pill--closed"}>
			{label} {open ? "open" : "closed"}
		</span>
	);
}

function DevMeIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M0 1.12L0.45 7.05L13.91 7.42L16.91 10.42L16.88 13.69L13.91 16.54L7.27 16.5L6.41 13.84L0 14.25L0.38 18.56L3.52 22.46L6.67 23.62L14.29 23.62L18.56 22.09L21.71 19.31L23.96 14.59L23.96 9.75L22.46 5.77L19.69 2.62L14.29 0.34L1.05 0.34Z" />
		</svg>
	);
}

function RobloxIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M5.2 2L2 18.8 18.8 22 22 5.2 5.2 2ZM13.7 14.8L9.2 14 10 9.5l4.5.8-.8 4.5Z" />
		</svg>
	);
}

export default function Home() {
	return (
		<>
			<header className="top-bar" id="top">
				<a className="brand" href="#top">
					<span className="brand-mark" aria-hidden="true">
						&gt;_
					</span>
					<span>ItzMrRatsP</span>
				</a>
				<nav className="site-nav" aria-label="Main">
					<a href="#work">Work</a>
					<a href="#about">About</a>
					<a href="#experience">Experience</a>
					<ThemeToggle />
					<a className="button button--solid button--small" href="#contact">
						Contact
					</a>
				</nav>
			</header>

			<main>
				<section className="hero" aria-labelledby="hero-title">
					<Stars />
					<div className="wrap">
						<div className="hero-copy">
							<h1 id="hero-title">ItzMrRatsP</h1>
							<p className="hero-role">Full-stack Roblox developer</p>
							<p className="hero-sub">
								I build gameplay systems, interfaces and tools. My jam games placed 1st at RDC 2025 and
								2nd at Inspire 2024.
							</p>
							<div className="hero-actions">
								<a className="button button--solid" href="#work">
									See my work
								</a>
								<a className="button button--ghost" href="#contact">
									Get in touch
								</a>
								<Status label="Short-term" open={SHORT_TERM_OPEN} />
							</div>
						</div>

					</div>
				</section>

				<section className="section" id="work" aria-labelledby="work-title">
					<div className="wrap">
						<h2 id="work-title">Selected work</h2>
						<WorkShowcase projects={projects} />
					</div>
				</section>

				<section className="section" id="about" aria-labelledby="about-title">
					<div className="wrap about">
						<div>
							<h2 id="about-title">About</h2>
							<div className="about-text">
								<p>
									I’m a Roblox developer who works on both sides of a game, from server logic and data to
									the interface players see.
								</p>
								<p>
									I often join existing teams and follow their structure and conventions, whether it’s a
									single feature or ongoing development.
								</p>
							</div>
						</div>
						<ul className="skills">
							{SKILLS.map((s) => (
								<li key={s.title}>
									{s.title}
									<span>{s.text}</span>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section className="section" id="experience" aria-labelledby="experience-title">
					<div className="wrap">
						<h2 id="experience-title">Experience</h2>
						<ul className="timeline">
							{companies.map((c) => (
								<li key={c.name}>
									<a href={c.url} target="_blank" rel="noopener noreferrer">
										<span className="timeline-years">{c.years}</span>
										<span>
											<h3>
												{c.name} <span aria-hidden="true">↗</span>
											</h3>
											<p>{c.description}</p>
										</span>
									</a>
								</li>
							))}
						</ul>
					</div>
				</section>

				<section className="section" id="contact" aria-labelledby="contact-title">
					<div className="wrap">
						<div className="contact">
							<div>
								<h2 id="contact-title">Let’s work together</h2>
								<p>
									Discord is the quickest way to reach me. Send a short description of what you’re
									building and I’ll reply with a scope and price.
								</p>
								<div className="contact-status">
									<Status label="Short-term" open={SHORT_TERM_OPEN} />
									<Status label="Long-term" open={LONG_TERM_OPEN} />
								</div>
								<div className="contact-actions">
									<CopyDiscord />
									<a className="button button--ghost" href="https://discord.gg/2yKqAVQUWY" rel="noopener noreferrer">
										<FaDiscord size={16} /> Join Discord
									</a>
									<a className="button button--ghost" href="https://devme.app/@itzmrratsp" target="_blank" rel="noopener noreferrer">
										<DevMeIcon /> DevMe
									</a>
									<a className="button button--ghost" href="https://roblox.com/users/2536605621/profile" target="_blank" rel="noopener noreferrer">
										<RobloxIcon /> Roblox
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="site-footer">
				<div className="wrap footer-inner">
					<span>© {new Date().getFullYear()} ItzMrRatsP</span>
					<span>Roblox is a trademark of Roblox Corporation. This site is not affiliated with Roblox.</span>
				</div>
			</footer>
		</>
	);
}
