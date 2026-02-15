import "./globals.css";

import { GetContributions, GetSocials } from "./socials";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="main">
			<div className="top-background"></div>
			<img
				className="image"
				alt="Avatar"
				src="./avatar.png"
			/>
			<h1 className="header">About me</h1>
			<p className="description">
				Hi, I'm ItzMrRatsP, a Roblox developer with 5 years of experience, and I'm proud to say that my projects
				have been visited over 100 million times. I've also had the opportunity to be trained by a professional
				scripter called DylWithIt, which has helped me to improve my skills and create high-quality content.
			</p>
			<p className="header">Contributions</p>
			<GetContributions></GetContributions>
			<h1 className="header">Socials</h1>
			<GetSocials></GetSocials>
		</div>
	);
}
