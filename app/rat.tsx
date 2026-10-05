// A small flat rat sitting on the hills, looking up at the cheese moon.
// Colours come from CSS variables (--rat, --rat-pink) so it follows the theme.
export default function Rat({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 200 140" aria-hidden="true">
			{/* tail */}
			<path
				d="M40 108 C 12 114, 2 84, 22 72 C 36 64, 30 46, 12 50"
				fill="none"
				stroke="var(--rat-pink)"
				strokeWidth="5"
				strokeLinecap="round"
			/>
			{/* body */}
			<ellipse cx="82" cy="94" rx="46" ry="34" fill="var(--rat)" />
			{/* back foot */}
			<ellipse cx="70" cy="124" rx="16" ry="6" fill="var(--rat)" />
			{/* head + snout */}
			<ellipse cx="128" cy="78" rx="24" ry="19" fill="var(--rat)" />
			<path d="M124 62 Q152 64 166 82 Q152 94 124 94 Z" fill="var(--rat)" />
			{/* ear */}
			<circle cx="116" cy="60" r="12" fill="var(--rat)" />
			<circle cx="116" cy="60" r="6.5" fill="var(--rat-pink)" />
			{/* front paws */}
			<ellipse cx="134" cy="116" rx="9" ry="5" fill="var(--rat)" />
			<ellipse cx="116" cy="118" rx="9" ry="5" fill="var(--rat)" />
			{/* face */}
			<circle cx="142" cy="75" r="2.8" fill="var(--rat-eye)" />
			<circle cx="165" cy="82" r="3.4" fill="var(--rat-pink)" />
			{/* whiskers */}
			<g stroke="var(--rat)" strokeWidth="1.3" strokeLinecap="round" opacity="0.8">
				<path d="M152 84 L182 76" />
				<path d="M153 87 L184 87" />
				<path d="M152 90 L180 98" />
			</g>
		</svg>
	);
}
