import type { CSSProperties } from "react";
import { FaDiscord } from "react-icons/fa";
import CopyDiscord from "./copy-discord";
import ThemeToggle from "./theme-toggle";
import WorkShowcase from "./work-showcase";
import { companies, projects } from "./projects-data";

// Edit these to match what you're currently taking on.
const SHORT_TERM_OPEN = true;
const LONG_TERM_OPEN = false;

const SERVICES = [
	{ file: "gameplay.luau", title: "Gameplay systems", text: "Combat, abilities, round loops, objectives and the mechanics that make a game feel like itself." },
	{ file: "economy.luau", title: "Shops, inventories and economies", text: "Purchases, items and currencies, validated on the server so they can’t be exploited from the client." },
	{ file: "interface.luau", title: "Interfaces", text: "Responsive, polished UI wired cleanly to your game’s data, from HUDs to menus." },
	{ file: "data.luau", title: "Data and saving", text: "Reliable player data with a sensible structure, so updates don’t break existing saves." },
	{ file: "tools.luau", title: "Admin and developer tools", text: "Admin panels, moderation helpers and in-studio tools that save your team time." },
	{ file: "optimize.luau", title: "Optimization and bug fixes", text: "Profiling, cleaning up slow or leaky code and fixing the bugs that block a release." },
];

const STEPS = [
	{ cmd: "reach-out", text: "Message me on Discord with what you need." },
	{ cmd: "get-quote", text: "I scope the work and give you a fixed price." },
	{ cmd: "build", text: "You get regular updates as things take shape." },
	{ cmd: "handoff", text: "Final delivery, plus any revisions." },
];

const FAQ = [
	{ q: "How do I pay?", a: "In USD or Robux, at the rates listed above. The method is agreed when the quote is accepted." },
	{ q: "How is a commission scoped?", a: "You describe what you need. I reply with what is included and a fixed price. Work starts once we both agree." },
	{ q: "What do I receive at the end?", a: "The finished system, ready to drop into your place, plus revisions during handoff." },
	{ q: "Can you join an existing project?", a: "Yes. I regularly work inside other teams’ codebases and follow their structure and conventions." },
];

// Hero terminal script. Typing and output timings are computed from this.
const TERM = [
	{ cmd: "whoami", out: [<>itzmrratsp, full-stack Roblox developer</>] },
	{
		cmd: "./commission --status",
		out: [
			<>short-term&nbsp;&nbsp;<b className={SHORT_TERM_OPEN ? "t-ok" : "t-bad"}>● {SHORT_TERM_OPEN ? "open" : "closed"}</b></>,
			<>long-term&nbsp;&nbsp;&nbsp;<b className={LONG_TERM_OPEN ? "t-ok" : "t-bad"}>● {LONG_TERM_OPEN ? "open" : "closed"}</b></>,
		],
	},
	{
		cmd: "./awards --list",
		out: [
			<><b className="t-warn">1st</b>&nbsp;&nbsp;RDC 2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3M1</>,
			<><b className="t-warn">2nd</b>&nbsp;&nbsp;Inspire 2024&nbsp;&nbsp;Malice</>,
		],
	},
];

let clock = 0.7;
const SCRIPT = TERM.map((s) => {
	const n = s.cmd.length;
	const start = clock;
	clock += n * 0.05 + 0.2;
	const outStart = clock;
	clock += s.out.length * 0.15 + 0.4;
	return { ...s, n, start, outStart };
});
const END_AT = clock;

function Status({ open }: { open: boolean }) {
	return <span className={open ? "pill pill--open" : "pill pill--closed"}>{open ? "Open" : "Closed"}</span>;
}

function RobloxIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M5.2 2L2 18.8 18.8 22 22 5.2 5.2 2ZM13.7 14.8L9.2 14 10 9.5l4.5.8-.8 4.5Z" />
		</svg>
	);
}

function DevMeIcon() {
	return (
		<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M0 1.12L0.45 7.05L13.91 7.42L16.91 10.42L16.88 13.69L13.91 16.54L7.27 16.5L6.41 13.84L0 14.25L0.38 18.56L3.52 22.46L6.67 23.62L14.29 23.62L18.56 22.09L21.71 19.31L23.96 14.59L23.96 9.75L22.46 5.77L19.69 2.62L14.29 0.34L1.05 0.34Z" />
		</svg>
	);
}

function WindowBar({ title }: { title: string }) {
	return (
		<div className="win-bar" aria-hidden="true">
			<span className="win-dots"><i /><i /><i /></span>
			<span className="win-title">{title}</span>
		</div>
	);
}

export default function Home() {
	return (
		<>
			<header className="top-bar" id="top">
				<a className="brand" href="#top">
					<span className="brand-mark" aria-hidden="true">&gt;_</span>
					<span>ItzMrRatsP</span>
				</a>
				<nav className="site-nav" aria-label="Main">
					<a href="#services">Services</a>
					<a href="#work">Work</a>
					<a href="#pricing">Pricing</a>
					<a href="#process">Process</a>
					<a href="#faq">FAQ</a>
					<ThemeToggle />
					<a className="button button--solid button--small" href="#contact">Get a quote</a>
				</nav>
			</header>

			<main>
				{/* HERO */}
				<section className="hero" aria-labelledby="hero-title">
					<div className="wrap hero-grid">
						<div className="hero-copy">
							<h1 id="hero-title">Roblox scripting commissions, scoped clearly and delivered clean.</h1>
							<p className="hero-sub">
								I’m ItzMrRatsP, a full-stack Roblox developer. Hire me for gameplay systems, interfaces and
								tools, from a single feature to ongoing development.
							</p>
							<div className="hero-actions">
								<a className="button button--solid button--large" href="#contact">Request a quote</a>
								<a className="button button--ghost button--large" href="#work">See my work</a>
							</div>
						</div>

						<div className="win win--term" role="img" aria-label="Terminal showing availability and awards">
							<WindowBar title="itzmrratsp@roblox: ~" />
							<div className="term-body" aria-hidden="true">
								{SCRIPT.map((s) => (
									<div key={s.cmd}>
										<div className="t-line">
											<span className="t-ps">$</span>{" "}
											<span
												className="t-type"
												style={{ "--n": s.n, "--d": `${s.start}s` } as CSSProperties}>
												{s.cmd}
											</span>
										</div>
										<div className="t-out" style={{ "--d": `${s.outStart}s` } as CSSProperties}>
											{s.out.map((o, i) => (
												<div key={i}>{o}</div>
											))}
										</div>
									</div>
								))}
								<div className="t-line t-end" style={{ "--d": `${END_AT}s` } as CSSProperties}>
									<span className="t-ps">$</span> <span className="cursor" />
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="trust" aria-label="Studios I’ve worked with">
					<div className="wrap trust-inner">
						<span className="trust-label">Built with</span>
						<ul>
							{companies.map((c) => (
								<li key={c.name}>
									<a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
								</li>
							))}
						</ul>
					</div>
				</section>

				{/* SERVICES */}
				<section className="section" id="services" aria-labelledby="services-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="services-title">What I can build for you</h2>
							<p className="section-lede">Server and client, data to interface. If it runs inside your game, I can probably script it.</p>
						</div>
						<ul className="cards">
							{SERVICES.map((s) => (
								<li className="card" key={s.file}>
									<span className="card-file">{s.file}</span>
									<h3>{s.title}</h3>
									<p>{s.text}</p>
								</li>
							))}
						</ul>
					</div>
				</section>

				{/* WORK */}
				<section className="section section--alt" id="work" aria-labelledby="work-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="work-title">Selected work</h2>
							<p className="section-lede">Shipped games I’ve built or helped build. Pick one for details, then play it on Roblox.</p>
						</div>
						<div className="win">
							<WindowBar title="~/releases" />
							<div className="win-body">
								<WorkShowcase projects={projects} />
							</div>
						</div>
					</div>
				</section>

				{/* PRICING */}
				<section className="section" id="pricing" aria-labelledby="pricing-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="pricing-title">Pricing</h2>
							<p className="section-lede">Two ways to work together, priced in USD or Robux. Pick one, then message me on Discord.</p>
						</div>
						<div className="plans">
							<article className="plan">
								<div className="plan-top">
									<span className="card-file">short-term.conf</span>
									<Status open={SHORT_TERM_OPEN} />
								</div>
								<h3>Short term</h3>
								<p className="plan-tag">Commissions and single systems</p>
								<p className="plan-price"><span className="plan-amount">$40</span><span className="plan-unit">minimum</span></p>
								<p className="plan-alt">or 10K Robux minimum</p>
								<ul className="plan-features">
									<li>One-off systems: shops, inventories, admin panels</li>
									<li>Fixed price, scoped before we start</li>
									<li>A good fit for a single feature or fix</li>
									<li>Delivered complete, ready to drop in</li>
								</ul>
							</article>
							<article className="plan plan--featured">
								<div className="plan-top">
									<span className="card-file">long-term.conf</span>
									<span className="plan-flags">
										<span className="pill">Most booked</span>
										<Status open={LONG_TERM_OPEN} />
									</span>
								</div>
								<h3>Long term</h3>
								<p className="plan-tag">Ongoing hourly development</p>
								<p className="plan-price"><span className="plan-amount">$20</span><span className="plan-unit">per hour</span></p>
								<p className="plan-alt">or 5K Robux per hour</p>
								<ul className="plan-features">
									<li>Systems, mechanics and gameplay scripting</li>
									<li>Tooling, optimization and bug fixes</li>
									<li>Full projects or drop-in collab work</li>
									<li>Regular progress updates as we go</li>
								</ul>
							</article>
						</div>
					</div>
				</section>

				{/* PROCESS */}
				<section className="section section--alt" id="process" aria-labelledby="process-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="process-title">How a commission works</h2>
						</div>
						<ol className="steps">
							{STEPS.map((s, i) => (
								<li className="step" key={s.cmd}>
									<span className="step-cmd"><span className="t-ps">$</span> {s.cmd}</span>
									<span className="step-num">{i + 1}</span>
									<p>{s.text}</p>
								</li>
							))}
						</ol>
					</div>
				</section>

				{/* EXPERIENCE */}
				<section className="section" aria-labelledby="companies-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="companies-title">Experience</h2>
							<p className="section-lede">Studios and teams I’ve built with.</p>
						</div>
						<ul className="cards cards--two">
							{companies.map((c) => {
								const current = /present/i.test(c.years);
								return (
									<li key={c.name}>
										<a className="card card--link" href={c.url} target="_blank" rel="noopener noreferrer">
											<span className="card-file">{c.years}{current && <span className="now"> · ongoing</span>}</span>
											<h3>{c.name} <span aria-hidden="true">↗</span></h3>
											<p>{c.description}</p>
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				</section>

				{/* FAQ */}
				<section className="section section--alt" id="faq" aria-labelledby="faq-title">
					<div className="wrap faq-wrap">
						<h2 id="faq-title">Common questions</h2>
						<div className="faq">
							{FAQ.map((f) => (
								<details key={f.q}>
									<summary>{f.q}</summary>
									<p>{f.a}</p>
								</details>
							))}
						</div>
					</div>
				</section>

				{/* CONTACT */}
				<section className="section" id="contact" aria-labelledby="contact-title">
					<div className="wrap">
						<div className="contact">
							<div>
								<h2 id="contact-title">Tell me what you’re building</h2>
								<p>Discord is the quickest way to reach me. Send a short description of the feature or project and I’ll reply with a scope and price.</p>
								<div className="contact-actions">
									<CopyDiscord />
									<a className="button button--ghost" href="https://discord.gg/2yKqAVQUWY" rel="noopener noreferrer"><FaDiscord size={16} /> Join Discord</a>
									<a className="button button--ghost" href="https://devme.app/@itzmrratsp" target="_blank" rel="noopener noreferrer"><DevMeIcon /> DevMe</a>
									<a className="button button--ghost" href="https://roblox.com/users/2536605621/profile" target="_blank" rel="noopener noreferrer"><RobloxIcon /> Roblox</a>
								</div>
							</div>
							<div className="win win--term">
								<WindowBar title="quote-request.txt" />
								<pre className="term-body">{`To:       itzmrratsp (Discord)
Subject:  [COMMISSION] <what you need>

What are you building?
What should it do?
Deadline and budget (USD or Robux)?`}</pre>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="site-footer">
				<div className="wrap footer-inner">
					<span>© {new Date().getFullYear()} ItzMrRatsP. Roblox scripting commissions.</span>
					<span>Roblox is a trademark of Roblox Corporation. This site is not affiliated with Roblox.</span>
				</div>
			</footer>
		</>
	);
}
