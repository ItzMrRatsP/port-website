import type { Metadata } from "next";
import { Pixelify_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Pixelify_Sans({ subsets: ["latin"], variable: "--font-display" });
const body = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });

export const metadata: Metadata = {
	title: "ItzMrRatsP | Roblox Scripting Commissions",
	description:
		"Full-stack Roblox developer taking scripting commissions: gameplay systems, UI, tooling and optimization. Clear scopes, fair pricing, clean Luau.",
};

// Runs before first paint so visitors never see a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('site-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body>{children}</body>
		</html>
	);
}
