"use client";
import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; s: number; p: number; z: number };
type Shoot = { x: number; y: number; vx: number; vy: number; life: number };

// Twinkling star field that fills its parent. Stars drift slowly, shift with
// the pointer for depth, and an occasional shooting star crosses. Colour
// follows the theme (--ink). No dependencies; pauses off-screen and draws a
// single still frame when the visitor prefers reduced motion.
export default function Stars() {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		const ctx = canvas?.getContext("2d");
		const parent = canvas?.parentElement;
		if (!canvas || !ctx || !parent) return;

		const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
		let w = 0, h = 0, raf = 0, last = 0, now = 0;
		let stars: Star[] = [];
		let tx = 0, ty = 0, mx = 0, my = 0;
		let shoot: Shoot | null = null;
		let nextShoot = 2500;
		let ink = "#fff", k = 1;

		const readTheme = () => {
			const root = document.documentElement;
			ink = getComputedStyle(root).getPropertyValue("--ink").trim() || "#fff";
			k = root.getAttribute("data-theme") === "light" ? 0.7 : 1;
		};

		const draw = (t: number) => {
			const dt = Math.min(t - last, 50);
			last = t;
			mx += (tx - mx) * 0.05;
			my += (ty - my) * 0.05;
			ctx.clearRect(0, 0, w, h);
			ctx.fillStyle = ink;
			ctx.strokeStyle = ink;
			for (const s of stars) {
				const x = (((s.x - t * 0.006 * s.z + mx * s.z * 26) % w) + w) % w;
				const y = (((s.y + my * s.z * 26) % h) + h) % h;
				const tw = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 * s.s + s.p);
				ctx.globalAlpha = s.a * tw * k;
				ctx.beginPath();
				ctx.arc(x, y, s.r, 0, Math.PI * 2);
				ctx.fill();
			}
			if (!reduce) {
				if (!shoot && t > nextShoot) {
					shoot = { x: w * (0.3 + Math.random() * 0.7), y: Math.random() * h * 0.4, vx: -0.55, vy: 0.3, life: 1 };
				}
				if (shoot) {
					const len = 110;
					const segs = 16;
					ctx.lineWidth = 1.2;
					for (let i = 0; i < segs; i++) {
						ctx.globalAlpha = (1 - i / segs) * shoot.life * k * 0.9;
						ctx.beginPath();
						ctx.moveTo(shoot.x - shoot.vx * (len / segs) * i * 1.8, shoot.y - shoot.vy * (len / segs) * i * 1.8);
						ctx.lineTo(shoot.x - shoot.vx * (len / segs) * (i + 1) * 1.8, shoot.y - shoot.vy * (len / segs) * (i + 1) * 1.8);
						ctx.stroke();
					}
					shoot.x += shoot.vx * dt * 1.4;
					shoot.y += shoot.vy * dt * 1.4;
					shoot.life -= dt * 0.0011;
					if (shoot.life <= 0) {
						shoot = null;
						nextShoot = t + 5000 + Math.random() * 6000;
					}
				}
			}
			ctx.globalAlpha = 1;
		};

		const resize = () => {
			const r = parent.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = r.width;
			h = r.height;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const n = Math.round(Math.min(220, (w * h) / 5500));
			stars = Array.from({ length: n }, () => ({
				x: Math.random() * w,
				y: Math.random() * h,
				r: 0.3 + Math.random() ** 2 * 1.3,
				a: 0.25 + Math.random() * 0.6,
				s: 0.5 + Math.random() * 1.5,
				p: Math.random() * Math.PI * 2,
				z: 0.2 + Math.random() * 0.8,
			}));
			draw(now);
		};

		const loop = (t: number) => {
			now = t;
			draw(t);
			raf = requestAnimationFrame(loop);
		};
		const start = () => {
			if (!reduce && !raf) raf = requestAnimationFrame(loop);
		};
		const stop = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		const onMove = (e: PointerEvent) => {
			tx = (e.clientX / window.innerWidth - 0.5) * 2;
			ty = (e.clientY / window.innerHeight - 0.5) * 2;
		};
		const onVisibility = () => (document.hidden ? stop() : start());

		readTheme();
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(parent);
		const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
		io.observe(parent);
		const mo = new MutationObserver(() => {
			readTheme();
			if (reduce) draw(now);
		});
		mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
		window.addEventListener("pointermove", onMove, { passive: true });
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			stop();
			ro.disconnect();
			io.disconnect();
			mo.disconnect();
			window.removeEventListener("pointermove", onMove);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, []);

	return <canvas ref={ref} className="stars" aria-hidden="true" />;
}
