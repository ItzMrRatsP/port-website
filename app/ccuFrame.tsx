"use client";
import GameJamIcon from "./gamejam-icon";
import { FaUsers } from "react-icons/fa";
import { useAllRobloxStats } from "./use-roblox-stats";

const PLACE_IDS = ["132813250731469", "123061227632512", "14228650765", "16127140865", "125700405216363"];

export default function CCUFrame() {
	const { entries, loading, error } = useAllRobloxStats(PLACE_IDS);

	const games = [...entries].sort((a, b) => b.playing - a.playing);
	const total = games.reduce((sum, g) => sum + g.playing, 0);
	const totalVisits = games.reduce((sum, g) => sum + g.visits, 0);

	return (
		<div className="ccu-frame">
			<div className="ccu-status">
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
			</div>

			{!error && (
				<div className="ccu-list">
					{games.map((game, i) => (
						<a
							key={game.universeId}
							href={`https://www.roblox.com/games/${game.rootPlaceId}`}
							target="_blank"
							rel="noopener noreferrer"
							className="ccu-row">
							<GameJamIcon placeId={game.placeId} />

							<div className="ccu-row-info">
								<code
									className="ccu-row-name"
									title={game.name}>
									{i === 0 && <span className="ccu-row-top">🔥</span>} {game.name}
								</code>
								<code className="ccu-row-sub">{game.visits.toLocaleString()} visits</code>
							</div>

							<div className="ccu-row-playing">
								<FaUsers size={11} />
								{game.playing.toLocaleString()}
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	);
}
