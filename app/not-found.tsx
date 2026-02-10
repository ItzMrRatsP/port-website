import style from "./modules/not-found.module.css";

export default function Page() {
	return (
		<div className="main">
			<div className="top-background"></div>
			<p className={style.text}>404</p>
			<p className={style.description}>This page must be hiding in another dimension…</p>
		</div>
	);
}
