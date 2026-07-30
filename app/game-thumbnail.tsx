"use client";
import { useRobloxStats } from "./use-roblox-stats";

export default function GameThumbnail({ placeId }: { placeId: string }) {
	const { stats, loading, error } = useRobloxStats(placeId);

	if (error || (!loading && !stats?.thumbnail)) {
		return null; // fail silently — the icon + text still carries the card
	}

	return (
		<div className="game-thumbnail">
			{stats?.thumbnail ? (
				<img
					src={stats.thumbnail}
					alt=""
					className="game-thumbnail-img"
				/>
			) : (
				<div className="game-thumbnail-skeleton" />
			)}
		</div>
	);
}
