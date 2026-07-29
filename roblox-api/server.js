import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// Add as many place IDs as you want here
const PLACE_IDS = [132813250731469];

// Cache placeId -> universeId, since this mapping never changes
const universeIdCache = new Map();

async function getUniverseId(placeId) {
	if (universeIdCache.has(placeId)) {
		return universeIdCache.get(placeId);
	}
	const res = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
	if (!res.ok) {
		throw new Error(`Failed to resolve universeId for place ${placeId}`);
	}
	const data = await res.json();
	universeIdCache.set(placeId, data.universeId);
	return data.universeId;
}

app.get("/api/ccu", async (req, res) => {
	try {
		// Resolve all universe IDs (cached after first run)
		const universeIds = await Promise.all(PLACE_IDS.map((placeId) => getUniverseId(placeId)));

		// Roblox allows comma-separated universeIds in a single request
		const idsParam = universeIds.join(",");
		const gamesRes = await fetch(`https://games.roblox.com/v1/games?universeIds=${idsParam}`);
		if (!gamesRes.ok) {
			return res.status(gamesRes.status).json({ error: "Roblox API error" });
		}
		const gamesData = await gamesRes.json();

		const results = gamesData.data.map((game) => ({
			universeId: game.id,
			name: game.name,
			playing: game.playing,
		}));

		const total = results.reduce((sum, g) => sum + g.playing, 0);

		res.json({ games: results, total });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch CCU" });
	}
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
