"use client";
import { useEffect, useState } from "react";
import { fetchThroughProxy } from "./cors-proxies";

const UNIVERSE_CACHE_KEY = "universeIdCache"; // shared format with CCUFrame's cache
const ICON_CACHE_KEY = "gameIconCache";

function loadUniverseCache(): Map<string, number> {
	try {
		const stored = localStorage.getItem(UNIVERSE_CACHE_KEY);
		if (stored) return new Map(JSON.parse(stored));
	} catch {
		// ignore — fall back to empty cache
	}
	return new Map();
}

function saveUniverseCache(cache: Map<string, number>) {
	try {
		localStorage.setItem(UNIVERSE_CACHE_KEY, JSON.stringify([...cache]));
	} catch {
		// ignore — e.g. private browsing
	}
}

function loadIconCache(): Record<string, string> {
	try {
		const stored = localStorage.getItem(ICON_CACHE_KEY);
		if (stored) return JSON.parse(stored);
	} catch {
		// ignore
	}
	return {};
}

function saveIconCache(cache: Record<string, string>) {
	try {
		localStorage.setItem(ICON_CACHE_KEY, JSON.stringify(cache));
	} catch {
		// ignore
	}
}

async function getUniverseId(placeId: string): Promise<number> {
	const cache = loadUniverseCache();
	const cached = cache.get(placeId);
	if (cached) return cached;

	const data = await fetchThroughProxy(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
	if (!data?.universeId) {
		throw new Error(`No universeId returned for place ${placeId}`);
	}

	cache.set(placeId, data.universeId);
	saveUniverseCache(cache);
	return data.universeId;
}

async function getGameIcon(universeId: number): Promise<string> {
	const cache = loadIconCache();
	const cached = cache[universeId];
	if (cached) return cached;

	const data = await fetchThroughProxy(
		`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`
	);
	const imageUrl = data?.data?.[0]?.imageUrl;
	if (!imageUrl) {
		throw new Error(`No icon returned for universe ${universeId}`);
	}

	cache[universeId] = imageUrl;
	saveIconCache(cache);
	return imageUrl;
}

export default function GameJamIcon({ placeId }: { placeId: string }) {
	const [iconUrl, setIconUrl] = useState<string | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const universeId = await getUniverseId(placeId);
				const url = await getGameIcon(universeId);
				if (!cancelled) setIconUrl(url);
			} catch (err) {
				console.error("Failed to load game icon:", err);
				if (!cancelled) setFailed(true);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [placeId]);

	if (failed) {
		return <div className="gamejam-icon gamejam-icon--fallback" />;
	}

	return (
		<div className="gamejam-icon">
			{iconUrl ? (
				<img
					src={iconUrl}
					alt=""
					className="gamejam-icon-img"
				/>
			) : (
				<div className="gamejam-icon-skeleton" />
			)}
		</div>
	);
}
