import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// A quirky, characterful grotesque for headings, and a quiet grotesk for text.
// Bricolage Grotesque has an optical-size axis, so big headings get tighter,
// punchier letterforms automatically.
const display = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-display",
	axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
	subsets: ["latin"],
	variable: "--font-body",
});

export const metadata: Metadata = {
	title: "ItzMrRatsP Portfolio",
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
			className={`${display.variable} ${hanken.variable}`}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>{children}</body>
		</html>
	);
}
