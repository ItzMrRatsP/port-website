import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import BackgroundMusic from "./background-music";
import "./globals.css";

// A soft, slightly rounded serif for headings, and a quiet grotesk for text.
const fraunces = Fraunces({
	subsets: ["latin"],
	variable: "--font-display",
	axes: ["SOFT", "opsz"],
	style: ["normal", "italic"],
});

const hanken = Hanken_Grotesk({
	subsets: ["latin"],
	variable: "--font-body",
});

export const metadata: Metadata = {
	title: "ItzMrRatsP – Roblox developer",
	description: "Portfolio of itzmrratsp, a full-stack Roblox developer building games, systems and tools.",
};

// Runs before first paint so visitors never see a flash of the wrong theme.
// Uses their saved choice, otherwise follows the system setting.
const themeScript = `(function(){try{var t=localStorage.getItem('site-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${fraunces.variable} ${hanken.variable}`}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>
				{children}
				<BackgroundMusic />
			</body>
		</html>
	);
}
