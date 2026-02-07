const socials: Record<string, { link: string; icon: string }> = {
	Github: {
		link: "https://github.com/ItzMrRatsP",
		icon: "../github.svg",
	},

	Roblox: {
		link: "https://www.roblox.com/users/2536605621/profile",
		icon: "../roblox.svg",
	},

	Twitter: {
		link: "https://x.com/ItzMrRatsP",
		icon: "../twitter.svg",
	},
};

/**
 * Returns a list of social media links.
 *
 * @returns {JSX.Element} A list of social media links.
 */
export default function GetSocials() {
	return (
		<li className="list">
			<ul className="list">
				{Object.entries(socials).map(([k, v]) => (
					<li key={k}>
						<a
							href={v.link}
							className="description"
							target="_blank"
							rel="noopener noreferrer">
							<img
								className="social"
								src={v.icon}
								alt={k}
							/>
						</a>
					</li>
				))}
			</ul>
		</li>
	);
}
