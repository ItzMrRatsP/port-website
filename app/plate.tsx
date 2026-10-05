import type { CSSProperties } from "react";
import type { Motif } from "./projects-data";

// Muted top/bottom colours for each plate. Tweak freely.
const TONES: Record<Motif, [string, string]> = {
	door: ["#cbbfd6", "#eee3ea"],
	clock: ["#aaa8ba", "#dad6de"],
	dumpling: ["#f1d3b8", "#f8ebe0"],
	cafe: ["#efd9a0", "#f7eed2"],
	foliage: ["#b4c2a5", "#dfe6d3"],
};

function Door() {
	return (
		<>
			<rect x="0" y="390" width="400" height="110" className="pl-shade" />
			<path d="M160 390 L240 390 L310 500 L90 500 Z" className="pl-soft" />
			<path d="M140 390 V230 a60 60 0 0 1 120 0 V390 Z" className="pl-light" />
			<path d="M162 390 V236 a38 38 0 0 1 76 0 V390 Z" className="pl-soft" />
			<rect x="78" y="168" width="22" height="22" transform="rotate(12 89 179)" className="pl-soft" />
			<rect x="300" y="138" width="16" height="16" transform="rotate(-18 308 146)" className="pl-light" />
			<rect x="326" y="226" width="26" height="26" transform="rotate(24 339 239)" className="pl-soft" />
			<rect x="58" y="270" width="14" height="14" transform="rotate(-10 65 277)" className="pl-light" />
			<rect x="262" y="84" width="12" height="12" transform="rotate(30 268 90)" className="pl-soft" />
			<rect x="118" y="104" width="10" height="10" transform="rotate(-24 123 109)" className="pl-light" />
		</>
	);
}

function Clock() {
	const ticks = Array.from({ length: 12 }, (_, i) => {
		const a = (i * Math.PI) / 6;
		const x1 = (200 + Math.sin(a) * 96).toFixed(1);
		const y1 = (230 - Math.cos(a) * 96).toFixed(1);
		const x2 = (200 + Math.sin(a) * 108).toFixed(1);
		const y2 = (230 - Math.cos(a) * 108).toFixed(1);
		return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="pl-line" strokeWidth={3} />;
	});
	return (
		<>
			<path d="M200 230 L200 120 A110 110 0 0 1 295 285 Z" className="pl-shade" />
			<circle cx="200" cy="230" r="120" className="pl-line" strokeWidth={2} opacity={0.5} />
			{ticks}
			<line x1="200" y1="230" x2="200" y2="150" className="pl-line" strokeWidth={5} />
			<line x1="200" y1="230" x2="246" y2="256" className="pl-line" strokeWidth={7} />
			<circle cx="200" cy="230" r="8" className="pl-light" />
			<ellipse cx="200" cy="420" rx="110" ry="14" className="pl-shade" />
		</>
	);
}

function Dumpling() {
	return (
		<>
			<circle cx="200" cy="190" r="72" className="pl-soft" />
			<ellipse cx="200" cy="362" rx="132" ry="26" className="pl-shade" />
			<path d="M92 352 C 92 248, 308 248, 308 352 Z" className="pl-light" />
			<path d="M150 300 Q 156 330 150 348" className="pl-ink" />
			<path d="M180 284 Q 186 320 182 348" className="pl-ink" />
			<path d="M210 282 Q 213 320 212 348" className="pl-ink" />
			<path d="M240 288 Q 241 322 245 348" className="pl-ink" />
			<path d="M268 302 Q 262 328 268 348" className="pl-ink" />
			<path d="M300 112 v28 M286 126 h28" className="pl-line" />
		</>
	);
}

function Cafe() {
	return (
		<>
			<ellipse cx="200" cy="378" rx="124" ry="22" className="pl-light" />
			<path d="M268 292 C 324 286, 324 352, 262 346" className="pl-line" strokeWidth={10} />
			<path d="M130 270 H270 C270 340 240 374 200 374 C160 374 130 340 130 270 Z" className="pl-light" />
			<ellipse cx="200" cy="272" rx="70" ry="9" className="pl-shade" />
			<path d="M170 240 C 155 215, 190 200, 175 170" className="pl-line" />
			<path d="M205 236 C 190 206, 225 190, 210 156" className="pl-line" />
			<path d="M240 240 C 225 215, 255 200, 242 176" className="pl-line" />
		</>
	);
}

function Foliage() {
	const leaves: [number, number, number, number, number, string][] = [
		[60, 330, 60, 20, -50, "pl-soft"],
		[340, 340, 64, 20, 45, "pl-soft"],
		[150, 360, 70, 22, -35, "pl-shade"],
		[250, 350, 70, 22, 30, "pl-shade"],
		[110, 400, 90, 26, -20, "pl-light"],
		[190, 424, 100, 28, 10, "pl-soft"],
		[290, 410, 95, 26, -8, "pl-light"],
	];
	return (
		<>
			<circle cx="250" cy="190" r="70" className="pl-line" strokeWidth={3} />
			<path d="M250 100 V150 M250 230 V280 M160 190 H210 M290 190 H340" className="pl-line" strokeWidth={3} />
			<circle cx="250" cy="190" r="4" className="pl-light" />
			{leaves.map(([cx, cy, rx, ry, rot, cls], i) => (
				<ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} className={cls} />
			))}
		</>
	);
}

const MOTIFS: Record<Motif, () => React.JSX.Element> = {
	door: Door,
	clock: Clock,
	dumpling: Dumpling,
	cafe: Cafe,
	foliage: Foliage,
};

export default function Plate({ motif }: { motif: Motif }) {
	const Art = MOTIFS[motif];
	const [p1, p2] = TONES[motif];
	return (
		<div className="plate" style={{ "--p1": p1, "--p2": p2 } as CSSProperties} aria-hidden="true">
			<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
				<g className="motif">
					<Art />
				</g>
			</svg>
		</div>
	);
}
