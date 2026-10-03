import CopyDiscord from "./copy-discord";
import Plate from "./plate";
import Reviews from "./reviews";
import ThemeToggle from "./theme-toggle";
import { crew, projects, studio, type Project } from "./projects-data";

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

// Three misty ridges. The front one is filled with the page colour so the
// hero melts into the content below it.
function Ridges() {
	return (
		<svg
			className="hero-ridges"
			viewBox="0 0 1440 400"
			preserveAspectRatio="none"
			aria-hidden="true">
			<path
				className="ridge-back"
				d="M0 190 C 140 140, 240 120, 380 150 S 600 210, 760 170 S 1040 90, 1200 130 S 1380 170, 1440 150 L1440 400 L0 400 Z"
			/>
			<path
				className="ridge-mid"
				d="M0 250 C 160 215, 320 200, 480 230 S 760 290, 940 245 S 1240 190, 1440 235 L1440 400 L0 400 Z"
			/>
			<path
				className="ridge-front"
				d="M0 320 C 200 290, 420 285, 640 310 S 1000 345, 1200 310 S 1380 300, 1440 310 L1440 400 L0 400 Z"
			/>
		</svg>
	);
}

function WorkItem({ project }: { project: Project }) {
	const label = `${project.name} on Roblox`;
	return (
		<article className="work">
			<a
				className="work-plate"
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				tabIndex={-1}
				aria-hidden="true">
				<Plate motif={project.motif} />
			</a>
			<div className="work-text">
				<h3>
					<a
						href={project.url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={label}>
						{project.name}
					</a>
				</h3>
				<p>{project.blurb}</p>
				{project.award && <p className="work-award">{project.award}</p>}
			</div>
		</article>
	);
}

export default function Home() {
	// Two staggered columns, like pictures hung at different heights.
	const colA = projects.filter((_, i) => i % 2 === 0);
	const colB = projects.filter((_, i) => i % 2 === 1);

	return (
		<>
			<header className="top-bar">
				<a
					className="brand"
					href="#top">
					itzmrratsp
				</a>
				<nav
					className="site-nav"
					aria-label="Main">
					<a href="#work">Work</a>
					<a href="#services">Services</a>
					<a href="#contact">Contact</a>
					<ThemeToggle />
				</nav>
			</header>

			<main id="top">
				{/* HERO */}
				<section
					className="landing"
					aria-labelledby="hero-title">
					<div
						className="hero-stars"
						aria-hidden="true"
					/>
					<div
						className="hero-sun"
						aria-hidden="true"
					/>
					<Ridges />
					<div className="wrap hero-inner">
						<h1 id="hero-title">I build the quiet systems that hold Roblox games together.</h1>
						<p className="hero-sub">
							Hi, I’m ItzMrRatsP, a full-stack Roblox developer. Gameplay, tools and interfaces: the parts
							players feel but rarely notice.
						</p>
						<div className="hero-actions">
							<CopyDiscord />
							<a
								className="link"
								href="#work">
								See my work
							</a>
						</div>
					</div>
				</section>

				{/* ABOUT */}
				<section
					className="section"
					aria-labelledby="about-title">
					<div className="wrap about">
						<h2
							className="about-lead"
							id="about-title">
							Full-stack Roblox developer building games, systems and everything in between.
						</h2>
						<div>
							<p className="about-body">
								I’ve spent the last couple of years building on Roblox, from small gameplay systems to
								full game loops. I care about clean code, quick iteration, and turning odd ideas into
								something people can actually play.
							</p>
							<p className="about-body">
								Away from the script editor I’m usually learning something new or helping another
								developer get unstuck. I’m mentored by{" "}
								<a
									className="link"
									href="https://dylwithlt.github.io/"
									target="_blank"
									rel="noopener noreferrer">
									DylWithIt
								</a>
								.
							</p>
						</div>
					</div>
				</section>

				{/* WORK */}
				<section
					className="section"
					id="work"
					aria-labelledby="work-title">
					<div className="wrap">
						<div className="work-head">
							<h2 id="work-title">Selected work</h2>
							<p className="section-lede">
								A few games I’ve built or helped build. Pick one to open it on Roblox.
							</p>
						</div>

						<div className="work-list">
							{projects.map((p) => (
								<WorkItem
									key={p.id}
									project={p}
								/>
							))}
						</div>

						<div className="work-grid">
							<div className="work-col">
								{colA.map((p) => (
									<WorkItem
										key={p.id}
										project={p}
									/>
								))}
							</div>
							<div className="work-col">
								{colB.map((p) => (
									<WorkItem
										key={p.id}
										project={p}
									/>
								))}
							</div>
						</div>

						<div className="crew">
							<div>
								<h3>The jam crew</h3>
								<p>
									3M1 and Malice were made with{" "}
									<a
										className="link"
										href={studio.url}
										target="_blank"
										rel="noopener noreferrer">
										{studio.name}
									</a>
									.
								</p>
							</div>
							<ul className="crew-list">
								{crew.map((m) => (
									<li key={m.name}>
										<a
											className="link"
											href={m.url}
											target="_blank"
											rel="noopener noreferrer">
											{m.name}
										</a>
										<span className="crew-role">{m.role}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{/* SERVICES */}
				<section
					className="section services"
					id="services"
					aria-labelledby="services-title">
					<div className="wrap">
						<h2 id="services-title">Working together</h2>
						<p className="section-lede">
							Two ways to get help. Pick the one that fits, then message me on Discord and we’ll sort out
							the details.
						</p>

						<div className="plans">
							<article className="plan">
								<span className="plan-flag">Most booked</span>
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

						<div className="process">
							<h3>How it works</h3>
							<ol className="steps">
								<li className="step">
									<span className="step-num">1</span>
									<h4>Reach out</h4>
									<p>Message me on Discord with what you need.</p>
								</li>
								<li className="step">
									<span className="step-num">2</span>
									<h4>Get a quote</h4>
									<p>I scope the work and give you a price.</p>
								</li>
								<li className="step">
									<span className="step-num">3</span>
									<h4>I build</h4>
									<p>You get regular updates as things take shape.</p>
								</li>
								<li className="step">
									<span className="step-num">4</span>
									<h4>Handoff</h4>
									<p>Final delivery, plus any revisions.</p>
								</li>
							</ol>
						</div>
					</div>
				</section>

				{/* <Reviews /> */}

				{/* CONTACT */}
				<section
					className="section contact"
					id="contact"
					aria-labelledby="contact-title">
					<div className="wrap">
						<h2 id="contact-title">Have something in mind?</h2>
						<p>
							Discord is the quickest way to reach me. Tell me what you’re building and we’ll go from
							there.
						</p>
						<div className="contact-actions">
							<CopyDiscord />
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
				</section>
			</main>

			<footer className="site-footer">© {new Date().getFullYear()} itzmrratsp</footer>
		</>
	);
}
