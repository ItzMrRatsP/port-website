"use client";
import { useEffect, useRef, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { studio, placeIdOf, type Project } from "./projects-data";
import { useAllRobloxStats } from "./use-roblox-stats";

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

// Shows a shimmering skeleton until the image has actually loaded (or while
// there is no image url yet), then fades the image in over it.
function SkeletonImg({ src, className }: { src?: string | null; className?: string }) {
	const [loaded, setLoaded] = useState(false);
	const ref = useRef<HTMLImageElement>(null);

	useEffect(() => {
		setLoaded(false);
		// Cached images can finish before React attaches onLoad.
		if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
	}, [src]);

	return (
		<>
			{!loaded && (
				<span
					className="skeleton"
					aria-hidden="true"
				/>
			)}
			{src && (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					ref={ref}
					className={className}
					src={src}
					alt=""
					onLoad={() => setLoaded(true)}
					style={{ opacity: loaded ? 1 : 0 }}
				/>
			)}
		</>
	);
}

export default function WorkShowcase({ projects }: { projects: Project[] }) {
	const [active, setActive] = useState(0);
	const current = projects[active];

	// Live data from roblox-stats.json (kept fresh by the GitHub workflow).
	const { entries } = useAllRobloxStats(projects.map((p) => placeIdOf(p.url)));
	const statsFor = (p: Project) => entries.find((e) => String(e.placeId) === placeIdOf(p.url));

	const currentStats = statsFor(current);

	return (
		<div className="showcase">
			<ul className="showcase-list">
				{projects.map((p, i) => {
					const open = i === active;
					return (
						<li
							key={p.id}
							className={open ? "show-item is-active" : "show-item"}>
							<button
								type="button"
								className="show-trigger"
								aria-expanded={open}
								aria-controls={`show-${p.id}`}
								onClick={() => setActive(i)}>
								<span className="show-heading">
									<span className="show-title">{p.name}</span>
									<span className="show-meta">{p.meta}</span>
								</span>
								<span
									className="show-mark"
									aria-hidden="true"
								/>
							</button>

							<div
								className="show-detail"
								id={`show-${p.id}`}
								role="region"
								aria-label={p.name}>
								<div className="show-detail-inner">
									<p className="show-blurb">{p.blurb}</p>
									<ul className="show-tags">
										{p.tags.map((t) => (
											<li key={t}>{t}</li>
										))}
									</ul>
									{p.role && (
										<p className="show-fact">
											<span>My role</span> {p.role}
										</p>
									)}
									{p.team && (
										<p className="show-fact">
											<span>Team</span> Made with{" "}
											<a
												className="link"
												href={studio.url}
												target="_blank"
												rel="noopener noreferrer">
												{studio.name}
											</a>
										</p>
									)}
								</div>
							</div>
						</li>
					);
				})}
			</ul>

			<div className="showcase-stage">
				{/* Thumbnail */}
				<div className="stage">
					{projects.map((p, i) => (
						<div
							key={p.id}
							className={i === active ? "scene is-active" : "scene"}
							aria-hidden="true">
							<SkeletonImg
								src={statsFor(p)?.thumbnail}
								className="scene-photo"
							/>
						</div>
					))}
				</div>

				{/* Icon overlapping the thumbnail, then title, award + live stats */}
				<div className="stage-foot">
					<div
						className="game-icon"
						key={current.id}>
						<SkeletonImg src={currentStats?.icon} />
					</div>

					<div className="game-info">
						<h3
							className="game-name"
							title={current.name}>
							{current.name}
						</h3>
						<p className="game-stats">
							{current.award && (
								<span className="award-pill">
									<FaTrophy
										size={11}
										aria-hidden="true"
									/>
									{current.award.place} place · {current.award.event}
								</span>
							)}
							{currentStats ? (
								<>
									<span className="stat">
										<span
											className="live-dot"
											aria-hidden="true"
										/>
										{currentStats.playing.toLocaleString()} playing
									</span>
									<span className="stat">{compact.format(currentStats.visits)} visits</span>
								</>
							) : (
								<>
									<span
										className="skeleton-line"
										aria-hidden="true"
									/>
									<span
										className="skeleton-line skeleton-line--short"
										aria-hidden="true"
									/>
								</>
							)}
						</p>
					</div>

					<a
						className="button button--solid"
						href={current.url}
						target="_blank"
						rel="noopener noreferrer">
						Play on Roblox <span aria-hidden="true">↗</span>
					</a>
				</div>
			</div>
		</div>
	);
}
