"use client";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";

export default function CopyDiscord({
	username = "itzmrratsp",
	label = "Copy Discord username",
	className = "button button--solid",
}: {
	username?: string;
	label?: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(username);
			setCopied(true);
			setTimeout(() => setCopied(false), 2200);
		} catch {
			// Clipboard blocked — show the name so it can be copied by hand
			window.prompt("Copy my Discord username:", username);
		}
	}

	return (
		<button
			className={className}
			onClick={copy}>
			<FaDiscord size={16} />
			<span aria-live="polite">{copied ? `Copied ${username}` : label}</span>
		</button>
	);
}
