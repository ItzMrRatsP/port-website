import { reviews } from "./reviews-data";

export default function Reviews() {
	if (!reviews.length) return null;

	return (
		<section className="section" aria-labelledby="reviews-title">
			<div className="wrap">
				<h2 id="reviews-title">Kind words</h2>
				<div className="quotes">
					{reviews.map((r) => (
						<figure className="quote" key={r.id} style={{ margin: 0 }}>
							<div className="quote-dots" role="img" aria-label={`Rated ${r.rating} out of 5`}>
								{Array.from({ length: 5 }).map((_, i) => (
									<span key={i} className={i < r.rating ? "quote-dot quote-dot--on" : "quote-dot"} />
								))}
							</div>
							<blockquote>{r.text}</blockquote>
							<figcaption>
								{r.name}
								{r.role && <span className="quote-role">, {r.role}</span>}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
