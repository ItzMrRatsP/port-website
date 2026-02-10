"use client";

import { usePathname } from "next/navigation";
import style from "./modules/not-found.module.css";

export default function Page() {
	const path = usePathname();
	return (
		<div className="main">
			<div className="top-background"></div>
			{/* Remove padding between the title and description */}
			<p className={style.text}>404</p>
			<p className={style.description}>This page must be hiding in another dimension…</p>
		</div>
	);
}
