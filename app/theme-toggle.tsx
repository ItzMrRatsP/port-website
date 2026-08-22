"use client";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export type Theme = "dark" | "light";

const STORAGE_KEY = "site-theme";
const STORAGE_KEY_PREV = "site-theme-prev";
const DEFAULT_THEME: Theme = "dark";

function applyTheme(theme: Theme) {
	// "dark" has no attribute — it's the default in globals.css — so we only
	// ever need to set/remove data-theme="light".
	if (theme === "light") {
		document.documentElement.setAttribute("data-theme", "light");
	} else {
		document.documentElement.removeAttribute("data-theme");
	}
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

	// Restore whatever was saved last visit. A tiny inline script in
	// layout.tsx already applies this before paint so there's no flash of
	// the wrong theme — this just syncs React's state to match.
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
			if (saved === "light" || saved === "dark") {
				setTheme(saved);
				applyTheme(saved);
			}
		} catch {
			// localStorage unavailable (e.g. privacy mode) — fall back to default
		}
	}, []);

	function toggleTheme() {
		const next: Theme = theme === "dark" ? "light" : "dark";

		try {
			// Remember the theme we're leaving, so a visitor's last theme
			// before this one is never lost even across reloads.
			localStorage.setItem(STORAGE_KEY_PREV, theme);
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// ignore — the toggle still works for this session even if it can't persist
		}

		setTheme(next);
		applyTheme(next);
	}

	return (
		<button
			className="theme-toggle"
			onClick={toggleTheme}
			aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
			title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>
			{theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
		</button>
	);
}
