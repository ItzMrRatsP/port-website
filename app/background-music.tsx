"use client";
import { useEffect, useRef, useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

// Point this at your own hosted track (e.g. /music/ambient.mp3 in your public folder)
const MUSIC_SRC = "/music/hav.mp3";
const TARGET_VOLUME = 0.15;
const FADE_DURATION_MS = 1500;

export default function BackgroundMusic() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [muted, setMuted] = useState(true); // start muted — browsers block audio-with-sound autoplay
	const [started, setStarted] = useState(false);

	// Most browsers won't allow audio to play with sound until the user
	// interacts with the page at least once. This listens for the first
	// interaction anywhere on the page and starts playback then.
	useEffect(() => {
		function handleFirstInteraction() {
			const audio = audioRef.current;
			if (!audio || started) return;

			audio.volume = 0;
			audio
				.play()
				.then(() => {
					setStarted(true);
					fadeVolume(audio, 0, TARGET_VOLUME, FADE_DURATION_MS);
					setMuted(false);
				})
				.catch(() => {
					// Autoplay still blocked for some reason — leave muted,
					// user can press the button manually
				});
		}

		document.addEventListener("click", handleFirstInteraction, { once: true });
		document.addEventListener("keydown", handleFirstInteraction, { once: true });
		document.addEventListener("touchstart", handleFirstInteraction, { once: true });

		return () => {
			document.removeEventListener("click", handleFirstInteraction);
			document.removeEventListener("keydown", handleFirstInteraction);
			document.removeEventListener("touchstart", handleFirstInteraction);
		};
	}, [started]);

	function fadeVolume(audio: HTMLAudioElement, from: number, to: number, duration: number) {
		const steps = 30;
		const stepTime = duration / steps;
		const stepAmount = (to - from) / steps;
		let current = from;
		let count = 0;

		const interval = setInterval(() => {
			count++;
			current += stepAmount;
			audio.volume = Math.min(Math.max(current, 0), 1);
			if (count >= steps) clearInterval(interval);
		}, stepTime);
	}

	function toggleMute() {
		const audio = audioRef.current;
		if (!audio) return;

		if (!started) {
			// User is toggling before any page interaction registered —
			// try starting playback directly from this click
			audio.volume = TARGET_VOLUME;
			audio
				.play()
				.then(() => {
					setStarted(true);
					setMuted(false);
				})
				.catch(() => {
					// still failed, leave state as-is
				});
			return;
		}

		if (muted) {
			audio.muted = false;
			setMuted(false);
		} else {
			audio.muted = true;
			setMuted(true);
		}
	}

	return (
		<>
			<audio
				ref={audioRef}
				src={MUSIC_SRC}
				loop
				preload="auto"
			/>
			<button
				onClick={toggleMute}
				className="music-toggle"
				aria-label={muted ? "Unmute background music" : "Mute background music"}>
				{muted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
			</button>
		</>
	);
}
