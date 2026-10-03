"use client";
import { useEffect, useRef, useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

// Put your track in /public/music/ and point this at it.
const MUSIC_SRC = "/music/hav.mp3";
const TARGET_VOLUME = 0.15;
const FADE_MS = 1500;

export default function BackgroundMusic() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [playing, setPlaying] = useState(false);
	const [unavailable, setUnavailable] = useState(false);

	useEffect(() => {
		return () => {
			if (fadeRef.current) clearInterval(fadeRef.current);
		};
	}, []);

	function fadeTo(audio: HTMLAudioElement, target: number, onDone?: () => void) {
		if (fadeRef.current) clearInterval(fadeRef.current);
		const steps = 30;
		const start = audio.volume;
		let i = 0;
		fadeRef.current = setInterval(() => {
			i++;
			audio.volume = Math.min(1, Math.max(0, start + ((target - start) * i) / steps));
			if (i >= steps) {
				if (fadeRef.current) clearInterval(fadeRef.current);
				onDone?.();
			}
		}, FADE_MS / steps);
	}

	async function toggle() {
		const audio = audioRef.current;
		if (!audio) return;

		if (playing) {
			setPlaying(false);
			fadeTo(audio, 0, () => audio.pause());
			return;
		}

		try {
			audio.volume = 0;
			await audio.play();
			setPlaying(true);
			fadeTo(audio, TARGET_VOLUME);
		} catch {
			setUnavailable(true);
		}
	}

	return (
		<>
			<audio
				ref={audioRef}
				src={MUSIC_SRC}
				loop
				preload="none"
				onError={() => setUnavailable(true)}
			/>
			{!unavailable && (
				<button
					className="sound-toggle"
					onClick={toggle}
					aria-pressed={playing}
					aria-label={playing ? "Pause ambient music" : "Play ambient music"}
					title={playing ? "Pause ambient music" : "Play ambient music"}>
					{playing ? <FaVolumeUp size={15} /> : <FaVolumeMute size={15} />}
				</button>
			)}
		</>
	);
}
