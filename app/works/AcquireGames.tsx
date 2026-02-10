const games = {
	THC: {
		name: "The Hybrid Cafe",
		content: "https://tr.rbxcdn.com/180DAY-f77294394c42e5fbc45285b0840cc880/768/432/Image/Webp/noFilter",
		url: "https://www.roblox.com/games/132813250731469/The-Hybrid-Cafe",
		active: true,
	},
};

import styles from "../works.module.css";

export default function Acquire() {
	return (
		<li className="list">
			<ul className={styles.list}>
				{Object.entries(games).map(([k, v]) => (
					<div
						key={k}
						className={styles.box}>
						<p className={styles.text}>{v.name}</p>
						<a
							href={v.url}
							className="description"
							target="_blank"
							rel="noopener noreferrer">
							<img
								className={styles.thumbnail}
								src={v.content}
								alt={k}
							/>
						</a>
					</div>
				))}
			</ul>
		</li>
	);
}
