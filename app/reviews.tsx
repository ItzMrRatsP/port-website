"use client";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { reviews } from "./reviews-data";

export default function Reviews() {
	// Section disappears on its own if every review is removed from reviews-data.ts
	if (!reviews.length) return null;

	return (
		<div className="reviews-wrap">
			<div className="reviews-grid">
				{reviews.map((r) => (
					<div
						className="review-card"
						key={r.id}>
						<FaQuoteLeft className="review-quote-icon" />
						<div className="review-stars">
							{Array.from({ length: 5 }).map((_, i) => (
								<FaStar
									key={i}
									className={i < r.rating ? "review-star review-star--filled" : "review-star"}
								/>
							))}
						</div>
						<p className="review-text">{r.text}</p>
						<div className="review-footer">
							<span className="review-name">{r.name}</span>
							{r.role && <span className="review-role">{r.role}</span>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
