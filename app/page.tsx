import type { ReactNode } from "react";
import { FaDiscord } from "react-icons/fa";
import CopyDiscord from "./copy-discord";
import ThemeToggle from "./theme-toggle";
import WorkShowcase from "./work-showcase";
import { companies, projects } from "./projects-data";

// Edit these to match what you're currently taking on.
const AVAILABILITY = [
	{ label: "Short-term commissions", open: true },
	{ label: "Long-term development", open: false },
];

const SERVICES = [
	{
		title: "Gameplay systems",
		text: "Combat, abilities, round loops, objectives and the mechanics that make a game feel like itself.",
	},
	{
		title: "Shops, inventories and economies",
		text: "Purchases, item handling and currencies, built so they can’t be exploited from the client.",
	},
	{ title: "Interfaces", text: "Responsive, polished UI wired cleanly to your game’s data, from HUDs to menus." },
	{
		title: "Data and saving",
		text: "Reliable player data with sensible structure, so updates don’t break existing saves.",
	},
	{
		title: "Admin and developer tools",
		text: "Admin panels, moderation helpers and in-studio tools that save your team time.",
	},
	{
		title: "Optimization and bug fixes",
		text: "Profiling, cleaning up slow or leaky code and fixing the bugs that block your release.",
	},
];

const FAQ = [
	{
		q: "How do I pay?",
		a: "Either in USD (via Crypto) or Robux, at the rates listed above. We agree on the method when the quote is accepted.",
	},
	{
		q: "How is a commission scoped?",
		a: "You tell me what you need, I write back what’s included and a fixed price, and work starts once we both agree.",
	},
	{
		q: "What do I receive at the end?",
		a: "The finished system, ready to drop into your place, plus revisions during handoff.",
	},
	{
		q: "Can you join an existing project?",
		a: "Yes. I regularly work inside other teams’ codebases and can fit around your structure and conventions.",
	},
];

const LUAU = `return function(
    module: ModuleScript, into: { [string]: Move }
)
	local ok, result = xpcall(
        require,
        debug.traceback,
        module
    )
	if ok then
		local move = validate(module:GetFullName(), result)
		if move then
			move.id = module.Name
			into[module.Name] = move
		end
	else
		warn(\`[Moves] Failed to load {module:GetFullName()}\n{result}\`)
	end
end

for _, character in Characters do
	if character.exclusive then
		if not Whitelisted(player) then
			warn("Not whitelisted")
			continue
		end
	end

	Topbar.new()
		:setTextColor(
			if character.exclusive
				then EXCLUSIVE_COLOR
				else Color3.fromRGB(255, 255, 255)
		)
		:setLabel(character.displayName)
		:setImage(character.image)
		:oneClick(true)
		:joinDropdown(OPTIONS)
end`;

function highlight(code: string): ReactNode[] {
	return code.split(/(--.*|"[^"]*"|\b(?:local|function|if|not|then|return|end|false|true)\b)/g).map((t, i) =>
		i % 2 === 0 ? (
			t
		) : (
			<span
				key={i}
				className={t.startsWith("--") ? "tok-c" : t.startsWith('"') ? "tok-s" : "tok-k"}>
				{t}
			</span>
		)
	);
}

function RobloxIcon() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true">
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
			fill="currentColor"
			aria-hidden="true">
			<path d="M0 1.12L0.45 7.05L13.91 7.42L16.91 10.42L16.88 13.69L13.91 16.54L7.27 16.5L6.41 13.84L0 14.25L0.38 18.56L3.52 22.46L6.67 23.62L14.29 23.62L18.56 22.09L21.71 19.31L23.96 14.59L23.96 9.75L22.46 5.77L19.69 2.62L14.29 0.34L1.05 0.34Z" />
		</svg>
	);
}

export default function Home() {
	return (
		<>
			<header className="top-bar">
				<a
					className="brand"
					href="#top">
					<span
						className="brand-mark"
						aria-hidden="true">
						{"{}"}
					</span>
					<span>ItzMrRatsP</span>
				</a>
				<nav
					className="site-nav"
					aria-label="Main">
					<a href="#services">Services</a>
					<a href="#work">Work</a>
					<a href="#pricing">Pricing</a>
					<a href="#faq">FAQ</a>
					<ThemeToggle />
					<a
						className="button button--solid button--small"
						href="#contact">
						Get a quote
					</a>
				</nav>
			</header>

			<main id="top">
				{/* HERO */}
				<section
					className="hero"
					aria-labelledby="hero-title">
					<div className="wrap hero-grid">
						<div>
							<h1 id="hero-title">Roblox scripting commissions, scoped clearly and delivered clean.</h1>
							<p className="hero-sub">
								I’m ItzMrRatsP, a full-stack Roblox developer. Hire me for gameplay systems, interfaces
								and tools, from a single feature to ongoing development.
							</p>
							<div className="hero-actions">
								<a
									className="button button--solid button--large"
									href="#contact">
									Request a quote
								</a>
								<a
									className="button button--ghost button--large"
									href="#pricing">
									See pricing
								</a>
							</div>
							<ul
								className="availability"
								aria-label="Current availability">
								{AVAILABILITY.map((a) => (
									<li key={a.label}>
										<span
											className={a.open ? "dot dot--open" : "dot dot--closed"}
											aria-hidden="true"
										/>
										{a.label}: {a.open ? "open" : "closed"}
									</li>
								))}
							</ul>
						</div>
						{/*
						<figure className="code-panel">
							<figcaption>Module.luau</figcaption>
							<pre>
								<code>{highlight(LUAU)}</code>
							</pre>
							<div className="code-foot">
								<span>Fixed price</span>
								<span>Scoped first</span>
								<span>Ready to drop in</span>
							</div>
						</figure> */}
					</div>
				</section>

				{/* PROOF */}
				<section
					className="proof"
					aria-label="Highlights">
					<ul className="wrap proof-list">
						<li>
							<strong>1st place</strong> RDC 2025 game jam
						</li>
						<li>
							<strong>2nd place</strong> Inspire 2024 game jam
						</li>
						<li>
							<strong>{companies.length} studios</strong> and teams built with
						</li>
					</ul>
				</section>

				{/* SERVICES */}
				<section
					className="section"
					id="services"
					aria-labelledby="services-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="services-title">What I can build for you</h2>
							<p className="section-lede">
								Server and client, data to interface. If it runs inside your game, I can probably script
								it.
							</p>
						</div>
						<ul className="service-list">
							{SERVICES.map((s) => (
								<li key={s.title}>
									<h3>{s.title}</h3>
									<p>{s.text}</p>
								</li>
							))}
						</ul>
					</div>
				</section>

				{/* WORK */}
				<section
					className="section section--alt"
					id="work"
					aria-labelledby="work-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="work-title">Selected work</h2>
							<p className="section-lede">
								Shipped games I’ve built or helped build. Pick one for details, then play it on Roblox.
							</p>
						</div>
						<WorkShowcase projects={projects} />
					</div>
				</section>

				{/* PRICING */}
				<section
					className="section"
					id="pricing"
					aria-labelledby="pricing-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="pricing-title">Pricing</h2>
							<p className="section-lede">
								Two ways to work together, priced in USD or Robux. Pick one, then message me on Discord.
							</p>
						</div>

						<div className="plans">
							<article className="plan plan--featured">
								<ul className="plan-flags">
									<li className="plan-flag">Most booked</li>
									<li className="plan-flag plan-flag--closed">Currently closed</li>
								</ul>
								<h3>Long term</h3>
								<p className="plan-tag">Ongoing hourly development</p>
								<p className="plan-price">
									<span className="plan-amount">$20</span>
									<span className="plan-unit">per hour</span>
								</p>
								<p className="plan-alt">or 5K Robux per hour</p>
								<ul className="plan-features">
									<li>Systems, mechanics and gameplay scripting</li>
									<li>Tooling, optimization and bug fixes</li>
									<li>Full projects or drop-in collab work</li>
									<li>Regular progress updates as we go</li>
								</ul>
							</article>

							<article className="plan">
								<ul className="plan-flags">
									<li className="plan-flag plan-flag--open">Open</li>
								</ul>
								<h3>Short term</h3>
								<p className="plan-tag">Commissions and single systems</p>
								<p className="plan-price">
									<span className="plan-amount">$40</span>
									<span className="plan-unit">minimum</span>
								</p>
								<p className="plan-alt">or 10K Robux minimum</p>
								<ul className="plan-features">
									<li>One-off systems: shops, inventories, admin panels</li>
									<li>Fixed price, scoped before we start</li>
									<li>A good fit for a single feature or fix</li>
									<li>Delivered complete, ready to drop in</li>
								</ul>
							</article>
						</div>
					</div>
				</section>

				{/* PROCESS */}
				<section
					className="section section--alt"
					aria-labelledby="process-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="process-title">How a commission works</h2>
						</div>
						<ol className="steps">
							<li className="step">
								<span className="step-num">1</span>
								<h3>Reach out</h3>
								<p>Message me on Discord with what you need.</p>
							</li>
							<li className="step">
								<span className="step-num">2</span>
								<h3>Get a quote</h3>
								<p>I scope the work and give you a fixed price.</p>
							</li>
							<li className="step">
								<span className="step-num">3</span>
								<h3>I build</h3>
								<p>You get regular updates as things take shape.</p>
							</li>
							<li className="step">
								<span className="step-num">4</span>
								<h3>Handoff</h3>
								<p>Final delivery, plus any revisions.</p>
							</li>
						</ol>
					</div>
				</section>

				{/* EXPERIENCE */}
				<section
					className="section"
					aria-labelledby="companies-title">
					<div className="wrap">
						<div className="section-head">
							<h2 id="companies-title">Experience</h2>
							<p className="section-lede">Studios and teams I’ve built with.</p>
						</div>
						<ul className="company-grid">
							{companies.map((c) => {
								const current = /present/i.test(c.years);
								return (
									<li key={c.name}>
										<a
											className="company-card"
											href={c.url}
											target="_blank"
											rel="noopener noreferrer">
											<span
												className="company-arrow"
												aria-hidden="true">
												↗
											</span>
											<span className="company-name">{c.name}</span>
											{c.role && <span className="company-role">{c.role}</span>}
											<span className="company-desc">{c.description}</span>
											<span className="company-foot">
												<span className="company-years">{c.years}</span>
												{current && <span className="company-now">Ongoing</span>}
											</span>
										</a>
									</li>
								);
							})}
						</ul>
					</div>
				</section>

				{/* FAQ */}
				<section
					className="section section--alt"
					id="faq"
					aria-labelledby="faq-title">
					<div className="wrap faq-wrap">
						<h2 id="faq-title">Frequently Asked Questions</h2>
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
				<section
					className="section"
					id="contact"
					aria-labelledby="contact-title">
					<div className="wrap">
						<div className="contact">
							<h2 id="contact-title">Tell me what you’re building</h2>
							<p>
								Discord is the quickest way to reach me. Send a short description of the feature or
								project and I’ll reply with a scope and price.
							</p>
							<div className="contact-actions">
								<CopyDiscord />
								<a
									className="button button--ghost"
									href="https://discord.gg/2yKqAVQUWY"
									rel="noopener noreferrer">
									<FaDiscord size={16} /> Join Discord
								</a>
								<a
									className="button button--ghost"
									href="https://devme.app/@itzmrratsp"
									target="_blank"
									rel="noopener noreferrer">
									<DevMeIcon /> DevMe
								</a>
								<a
									className="button button--ghost"
									href="https://roblox.com/users/2536605621/profile"
									target="_blank"
									rel="noopener noreferrer">
									<RobloxIcon /> Roblox
								</a>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="site-footer">
				<div className="wrap footer-inner">
					<span>© {new Date().getFullYear()} ItzMrRatsP.</span>
					<span>Roblox is a trademark of Roblox Corporation. This site is not affiliated with Roblox.</span>
				</div>
			</footer>
		</>
	);
}
