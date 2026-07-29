import { useEffect, useRef, useState } from "react";

type GameCCU = {
	universeId: number;
	rootPlaceId: number;
	name: string;
	playing: number;
	visits: number;
};

const PLACE_IDS = ["132813250731469", "123061227632512", "14228650765", "16127140865", "125700405216363"];

// Multiple proxies in priority order — if one is down/rate-limited, the next is tried
const PROXIES: { build: (url: string) => string; unwrap?: (json: any) => any }[] = [
	{
		build: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
	},
	{
		build: (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
	},
	{
		build: (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
	},
];

const CACHE_KEY = "universeIdCache";

function loadCache(): Map<string, number> {
	try {
		const stored = localStorage.getItem(CACHE_KEY);
		if (stored) return new Map(JSON.parse(stored));
	} catch {
		// localStorage unavailable or corrupted data — fall back to empty cache
	}
	return new Map();
}

function saveCache(cache: Map<string, number>) {
	try {
		localStorage.setItem(CACHE_KEY, JSON.stringify([...cache]));
	} catch {
		// localStorage unavailable (e.g. private browsing) — safe to ignore
	}
}

export default function CCUFrame() {
	const [games, setGames] = useState<GameCCU[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [totalVisits, setTotalVisits] = useState<number | null>(null);
	const [error, setError] = useState(false);

	// cache placeId -> universeId across polls AND across reloads, since it never changes
	const universeCache = useRef<Map<string, number>>(loadCache());

	async function fetchThroughProxy(targetUrl: string, signal?: AbortSignal) {
		let lastError: unknown;

		for (const proxy of PROXIES) {
			try {
				const res = await fetch(proxy.build(targetUrl), { signal });
				if (!res.ok) {
					throw new Error(`Proxy request failed: ${res.status}`);
				}
				const json = await res.json();
				return proxy.unwrap ? proxy.unwrap(json) : json;
			} catch (err) {
				// If the request was aborted (cleanup/unmount), stop trying immediately
				if (err instanceof DOMException && err.name === "AbortError") {
					throw err;
				}
				lastError = err;
				// otherwise fall through and try the next proxy in the list
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
			// Ignore aborts from cleanup/Strict Mode double-invoke — not a real failure
			if (err instanceof DOMException && err.name === "AbortError") {
				return;
			}

			// Transient proxy hiccups are common — retry once after a short delay
			// before surfacing an error to the user
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

	return (
		<div className="ccu-frame">
			<div className="ccu-header">
				<div className="ccu-dot" />
				<code className="ccu-text">
					{error ? "offline" : total === null ? "loading..." : `${total.toLocaleString()} playing now`}
				</code>
			</div>

			{!error && totalVisits !== null && (
				<code className="ccu-total-visits">{totalVisits.toLocaleString()} total visits</code>
			)}

			{!error && games.length > 0 && (
				<div className="ccu-list">
					{games.map((game) => (
						<div
							key={game.universeId}
							className="ccu-row">
							<a
								href={`https://www.roblox.com/games/${game.rootPlaceId}`}
								target="_blank"
								rel="noopener noreferrer"
								className="ccu-row-name">
								{game.name}
							</a>
							<div className="ccu-row-stats">
								<code className="ccu-row-count">{game.playing.toLocaleString()} playing</code>
								<code className="ccu-row-visits">{game.visits.toLocaleString()} visits</code>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
