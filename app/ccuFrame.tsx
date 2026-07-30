"use client";
import { useEffect, useRef, useState } from "react";
import GameJamIcon from "./gamejam-icon";
import GameThumbnail from "./game-thumbnail";
import { FaUsers } from "react-icons/fa";
import { fetchThroughProxy } from "./cors-proxies";

type GameCCU = {
	universeId: number;
	rootPlaceId: number;
	name: string;
	playing: number;
	visits: number;
};

const PLACE_IDS = ["132813250731469", "123061227632512", "14228650765", "16127140865", "125700405216363"];

const CACHE_KEY = "universeIdCache";

function loadCache(): Map<string, number> {
	try {
		const stored = localStorage.getItem(CACHE_KEY);
		if (stored) return new Map(JSON.parse(stored));
	} catch {
		return new Map();
	}
	return new Map();
}

function saveCache(cache: Map<string, number>) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify([...cache]));
	} catch {}
}

export default function CCUFrame() {
	const [games, setGames] = useState<GameCCU[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [totalVisits, setTotalVisits] = useState<number | null>(null);
	const [error, setError] = useState(false);

	const universeCache = useRef<Map<string, number>>(loadCache());

	async function getUniverseId(placeId: string, signal?: AbortSignal): Promise<number> {
		const cached = universeCache.current.get(placeId);
		if (cached) return cached;

		const targetUrl = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
		const data = await fetchThroughProxy(targetUrl, signal);

		if (!data?.universeId) {
			throw new Error(`No universeId returned for place ${placeId}`);
		}

		universeCache.current.set(placeId, data.universeId);
		saveCache(universeCache.current);
		return data.universeId;
	}

	async function fetchCCU(signal?: AbortSignal, isRetry = false) {
		try {
			const universeIds = await Promise.all(PLACE_IDS.map((placeId) => getUniverseId(placeId, signal)));
			const idsParam = universeIds.join(",");

			const targetUrl = `https://games.roblox.com/v1/games?universeIds=${idsParam}`;
			const data = await fetchThroughProxy(targetUrl, signal);

			if (!Array.isArray(data?.data)) {
				throw new Error("Unexpected response shape from Roblox API");
			}

			const results: GameCCU[] = data.data
				.map((game: any) => ({
					universeId: game.id,
					rootPlaceId: game.rootPlaceId,
					name: game.name,
					playing: game.playing ?? 0,
					visits: game.visits ?? 0,
				}))
				.sort((a: GameCCU, b: GameCCU) => b.playing - a.playing);

			setGames(results);
			setTotal(results.reduce((sum, g) => sum + g.playing, 0));
			setTotalVisits(results.reduce((sum, g) => sum + g.visits, 0));
			setError(false);
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			if (!isRetry) {
				console.warn("CCU fetch failed, retrying once:", err);
				await new Promise((resolve) => setTimeout(resolve, 2000));
				if (signal?.aborted) return;
				return fetchCCU(signal, true);
			}
			console.error("CCU fetch failed after retry:", err);
			setError(true);
		}
	}

	useEffect(() => {
		const controller = new AbortController();
		fetchCCU(controller.signal);

		const interval = setInterval(() => {
			fetchCCU(controller.signal);
		}, 60000);

		return () => {
			controller.abort();
			clearInterval(interval);
		};
	}, []);

	const topGame = games[0];
	const restGames = games.slice(1);

	return (
		<div className="ccu-frame">
			<div className="ccu-header">
				<div className="ccu-dot" />
				<code className="ccu-text">
					{error ? "offline" : total === null ? "loading..." : `${total.toLocaleString()} playing now`}
				</code>
			</div>

			{!error && totalVisits !== null && (
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
						<GameThumbnail universeId={topGame.universeId} />
					</div>

					<div className="ccu-top-content">
						<GameJamIcon placeId={String(topGame.rootPlaceId)} />
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
							<GameJamIcon placeId={String(game.rootPlaceId)} />
							<code
								className="ccu-row-name"
								title={game.name}>
								{game.name}
							</code>

							{/* Merged Stat Styling: Pills instead of plain text */}
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
