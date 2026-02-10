import styles from "../works.module.css";
import Acquire from "./AcquireGames";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="main">
			<div className="top-background"></div>
			<h1 className={styles.text}>Past works</h1>
			<p className={styles.description}>In this section, you can see some of my work and contribution.</p>
			<Acquire></Acquire>
		</div>
	);
}
