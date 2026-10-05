import type { JSX } from "react";
import type { Motif } from "./projects-data";

// Wide illustrated scenes for the Work showcase (640 x 400).
// Each scene has a "far" group and a "near" group so they can drift at
// different speeds for a gentle parallax. Colours come from the CSS
// classes pl-light / pl-soft / pl-shade / pl-line / pl-ink in globals.css.

export const TONES: Record<Motif, [string, string]> = {
	door: ["#cbbfd6", "#eee3ea"],
	clock: ["#aaa8ba", "#dad6de"],
	dumpling: ["#f1d3b8", "#f8ebe0"],
	cafe: ["#efd9a0", "#f7eed2"],
	foliage: ["#b4c2a5", "#dfe6d3"],
};

/* ---------------- 3M1: a wall breaking open ---------------- */
function Door() {
	const tiles: JSX.Element[] = [];
	const sides = [
		{ x0: 40, dir: -1, near: 4 },
		{ x0: 390, dir: 1, near: 0 },
	];
	sides.forEach(({ x0, dir, near }) => {
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 6; j++) {
				if ((i * 3 + j * 5 + (dir > 0 ? 2 : 0)) % 7 === 0) continue;
				let x = x0 + i * 42;
				let y = 40 + j * 42;
				let rot = 0;
				if (i === near && (i + j) % 2 === 0) {
					x += dir * (6 + ((j * 5) % 14));
					y -= 4 + ((j * 7) % 18);
					rot = ((j * 17) % 40) - 20;
				}
				tiles.push(
					<rect
						key={`${dir}-${i}-${j}`}
						x={x}
						y={y}
						width="34"
						height="34"
						rx="4"
						transform={`rotate(${rot} ${x + 17} ${y + 17})`}
						className={(i + j) % 3 === 0 ? "pl-light" : "pl-soft"}
					/>,
				);
			}
		}
	});
	return (
		<>
			<g className="scene-far">{tiles}</g>
			<g className="scene-near">
				<rect x="0" y="320" width="640" height="80" className="pl-shade" />
				<path d="M270 320 L370 320 L450 400 L190 400 Z" className="pl-soft" />
				<path d="M268 320 V176 a52 52 0 0 1 104 0 V320 Z" className="pl-light" />
				<path d="M286 320 V180 a34 34 0 0 1 68 0 V320 Z" className="pl-soft" />
				<rect x="296" y="112" width="14" height="14" rx="2" transform="rotate(14 303 119)" className="pl-light" />
				<rect x="350" y="90" width="10" height="10" rx="2" transform="rotate(-20 355 95)" className="pl-soft" />
				<rect x="398" y="148" width="12" height="12" rx="2" transform="rotate(28 404 154)" className="pl-light" />
				<rect x="246" y="98" width="12" height="12" rx="2" transform="rotate(-12 252 104)" className="pl-soft" />
				<rect x="326" y="58" width="9" height="9" rx="2" transform="rotate(32 330 62)" className="pl-light" />
			</g>
		</>
	);
}

/* ---------------- Malice: a clock and a draining score ---------------- */
function Clock() {
	const cx = 240;
	const cy = 190;
	const ticks = Array.from({ length: 12 }, (_, i) => {
		const a = (i * Math.PI) / 6;
		return (
			<line
				key={i}
				x1={(cx + Math.sin(a) * 92).toFixed(1)}
				y1={(cy - Math.cos(a) * 92).toFixed(1)}
				x2={(cx + Math.sin(a) * 104).toFixed(1)}
				y2={(cy - Math.cos(a) * 104).toFixed(1)}
				className="pl-line"
				strokeWidth={3}
			/>
		);
	});
	const heights = [150, 126, 100, 76, 52, 30];
	return (
		<>
			<g className="scene-far">
				<circle cx={cx} cy={cy} r="160" className="pl-line" strokeWidth={1.5} opacity={0.35} />
				<circle cx={cx} cy={cy} r="188" className="pl-line" strokeWidth={1.5} opacity={0.2} />
				{heights.map((h, i) => (
					<rect
						key={i}
						x={430 + i * 28}
						y={320 - h}
						width="16"
						height={h}
						rx="8"
						className={i < 2 ? "pl-light" : "pl-soft"}
					/>
				))}
			</g>
			<g className="scene-near">
				<ellipse cx={cx} cy="336" rx="100" ry="12" className="pl-shade" />
				<path d={`M${cx} ${cy} L${cx} 78 A112 112 0 0 1 ${cx + 97} ${cy + 56} Z`} className="pl-shade" />
				<circle cx={cx} cy={cy} r="112" className="pl-line" strokeWidth={4} />
				{ticks}
				<line x1={cx} y1={cy} x2={cx} y2={cy - 74} className="pl-line" strokeWidth={5} />
				<line x1={cx} y1={cy} x2={cx + 38} y2={cy + 22} className="pl-line" strokeWidth={7} />
				<circle cx={cx} cy={cy} r="8" className="pl-light" />
			</g>
		</>
	);
}

/* ---------------- Dumplings: the very tall slide ---------------- */
function Dumpling({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
			<path d="M-46 0 C -46 -44, 46 -44, 46 0 Z" className="pl-light" />
			<path d="M-22 -6 Q -18 -24 -22 -34" className="pl-ink" />
			<path d="M-6 -8 Q -3 -26 -6 -38" className="pl-ink" />
			<path d="M10 -8 Q 12 -26 10 -38" className="pl-ink" />
			<path d="M26 -6 Q 24 -22 28 -32" className="pl-ink" />
		</g>
	);
}

function DumplingScene() {
	return (
		<>
			<g className="scene-far">
				<circle cx="500" cy="86" r="44" className="pl-soft" />
				<path d="M120 84 v22 M109 95 h22" className="pl-line" />
				<path d="M540 190 v22 M529 201 h22" className="pl-line" />
				<path d="M60 220 v18 M51 229 h18" className="pl-line" opacity={0.7} />
				<path d="M330 64 v18 M321 73 h18" className="pl-line" opacity={0.7} />
			</g>
			<g className="scene-near">
				<rect x="0" y="330" width="640" height="70" className="pl-shade" />
				{/* ladder */}
				<rect x="92" y="120" width="8" height="212" rx="4" className="pl-light" />
				<rect x="140" y="120" width="8" height="212" rx="4" className="pl-light" />
				{[150, 182, 214, 246, 278, 310].map((y) => (
					<line key={y} x1="98" y1={y} x2="142" y2={y} className="pl-line" strokeWidth={5} />
				))}
				<rect x="84" y="112" width="96" height="10" rx="5" className="pl-light" />
				{/* slide */}
				<path d="M176 112 C 290 118, 410 214, 566 296 L566 322 C 410 242, 290 156, 176 136 Z" className="pl-light" />
				<path d="M180 124 C 292 132, 412 226, 560 306" className="pl-line" strokeWidth={2} opacity={0.55} />
				{/* dumplings */}
				<Dumpling x={236} y={118} s={1} rot={3} />
				<Dumpling x={420} y={208} s={0.7} rot={27} />
				<path d="M200 90 h-30 M196 104 h-40 M204 76 h-22" className="pl-line" strokeWidth={3} opacity={0.7} />
				<ellipse cx="560" cy="334" rx="48" ry="8" className="pl-soft" />
			</g>
		</>
	);
}

/* ---------------- Hybrid Cafe: lamps, a table, a small guest ---------------- */
function Cafe() {
	return (
		<>
			<g className="scene-far">
				<path d="M440 320 V120 a70 70 0 0 1 140 0 V320 Z" className="pl-soft" />
				<path d="M510 50 V320 M440 190 H580" className="pl-line" strokeWidth={2} opacity={0.6} />
				<line x1="150" y1="0" x2="150" y2="70" className="pl-line" strokeWidth={2} />
				<circle cx="150" cy="104" r="64" className="pl-soft" opacity={0.5} />
				<path d="M118 100 A32 32 0 0 1 182 100 Z" className="pl-light" />
				<line x1="300" y1="0" x2="300" y2="40" className="pl-line" strokeWidth={2} />
				<circle cx="300" cy="72" r="52" className="pl-soft" opacity={0.45} />
				<path d="M274 70 A26 26 0 0 1 326 70 Z" className="pl-light" />
			</g>
			<g className="scene-near">
				<rect x="0" y="336" width="640" height="64" className="pl-shade" />
				{/* a small guest peeking over the table */}
				<circle cx="386" cy="244" r="8" fill="var(--rat)" />
				<circle cx="386" cy="244" r="4" fill="var(--rat-pink)" />
				<circle cx="412" cy="244" r="8" fill="var(--rat)" />
				<circle cx="412" cy="244" r="4" fill="var(--rat-pink)" />
				<ellipse cx="399" cy="262" rx="21" ry="15" fill="var(--rat)" />
				<circle cx="391" cy="258" r="2.2" fill="var(--rat-eye)" />
				<circle cx="407" cy="258" r="2.2" fill="var(--rat-eye)" />
				<ellipse cx="399" cy="266" rx="3" ry="2" fill="var(--rat-pink)" />
				{/* table */}
				<rect x="90" y="272" width="340" height="14" rx="7" className="pl-light" />
				<path d="M140 286 V338 M380 286 V338" className="pl-line" strokeWidth={8} />
				{/* cup */}
				<ellipse cx="200" cy="270" rx="54" ry="8" className="pl-light" />
				<path d="M166 218 H234 C234 252 218 268 200 268 C182 268 166 252 166 218 Z" className="pl-light" />
				<ellipse cx="200" cy="219" rx="34" ry="5" className="pl-shade" />
				<path d="M232 228 C 266 226, 266 258, 228 254" className="pl-line" strokeWidth={8} />
				<path d="M184 196 C 172 176, 198 166, 188 140" className="pl-line" />
				<path d="M202 194 C 190 172, 216 164, 206 134" className="pl-line" />
				<path d="M220 196 C 210 178, 232 170, 224 148" className="pl-line" />
				{/* cake slice */}
				<path d="M286 270 L350 270 L342 236 Q 316 232 286 270 Z" className="pl-light" />
				<path d="M290 262 H346" className="pl-ink" />
			</g>
		</>
	);
}

/* ---------------- Camo Or Snipe!: a scope with someone hiding ---------------- */
function Foliage() {
	const leaves: [number, number, number, number, number, string][] = [
		[300, 262, 70, 20, -22, "pl-light"],
		[372, 266, 64, 18, 20, "pl-soft"],
		[330, 244, 56, 15, 8, "pl-light"],
		[70, 330, 90, 24, -18, "pl-soft"],
		[170, 350, 100, 26, 8, "pl-light"],
		[570, 330, 90, 24, 18, "pl-soft"],
		[470, 352, 100, 26, -8, "pl-light"],
		[40, 250, 50, 16, -52, "pl-soft"],
		[600, 250, 50, 16, 52, "pl-soft"],
	];
	return (
		<>
			<g className="scene-far">
				<circle cx="320" cy="190" r="178" fill="none" className="pl-ink" strokeWidth={84} opacity={0.22} />
			</g>
			<g className="scene-near">
				{/* someone camouflaged inside the scope */}
				<circle cx="352" cy="166" r="17" className="pl-soft" opacity={0.7} />
				<rect x="334" y="182" width="36" height="76" rx="16" className="pl-soft" opacity={0.7} />
				{/* scope */}
				<circle cx="320" cy="190" r="134" className="pl-line" strokeWidth={3} />
				<path d="M320 36 V118 M320 262 V344 M166 190 H248 M392 190 H474" className="pl-line" strokeWidth={3} />
				<circle cx="320" cy="190" r="4" className="pl-light" />
				{[-40, -20, 20, 40].map((d) => (
					<circle key={d} cx={320 + d * 1.6} cy="190" r="2" className="pl-light" />
				))}
				{leaves.map(([cx, cy, rx, ry, rot, cls], i) => (
					<ellipse
						key={i}
						cx={cx}
						cy={cy}
						rx={rx}
						ry={ry}
						transform={`rotate(${rot} ${cx} ${cy})`}
						className={cls}
					/>
				))}
			</g>
		</>
	);
}

export const SCENES: Record<Motif, () => JSX.Element> = {
	door: Door,
	clock: Clock,
	dumpling: DumplingScene,
	cafe: Cafe,
	foliage: Foliage,
};
