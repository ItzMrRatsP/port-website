"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoPlayer({ src, title }: { src: string; title: string }) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState<number | null>(null);
	const [volume, setVolume] = useState(1);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const updateDuration = () => {
			if (Number.isFinite(video.duration) && video.duration > 0) {
				setDuration(video.duration);
			}
		};

		video.addEventListener("loadedmetadata", updateDuration);
		video.addEventListener("durationchange", updateDuration);
		video.addEventListener("canplay", updateDuration);

		return () => {
			video.removeEventListener("loadedmetadata", updateDuration);
			video.removeEventListener("durationchange", updateDuration);
			video.removeEventListener("canplay", updateDuration);
		};
	}, [src]);

	function togglePlay() {
		const video = videoRef.current;
		if (!video) return;

		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	}

	function updateProgress() {
		const video = videoRef.current;
		if (!video) return;

		setProgress(video.currentTime);

		if (Number.isFinite(video.duration) && video.duration > 0) {
			setDuration(video.duration);
		}
	}

	function seek(e: React.ChangeEvent<HTMLInputElement>) {
		const video = videoRef.current;
		if (!video) return;

		const time = Number(e.target.value);

		video.currentTime = time;
		setProgress(time);
	}

	function changeVolume(e: React.ChangeEvent<HTMLInputElement>) {
		const video = videoRef.current;
		if (!video) return;

		const value = Number(e.target.value);

		video.volume = value;
		video.muted = value === 0;

		setVolume(value);
		setMuted(video.muted);
	}

	function toggleMute() {
		const video = videoRef.current;
		if (!video) return;

		video.muted = !video.muted;
		setMuted(video.muted);
	}

	async function toggleFullscreen() {
		const container = containerRef.current;
		if (!container) return;

		try {
			if (document.fullscreenElement) {
				await document.exitFullscreen();
			} else {
				await container.requestFullscreen();
			}
		} catch (err) {
			console.error("Fullscreen failed:", err);
		}
	}
	function handleMetadata(e: React.SyntheticEvent<HTMLVideoElement>) {
		const video = e.currentTarget;
		const duration = video.duration;

		if (Number.isFinite(duration) && duration > 0) {
			setDuration(duration);
		}
	}
	function formatTime(time: number | null) {
		if (!Number.isFinite(time ?? NaN)) return "0:00";

		const minutes = Math.floor(time! / 60);
		const seconds = Math.floor(time! % 60)
			.toString()
			.padStart(2, "0");

		return `${minutes}:${seconds}`;
	}

	return (
		<div
			ref={containerRef}
			className="video-frame">
			<div className="video-title">
				<div className="window-buttons">
					<span className="btn btn-red" />
					<span className="btn btn-yellow" />
					<span className="btn btn-green" />
				</div>

				<code>{title}</code>
			</div>

			<video
				ref={videoRef}
				src={src}
				loop
				playsInline
				preload="auto"
				onTimeUpdate={updateProgress}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
			/>

			<div className="video-controls">
				<button onClick={togglePlay}>{playing ? "❚❚" : "▶"}</button>

				<input
					type="range"
					min="0"
					max={duration ?? 1}
					value={progress}
					disabled={!duration}
					onChange={seek}
				/>

				<span>
					{formatTime(progress)} / {formatTime(duration)}
				</span>

				<button onClick={toggleMute}>{muted ? "🔇" : "🔊"}</button>

				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={volume}
					onChange={changeVolume}
				/>

				<button onClick={toggleFullscreen}>⛶</button>
			</div>
		</div>
	);
}
