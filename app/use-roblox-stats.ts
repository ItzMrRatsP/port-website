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

const DATA_URL = "/data/roblox-stats.json";

// Single shared fetch — every component calling the hooks below piggybacks
// on this one request instead of each firing its own.
let cachedPromise: Promise<StatsFile> | null = null;

function loadStats(): Promise<StatsFile> {
	if (!cachedPromise) {
		cachedPromise = fetch(DATA_URL, { cache: "no-store" })
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load roblox-stats.json: ${res.status}`);
				return res.json();
			})
			.catch((err) => {
				cachedPromise = null; // allow a retry on the next call
				throw err;
			});
	}
	return cachedPromise;
}

export function useRobloxStats(placeId: string) {
	const [stats, setStats] = useState<RobloxGameStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;

		loadStats()
			.then((file) => {
				if (cancelled) return;
				const entry = file.games[placeId];
				if (entry) {
					setStats(entry);
				} else {
					setError(true);
				}
			})
			.catch(() => {
				if (!cancelled) setError(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [placeId]);

	return { stats, loading, error };
}

export function useAllRobloxStats(placeIds: string[]) {
	const [entries, setEntries] = useState<RobloxGameStats[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [generatedAt, setGeneratedAt] = useState<string | null>(null);

	const key = placeIds.join(",");

	useEffect(() => {
		let cancelled = false;

		loadStats()
			.then((file) => {
				if (cancelled) return;
				const results = placeIds
					.map((id) => file.games[id])
					.filter((g): g is RobloxGameStats => Boolean(g));
				setEntries(results);
				setGeneratedAt(file.generatedAt);
			})
			.catch(() => {
				if (!cancelled) setError(true);
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	return { entries, loading, error, generatedAt };
}
