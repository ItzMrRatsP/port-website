"use client";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ src, title }: { src: string; title: string }) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const hlsRef = useRef<Hls | null>(null);
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState<number | null>(null);
	const [volume, setVolume] = useState(1);
	const [error, setError] = useState<string | null>(null);

	// Load the HLS source (or fall back to native for Safari)
	useEffect(() => {
		const video = videoRef.current;
		if (!video || !src) return;

		setError(null);

		// Clean up any previous hls.js instance before attaching a new source
		if (hlsRef.current) {
			hlsRef.current.destroy();
			hlsRef.current = null;
		}

		const isHlsSource = src.includes(".m3u8");

		if (isHlsSource && Hls.isSupported()) {
			const hls = new Hls({
				// keep it reasonably lean for a small preview player
				maxBufferLength: 30,
			});
			hlsRef.current = hls;
			hls.loadSource(src);
			hls.attachMedia(video);
			hls.on(Hls.Events.ERROR, (_event, data) => {
				if (data.fatal) {
					console.error("hls.js fatal error:", data);
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							hls.startLoad();
							break;
						case Hls.ErrorTypes.MEDIA_ERROR:
							hls.recoverMediaError();
							break;
						default:
							setError("This video could not be loaded.");
							hls.destroy();
							hlsRef.current = null;
							break;
					}
				}
			});
		} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
			// Safari / iOS: native HLS support, no hls.js needed
			video.src = src;
		} else if (!isHlsSource) {
			// Non-HLS source (e.g. plain mp4/webm) — just set it directly
			video.src = src;
		} else {
			setError("HLS playback is not supported in this browser.");
		}

		return () => {
			if (hlsRef.current) {
				hlsRef.current.destroy();
				hlsRef.current = null;
			}
		};
	}, [src]);

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
			video.play().catch((err) => {
				console.error("Play failed:", err);
			});
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

			{error ? (
				<div className="video-error">
					<code>{error}</code>
				</div>
			) : (
				<video
					ref={videoRef}
					loop
					playsInline
					preload="auto"
					onTimeUpdate={updateProgress}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					onError={(e) => {
						const mediaError = e.currentTarget.error;
						console.error("Video element error:", mediaError?.code, mediaError?.message);
					}}
				/>
			)}

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
