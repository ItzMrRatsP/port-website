"use client";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

type Theme = "light" | "dark";
const STORAGE_KEY = "site-theme";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("light");

	// The inline script in layout.tsx has already set data-theme before paint;
	// this just syncs React's state with it.
	useEffect(() => {
		setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
	}, []);

	function toggle() {
		const next: Theme = theme === "dark" ? "light" : "dark";
		setTheme(next);
		document.documentElement.setAttribute("data-theme", next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// storage unavailable — the theme still changes for this visit
		}
	}

	const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

	return (
		<button
			className="mode-toggle"
			onClick={toggle}
			aria-label={label}
			title={label}>
			{theme === "dark" ? <FaSun size={15} /> : <FaMoon size={15} />}
		</button>
	);
}
