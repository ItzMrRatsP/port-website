// Runs in GitHub Actions (plain Node, not a browser) — so CORS never
// applies here at all. This hits Roblox directly, bundles everything the
// frontend needs into one JSON file, and that file ships as part of the
// static site. The frontend then just fetches /data/roblox-stats.json —
// same-origin, instant, zero external calls, zero proxy at runtime.
//
// IMPORTANT: keep this list in sync with the place IDs used in
// ccuFrame.tsx (PLACE_IDS) and page.tsx (the gamejam-grid entries).

const PLACE_IDS = [
	// CCUFrame games
	"132813250731469",
	"123061227632512",
	"14228650765",
	"16127140865",
	"125700405216363",
	// Game jam entries
	"88481183745824", // 3M1
	"18892236729", // Malice
];

const OUTPUT_PATH = new URL("../public/data/roblox-stats.json", import.meta.url);

async function readExisting() {
	try {
		const fs = await import("node:fs/promises");
		const raw = await fs.readFile(OUTPUT_PATH, "utf-8");
		return JSON.parse(raw);
	} catch {
		return { generatedAt: null, games: {} };
	}
}

async function getUniverseId(placeId) {
	const res = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
	if (!res.ok) throw new Error(`universe lookup failed for ${placeId}: ${res.status}`);
	const data = await res.json();
	if (!data.universeId) throw new Error(`no universeId for ${placeId}`);
	return data.universeId;
}

async function main() {
	const existing = await readExisting();
	const games = { ...existing.games };

	// Step 1: resolve placeId -> universeId for every entry
	const universeIds = {};
	for (const placeId of PLACE_IDS) {
		try {
			universeIds[placeId] = await getUniverseId(placeId);
			console.log(`resolved ${placeId} -> universe ${universeIds[placeId]}`);
		} catch (err) {
			console.warn(`failed to resolve ${placeId}:`, err.message);
			// keep whatever was in the file before for this entry, if anything
		}
	}

	const resolvedIds = Object.values(universeIds);
	if (resolvedIds.length === 0) {
		console.error("No universe IDs resolved this run — aborting without overwriting existing data.");
		process.exit(1);
	}
	const idsParam = resolvedIds.join(",");

	// Step 2: batch-fetch live stats (playing / visits / name / rootPlaceId)
	const statsByUniverse = {};
	try {
		const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${idsParam}`);
		if (!res.ok) throw new Error(`games endpoint failed: ${res.status}`);
		const data = await res.json();
		for (const game of data.data ?? []) {
			statsByUniverse[game.id] = game;
		}
	} catch (err) {
		console.warn("failed to fetch game stats batch:", err.message);
	}

	// Step 3: batch-fetch icons
	const iconsByUniverse = {};
	try {
		const res = await fetch(
			`https://thumbnails.roblox.com/v1/games/icons?universeIds=${idsParam}&size=512x512&format=Png&isCircular=false`
		);
		if (!res.ok) throw new Error(`icons endpoint failed: ${res.status}`);
		const data = await res.json();
		for (const entry of data.data ?? []) {
			iconsByUniverse[entry.targetId] = entry.imageUrl;
		}
	} catch (err) {
		console.warn("failed to fetch icons batch:", err.message);
	}

	// Step 4: batch-fetch thumbnails (in-game screenshots)
	const thumbsByUniverse = {};
	try {
		const res = await fetch(
			`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${idsParam}&countPerUniverse=1&size=768x432&format=Png&isCircular=false`
		);
		if (!res.ok) throw new Error(`thumbnails endpoint failed: ${res.status}`);
		const data = await res.json();
		for (const entry of data.data ?? []) {
			const url = entry.thumbnails?.[0]?.imageUrl;
			if (url) thumbsByUniverse[entry.universeId] = url;
		}
	} catch (err) {
		console.warn("failed to fetch thumbnails batch:", err.message);
	}

	// Step 5: assemble one record per placeId, falling back to the
	// previous value for anything that failed this run
	for (const placeId of PLACE_IDS) {
		const universeId = universeIds[placeId];
		if (!universeId) continue; // keep whatever existed before for this one

		const stats = statsByUniverse[universeId];
		const icon = iconsByUniverse[universeId];
		const thumbnail = thumbsByUniverse[universeId];
		const prev = games[placeId];

		games[placeId] = {
			placeId,
			universeId,
			rootPlaceId: stats?.rootPlaceId ?? prev?.rootPlaceId ?? Number(placeId),
			name: stats?.name ?? prev?.name ?? "Unknown",
			playing: stats?.playing ?? prev?.playing ?? 0,
			visits: stats?.visits ?? prev?.visits ?? 0,
			icon: icon ?? prev?.icon ?? null,
			thumbnail: thumbnail ?? prev?.thumbnail ?? null,
		};
	}

	const output = {
		generatedAt: new Date().toISOString(),
		games,
	};

	const fs = await import("node:fs/promises");
	await fs.mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
	await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2));
	console.log(`Wrote ${Object.keys(games).length} game records to public/data/roblox-stats.json`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
