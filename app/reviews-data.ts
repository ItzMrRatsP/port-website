// ============================================================
// REVIEWS — edit this file to add or remove reviews.
// The "Kind words" section reads straight from this array and
// disappears on its own if the array is empty.
//
//   id     - unique string
//   name   - reviewer's name or username
//   role   - optional short label, e.g. "Client" (omit to hide)
//   rating - whole number from 1 to 5
//   text   - the review itself
// ============================================================

export interface Review {
	id: string;
	name: string;
	role?: string;
	rating: number;
	text: string;
}

export const reviews: Review[] = [
	{
		id: "1",
		name: "ItzSadGT",
		role: "Client",
		rating: 5,
		text: "Delivered exactly what we needed and communicated clearly the whole way through. Would hire again.",
	},
	{
		id: "2",
		name: "studiobuilder",
		role: "Client",
		rating: 5,
		text: "Solid Luau work, fixed some tricky bugs other devs couldn't figure out. Fast turnaround too.",
	},
	{
		id: "3",
		name: "newdevlearner",
		role: "Student",
		rating: 4,
		text: "Really patient teacher, explained things in a way that actually made sense. Learned a ton in a few sessions.",
	},
];
