// ============================================================
// PROJECTS — edit this file to change the Work section.
//
// Each project is shown as a row in the list plus a big stage.
// The stage shows the game's real thumbnail and icon from
// roblox-stats.json (with skeleton loaders until they arrive).
//
// Optional fields: `award`, `role`, `team`. Remove one and that
// line simply disappears.
// ============================================================

// Pulls the Roblox place id out of a game url, e.g. ".../games/12345/Name" -> "12345".
// The showcase uses it to look the game up in roblox-stats.json.
export function placeIdOf(url: string): string {
	return url.match(/games\/(\d+)/)?.[1] ?? "";
}

// Only used by the old illustrated scenes (scenes.tsx / plate.tsx), which the
// showcase no longer renders. Safe to keep or delete along with those files.
export type Motif = "door" | "clock" | "dumpling" | "cafe" | "foliage";

export interface Award {
	place: string; // e.g. "1st"
	event: string; // e.g. "RDC 2025"
}

export interface Project {
	id: string;
	name: string;
	url: string;
	blurb: string;
	meta: string; // short line under the title in the list
	tags: string[];
	award?: Award; // shown as a small pill under the game name
	role?: string;
	team?: boolean; // adds "Made with Gearworks Studios"
	motif: Motif;
}

export const projects: Project[] = [
	{
		id: "3m1",
		name: "3M1",
		url: "https://www.roblox.com/games/88481183745824/3M1",
		blurb: "A systems-driven escape game built around the jam theme Break the System.",
		meta: "RDC 2025",
		tags: ["Game jam", "Escape game", "Systems", "UI"],
		award: { place: "1st", event: "RDC 2025" },
		role: "Programmer, UI",
		team: true,
		motif: "door",
	},
	{
		id: "malice",
		name: "Malice",
		url: "https://www.roblox.com/games/18892236729/MALICE",
		blurb: "A time-based scoring game built around the jam theme Time Is Your Enemy.",
		meta: "Inspire 2024",
		tags: ["Game jam", "Time-based", "Scoring"],
		award: { place: "2nd", event: "Inspire 2024" },
		role: "Programmer, UI",
		team: true,
		motif: "clock",
	},
	// {
	// 	id: "dumplings",
	// 	name: "+1 Slide Height for Dumplings",
	// 	url: "https://www.roblox.com/games/125078909503397/1-Slide-Height-for-Dumplings",
	// 	blurb: "A fully working game based on the squishy trend, built for a commissioner.",
	// 	meta: "Commission",
	// 	tags: ["Commission", "Full game"],
	// 	motif: "dumpling",
	// },
	{
		id: "hybrid-cafe",
		name: "The Hybrid Cafe",
		url: "https://www.roblox.com/games/132813250731469",
		blurb: "A story-driven horror game set in a maid cafe, with custom systems.",
		meta: "Story",
        role: "Current Developer",
		tags: ["Story", "Horror", "Maid Cafe"],
		motif: "cafe",
	},
	{
		id: "camo-or-snipe",
		name: "Camo Or Snipe!",
		url: "https://www.roblox.com/games/125700405216363",
		blurb: "A hide-and-seek game built around camouflage.",
		meta: "Hide and seek",
        role: "Gameplay Programmer (Short-Term)",
		tags: ["Hide and seek", "Camo"],
		motif: "foliage",
	},
];

export const studio = {
	name: "Gearworks Studios",
	url: "https://www.roblox.com/communities/34692920/Gearworks-Studios#!/about",
};

// Kept for later in case you want the team list back on the page.
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

export interface Company {
	name: string;
	url: string;
	years: string;
	description: string;
	role?: string; // optional small tag under the name
}

// Companies and studios I've worked for. Edit this list to change the section.
export const companies: Company[] = [
	{
		name: "Increates",
		url: "https://increates.com",
		years: "2025 – Present",
		description:
			"A full-stack Roblox studio that acquires, develops and grows high-potential games with dedicated in-house teams.",
	},
	{
		name: "Rumble Party",
		url: "https://rumble.party/",
		years: "2026 – Present",
		description: "An 8-player party game collection packed with chaotic challenges, from fast races to puzzle games.",
	},
	{
		name: "Sam's Development Studio",
		url: "https://www.samsdevstudio.com/",
		years: "2025",
		description: "Worked on Artifact with the studio.",
	},
];
