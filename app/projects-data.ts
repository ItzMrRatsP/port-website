// ============================================================
// PROJECTS & TEAM — edit this file to change the Work section.
//
// Each project gets a small illustrated "plate" instead of a
// screenshot, chosen with `motif`:
//   "door"     – an open doorway with scattered fragments
//   "clock"    – a ring clock
//   "dumpling" – a dumpling on a plate
//   "cafe"     – a cup with steam
//   "foliage"  – leaves with a scope ring
//
// `award` is optional. Remove it and the line simply disappears.
// ============================================================

export type Motif = "door" | "clock" | "dumpling" | "cafe" | "foliage";

export interface Project {
	id: string;
	name: string;
	url: string;
	blurb: string;
	award?: string;
	motif: Motif;
}

export const projects: Project[] = [
	{
		id: "3m1",
		name: "3M1",
		url: "https://www.roblox.com/games/88481183745824/3M1",
		blurb: "A systems-driven escape game built around the jam theme Break the System.",
		award: "1st place, RDC 2025",
		motif: "door",
	},
	{
		id: "malice",
		name: "Malice",
		url: "https://www.roblox.com/games/18892236729/MALICE",
		blurb: "A time-based scoring game built around the jam theme Time Is Your Enemy.",
		award: "2nd place, Inspire 2024",
		motif: "clock",
	},
	{
		id: "dumplings",
		name: "+1 Slide Height for Dumplings",
		url: "https://www.roblox.com/games/125078909503397/1-Slide-Height-for-Dumplings",
		blurb: "A fully working game based on the squishy trend, built for a commissioner.",
		motif: "dumpling",
	},
	{
		id: "hybrid-cafe",
		name: "The Hybrid Cafe",
		url: "https://www.roblox.com/games/132813250731469",
		blurb: "A cozy cafe roleplay experience with custom systems.",
		motif: "cafe",
	},
	{
		id: "camo-or-snipe",
		name: "Camo Or Snipe!",
		url: "https://www.roblox.com/games/125700405216363",
		blurb: "A fast-paced, hide-and-seek style shooter.",
		motif: "foliage",
	},
];

export const studio = {
	name: "Gearworks Studios",
	url: "https://www.roblox.com/communities/34692920/Gearworks-Studios#!/about",
};

export const crew = [
	{ name: "ItzMrRatsP", role: "Programmer, UI", url: "https://www.roblox.com/users/2536605621/profile" },
	{
		name: "BigUniverses",
		role: "Programmer, ideas, story",
		url: "https://www.roblox.com/users/129843010/profile",
	},
	{ name: "Boneblox", role: "Builder, lead story writer", url: "https://www.roblox.com/users/87768826" },
	{ name: "Stefano_css", role: "Modeler", url: "https://www.roblox.com/users/4998832582/profile" },
];
