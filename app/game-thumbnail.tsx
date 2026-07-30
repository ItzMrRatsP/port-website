"use client";
import { useEffect, useState } from "react";
import { fetchThroughProxy } from "./cors-proxies";

const THUMBNAIL_CACHE_KEY = "gameThumbnailCache";

function loadThumbnailCache(): Record<string, string> {
	try {
		const stored = localStorage.getItem(THUMBNAIL_CACHE_KEY);
		if (stored) return JSON.parse(stored);
	} catch {
		// ignore
	}
	return {};
}

function saveThumbnailCache(cache: Record<string, string>) {
	try {
		localStorage.setItem(THUMBNAIL_CACHE_KEY, JSON.stringify(cache));
	} catch {
		// ignore
	}
}

async function getGameThumbnail(universeId: number): Promise<string> {
	const cache = loadThumbnailCache();
	const cached = cache[universeId];
	if (cached) return cached;

	const data = await fetchThroughProxy(
		`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=1&size=768x432&format=Png&isCircular=false`
	);
	const imageUrl = data?.data?.[0]?.thumbnails?.[0]?.imageUrl;
	if (!imageUrl) {
		throw new Error(`No thumbnail returned for universe ${universeId}`);
	}

	cache[universeId] = imageUrl;
	saveThumbnailCache(cache);
	return imageUrl;
}

export default function GameThumbnail({ universeId }: { universeId: number }) {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const url = await getGameThumbnail(universeId);
				if (!cancelled) setImageUrl(url);
			} catch (err) {
				console.error("Failed to load game thumbnail:", err);
				if (!cancelled) setFailed(true);
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, [universeId]);

	if (failed) {
		return null; // fail silently — the icon + text still carries the card
	}

	return (
		<div className="game-thumbnail">
			{imageUrl ? (
				<img
					src={imageUrl}
					alt=""
					className="game-thumbnail-img"
				/>
			) : (
				<div className="game-thumbnail-skeleton" />
			)}
		</div>
	);
}
