"use client";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";

export default function CopyDiscord({ username = "itzmrratsp" }: { username?: string }) {
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
			className="button button--solid"
			onClick={copy}>
			<FaDiscord size={16} />
			<span aria-live="polite">{copied ? `Copied ${username}` : "Copy Discord username"}</span>
		</button>
	);
}
