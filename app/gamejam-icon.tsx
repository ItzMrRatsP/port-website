"use client";
import { useRobloxStats } from "./use-roblox-stats";

export default function GameJamIcon({ placeId }: { placeId: string }) {
	const { stats, loading, error } = useRobloxStats(placeId);

	if (error || (!loading && !stats?.icon)) {
		return <div className="gamejam-icon gamejam-icon--fallback" />;
	}

	return (
		<div className="gamejam-icon">
			{stats?.icon ? (
				<img
					src={stats.icon}
					alt=""
					className="gamejam-icon-img"
				/>
			) : (
				<div className="gamejam-icon-skeleton" />
			)}
		</div>
	);
}
