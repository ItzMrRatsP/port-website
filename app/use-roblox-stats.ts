"use client";
import { useEffect, useState } from "react";

export type RobloxGameStats = {
	placeId: string;
	universeId: number;
	rootPlaceId: number;
	name: string;
	playing: number;
	visits: number;
	icon: string | null;
	thumbnail: string | null;
};

type StatsFile = {
	generatedAt: string | null;
	games: Record<string, RobloxGameStats>;
};

// TODO: replace <owner>/<repo> with your actual GitHub username/repo
// (e.g. "itzmrratsp/itzmrratsp.github.io" for a user page, or
// "itzmrratsp/portfolio" for a project repo).
//
// raw.githubusercontent.com sends `Access-Control-Allow-Origin: *`, so this
// can be fetched directly from the browser cross-origin with no proxy and
// no CORS issue — as long as the request stays a plain GET with no custom
// headers and no credentials (both true below). It also means stats update
// the moment update-stats.yml pushes a new commit, with no Pages
// rebuild/redeploy needed in between.
const REMOTE_DATA_URL = "https://raw.githubusercontent.com/itzmrratsp/port-website/master/public/data/roblox-stats.json";

// Same-origin fallback: whatever copy of the file was baked into the site
// at the last actual deploy. Used only if the remote fetch fails (e.g. a
// GitHub outage), so the page still shows *something* instead of breaking.
const LOCAL_FALLBACK_URL = "/data/roblox-stats.json";

// Re-poll while a tab is open so numbers update live without a page reload.
// raw.githubusercontent.com itself is generally fresh within a couple of
// minutes of a new commit, so there's little value polling much faster.
const POLL_INTERVAL_MS = 60_000;

let cache: StatsFile | null = null;
let inflight: Promise<StatsFile> | null = null;
const subscribers = new Set<(file: StatsFile) => void>();
let pollingStarted = false;

async function fetchStats(): Promise<StatsFile> {
	try {
		// Cache-bust the URL so an intermediate cache doesn't hand back a
		// stale copy; `no-store` stops the browser's own HTTP cache too.
		const res = await fetch(`${REMOTE_DATA_URL}?_=${Date.now()}`, { cache: "no-store" });
		if (!res.ok) throw new Error(`Remote stats fetch failed: ${res.status}`);
		const file: StatsFile = await res.json();
		cache = file;
		subscribers.forEach((cb) => cb(file));
		return file;
	} catch (remoteErr) {
		// Remote fetch failed — fall back to the site's own bundled copy
		// rather than showing an error to every visitor.
		const res = await fetch(LOCAL_FALLBACK_URL, { cache: "no-store" });
		if (!res.ok) throw remoteErr;
		const file: StatsFile = await res.json();
		cache = file;
		subscribers.forEach((cb) => cb(file));
		return file;
	}
}

function ensurePolling() {
	if (pollingStarted) return;
	pollingStarted = true;
	setInterval(() => {
		fetchStats().catch(() => {
			// keep serving the last good cache on a failed refresh
		});
	}, POLL_INTERVAL_MS);
}

function loadStats(): Promise<StatsFile> {
	if (cache) return Promise.resolve(cache);
	if (!inflight) {
		inflight = fetchStats().finally(() => {
			inflight = null;
		});
	}
	return inflight;
}

export function useRobloxStats(placeId: string) {
	const [stats, setStats] = useState<RobloxGameStats | null>(cache?.games[placeId] ?? null);
	const [loading, setLoading] = useState(!cache);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		ensurePolling();

		const onUpdate = (file: StatsFile) => {
			if (cancelled) return;
			const entry = file.games[placeId];
			if (entry) {
				setStats(entry);
				setError(false);
			} else {
				setError(true);
			}
			setLoading(false);
		};

		subscribers.add(onUpdate);
		loadStats()
			.then(onUpdate)
			.catch(() => {
				if (!cancelled) {
					setError(true);
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
			subscribers.delete(onUpdate);
		};
	}, [placeId]);

	return { stats, loading, error };
}

export function useAllRobloxStats(placeIds: string[]) {
	const [entries, setEntries] = useState<RobloxGameStats[]>(() =>
		cache ? placeIds.map((id) => cache!.games[id]).filter((g): g is RobloxGameStats => Boolean(g)) : []
	);
	const [loading, setLoading] = useState(!cache);
	const [error, setError] = useState(false);
	const [generatedAt, setGeneratedAt] = useState<string | null>(cache?.generatedAt ?? null);

	const key = placeIds.join(",");

	useEffect(() => {
		let cancelled = false;
		ensurePolling();

		const onUpdate = (file: StatsFile) => {
			if (cancelled) return;
			const results = placeIds
				.map((id) => file.games[id])
				.filter((g): g is RobloxGameStats => Boolean(g));
			setEntries(results);
			setGeneratedAt(file.generatedAt);
			setLoading(false);
		};

		subscribers.add(onUpdate);
		loadStats()
			.then(onUpdate)
			.catch(() => {
				if (!cancelled) {
					setError(true);
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
			subscribers.delete(onUpdate);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	return { entries, loading, error, generatedAt };
}
