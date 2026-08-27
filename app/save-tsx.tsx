return (
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

					<div className="jam-list">
						{/* 3M1 */}
						<a
							href="https://www.roblox.com/games/88481183745824/3M1"
							target="_blank"
							rel="noopener noreferrer"
							className="jam-row">
							<GameJamIcon placeId="88481183745824" />
							<div className="jam-row-info">
								<code className="jam-row-name">3M1</code>
								<code className="jam-row-sub">RDC 2025 · Break the System</code>
							</div>
							<div className="jam-row-badge jam-row-badge--gold">1st</div>
						</a>

						{/* Malice */}
						<a
							href="https://www.roblox.com/games/18892236729/MALICE"
							target="_blank"
							rel="noopener noreferrer"
							className="jam-row">
							<GameJamIcon placeId="18892236729" />
							<div className="jam-row-info">
								<code className="jam-row-name">Malice</code>
								<code className="jam-row-sub">Inspire 2024 · Time is Your Enemy</code>
							</div>
							<div className="jam-row-badge jam-row-badge--silver">2nd</div>
						</a>
					</div>

					<div className="team-list">
						<a
							href="https://www.roblox.com/users/2536605621/profile"
							target="_blank"
							rel="noopener noreferrer"
							title="Programmer / UI"
							className="team-chip">
							<FaCode size={13} /> ItzMrRatsP
						</a>
						<a
							href="https://www.roblox.com/users/129843010/profile?friendshipSourceType=PlayerSearch"
							target="_blank"
							rel="noopener noreferrer"
							title="Programmer / Ideas / Story"
							className="team-chip">
							<FaLightbulb size={13} /> BigUniverses
						</a>
						<a
							href="https://www.roblox.com/users/87768826"
							target="_blank"
							rel="noopener noreferrer"
							title="Builder / Lead Story Writer"
							className="team-chip">
							<FaHammer size={13} /> Boneblox
						</a>
						<a
							href="https://www.roblox.com/users/4998832582/profile?friendshipSourceType=PlayerSearch"
							target="_blank"
							rel="noopener noreferrer"
							title="Modeler"
							className="team-chip">
							<FaCube size={13} /> Stefano_css
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
);
