"use client";
import { useEffect, useState } from "react";

const PROXIES: ((url: string) => string)[] = [
	(url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
	(url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
	(url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
	(url) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

const PROXY_TIMEOUT_MS = 6000;
const LAST_GOOD_PROXY_KEY = "lastGoodProxyIndex"; // shared with CCUFrame/gamejam-icon

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

function withTimeout(ms: number) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), ms);
	return { signal: controller.signal, cancel: () => clearTimeout(timeoutId) };
}

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

async function fetchThroughProxy(targetUrl: string) {
	let lastError: unknown;
	for (const index of getPreferredOrder()) {
		const { signal, cancel } = withTimeout(PROXY_TIMEOUT_MS);
		try {
			const res = await fetch(PROXIES[index](targetUrl), { signal });
			if (!res.ok) throw new Error(`Proxy failed: ${res.status}`);
			const json = await res.json();
			rememberGoodProxy(index);
			return json;
		} catch (err) {
			lastError = err;
		} finally {
			cancel();
		}
	}
	throw lastError instanceof Error ? lastError : new Error("All proxies failed");
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
