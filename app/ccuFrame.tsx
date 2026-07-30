"use client";
import GameJamIcon from "./gamejam-icon";
import GameThumbnail from "./game-thumbnail";
import { FaUsers } from "react-icons/fa";
import { useAllRobloxStats } from "./use-roblox-stats";

const PLACE_IDS = ["132813250731469", "123061227632512", "14228650765", "16127140865", "125700405216363"];

export default function CCUFrame() {
	const { entries, loading, error } = useAllRobloxStats(PLACE_IDS);

	const games = [...entries].sort((a, b) => b.playing - a.playing);
	const total = games.reduce((sum, g) => sum + g.playing, 0);
	const totalVisits = games.reduce((sum, g) => sum + g.visits, 0);

	const topGame = games[0];
	const restGames = games.slice(1);

	return (
		<div className="ccu-frame">
			<div className="ccu-header">
				<div className="ccu-dot" />
				<code className="ccu-text">
					{error ? "offline" : loading ? "loading..." : `${total.toLocaleString()} playing now`}
				</code>
			</div>

			{!error && !loading && (
				<code className="ccu-total-visits">
					{totalVisits.toLocaleString()} total visits across {games.length} games
				</code>
			)}

			{!error && topGame && (
				<a
					href={`https://www.roblox.com/games/${topGame.rootPlaceId}`}
					target="_blank"
					rel="noopener noreferrer"
					className="ccu-top-card">
					{/* Full width thumbnail on top */}
					<div className="ccu-top-thumbnail-wrapper">
						<GameThumbnail placeId={topGame.placeId} />
					</div>

					<div className="ccu-top-content">
						<GameJamIcon placeId={topGame.placeId} />
						<div className="ccu-top-info">
							<div className="ccu-top-badge">🔥 most played</div>
							<code
								className="ccu-top-name"
								title={topGame.name}>
								{topGame.name}
							</code>
							<div className="ccu-top-stats">
								<code className="ccu-row-count">{topGame.playing.toLocaleString()} playing</code>
								<code className="ccu-row-visits">{topGame.visits.toLocaleString()} visits</code>
							</div>
						</div>
					</div>
				</a>
			)}

			{!error && restGames.length > 0 && (
				<div className="ccu-list">
					{restGames.map((game) => (
						<a
							key={game.universeId}
							href={`https://www.roblox.com/games/${game.rootPlaceId}`}
							target="_blank"
							rel="noopener noreferrer"
							className="ccu-card">
							<GameJamIcon placeId={game.placeId} />
							<code
								className="ccu-row-name"
								title={game.name}>
								{game.name}
							</code>

							<div className="ccu-row-stats">
								<span className="gamejam-tag ccu-stat-pill">
									<FaUsers size={12} /> {game.playing.toLocaleString()} playing
								</span>
								<span className="gamejam-tag ccu-stat-pill">{game.visits.toLocaleString()} visits</span>
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	);
}
