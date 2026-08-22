"use client";
import { useEffect, useRef, useState } from "react";
import { FaPalette, FaUndo } from "react-icons/fa";

// Preset accent colors. The site is built around one CSS variable
// (--accent-primary) that most greens/borders/glows derive from via
// color-mix(), so picking a swatch here re-themes the whole page.
const PRESETS = [
	{ name: "Mint", value: "#84ff8a" }, // original default
	{ name: "Cyan", value: "#5ee7ff" },
	{ name: "Violet", value: "#b98eff" },
	{ name: "Rose", value: "#ff6fae" },
	{ name: "Amber", value: "#ffb454" },
	{ name: "Coral", value: "#ff6b6b" },
	{ name: "Sky", value: "#5b9dff" },
	{ name: "Gold", value: "#ffd75e" },
];

const STORAGE_KEY = "site-accent-color";
const STORAGE_KEY_PREV = "site-accent-color-prev";
const DEFAULT_COLOR = "#84ff8a";

function applyAccent(color: string) {
	document.documentElement.style.setProperty("--accent-primary", color);
}

export default function ThemeSwitcher() {
	const [open, setOpen] = useState(false);
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [prevColor, setPrevColor] = useState<string | null>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	// On mount, restore whatever was saved last session. A tiny inline
	// script in layout.tsx already applies this before paint so there's
	// no flash of the default color — this just syncs React's state.
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			const savedPrev = localStorage.getItem(STORAGE_KEY_PREV);
			if (saved) {
				setColor(saved);
				applyAccent(saved);
			}
			if (savedPrev) setPrevColor(savedPrev);
		} catch {
			// localStorage unavailable (e.g. privacy mode) — fall back to default
		}
	}, []);

	// Close the panel on outside click
	useEffect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);

	function chooseColor(next: string) {
		if (next.toLowerCase() === color.toLowerCase()) return;

		try {
			localStorage.setItem(STORAGE_KEY_PREV, color);
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// ignore — theme still applies for this session even if it can't persist
		}

		setPrevColor(color);
		setColor(next);
		applyAccent(next);
	}

	function revertToPrevious() {
		if (!prevColor) return;
		chooseColor(prevColor);
	}

	return (
		<div
			className="theme-switcher"
			ref={rootRef}>
			<button
				className="theme-switcher-trigger"
				onClick={() => setOpen((o) => !o)}
				aria-label="Change accent color"
				aria-expanded={open}
				style={{ color }}>
				<FaPalette size={16} />
			</button>

			{open && (
				<div className="theme-switcher-panel">
					<div className="theme-switcher-swatches">
						{PRESETS.map((preset) => (
							<button
								key={preset.value}
								className={`theme-swatch${
									color.toLowerCase() === preset.value.toLowerCase() ? " theme-swatch--active" : ""
								}`}
								style={{ background: preset.value }}
								title={preset.name}
								aria-label={preset.name}
								onClick={() => chooseColor(preset.value)}
							/>
						))}
						<label
							className="theme-swatch theme-swatch--custom"
							title="Custom color">
							<input
								type="color"
								value={color}
								onChange={(e) => chooseColor(e.target.value)}
								aria-label="Custom accent color"
							/>
						</label>
					</div>

					{prevColor && prevColor.toLowerCase() !== color.toLowerCase() && (
						<button
							className="theme-switcher-revert"
							onClick={revertToPrevious}>
							<FaUndo size={10} />
							<span
								className="theme-switcher-revert-swatch"
								style={{ background: prevColor }}
							/>
							previous
						</button>
					)}
				</div>
			)}
		</div>
	);
}
