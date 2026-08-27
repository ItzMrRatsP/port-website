// ============================================================
// REVIEWS — edit this file to add or remove reviews.
// Nothing else needs to change; the Reviews section on the
// home page reads straight from this array.
//
// To ADD a review: copy one of the objects below, paste it
// inside the [ ] brackets, and fill in your own values.
// Give it a unique "id" (just bump the number).
//
// To REMOVE a review: delete its whole { ... } block.
//
// Fields:
//   id     - unique string, e.g. "1", "2", "3"
//   name   - reviewer's name or username
//   role   - optional short label, e.g. "Client", "Student" (omit to hide)
//   rating - whole number from 1 to 5
//   text   - the review text itself
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
