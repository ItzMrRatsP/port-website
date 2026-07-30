"use client";
import { useEffect, useRef, useState } from "react";
import GameJamIcon from "./gamejam-icon";
import GameThumbnail from "./game-thumbnail";
import { FaUsers } from "react-icons/fa";

type GameCCU = {
	universeId: number;
	rootPlaceId: number;
	name: string;
	playing: number;
	visits: number;
};

const PLACE_IDS = ["132813250731469", "123061227632512", "14228650765", "16127140865", "125700405216363"];

// Multiple proxies in priority order — if one is down/rate-limited, the next is tried.
// A per-request timeout matters here: some of these proxies don't fail fast,
// they just hang, which previously stalled the whole fetch chain and made
// stats look stuck on "loading...".
const PROXIES: ((url: string) => string)[] = [
	(url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
	(url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
	(url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
	(url) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

const PROXY_TIMEOUT_MS = 6000;
const LAST_GOOD_PROXY_KEY = "lastGoodProxyIndex";

// Try whichever proxy last worked first, instead of always starting from
// the top of the list and re-discovering the same outage every request.
function getPreferredOrder(): number[] {
	let preferred = 0;
	try {
		const stored = localStorage.getItem(LAST_GOOD_PROXY_KEY);
		if (stored) preferred = Number(stored) || 0;
	} catch {}
	const order = PROXIES.map((_, i) => i);
	if (preferred > 0 && preferred < order.length) {
		order.splice(order.indexOf(preferred), 1);
		order.unshift(preferred);
	}
	return order;
}

function rememberGoodProxy(index: number) {
	try {
		localStorage.setItem(LAST_GOOD_PROXY_KEY, String(index));
	} catch {}
}

function withTimeout(signal: AbortSignal | undefined, ms: number) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), ms);
	if (signal) {
		if (signal.aborted) controller.abort();
		else signal.addEventListener("abort", () => controller.abort(), { once: true });
	}
	return { signal: controller.signal, cancel: () => clearTimeout(timeoutId) };
}

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

	async function fetchThroughProxy(targetUrl: string, signal?: AbortSignal) {
		let lastError: unknown;
		for (const index of getPreferredOrder()) {
			const { signal: timedSignal, cancel } = withTimeout(signal, PROXY_TIMEOUT_MS);
			try {
				const res = await fetch(PROXIES[index](targetUrl), { signal: timedSignal });
				if (!res.ok) throw new Error(`Proxy request failed: ${res.status}`);
				const json = await res.json();
				rememberGoodProxy(index);
				return json;
			} catch (err) {
				if (signal?.aborted) throw err;
				lastError = err;
			} finally {
				cancel();
			}
		}
		throw lastError instanceof Error ? lastError : new Error("All proxies failed");
	}

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
