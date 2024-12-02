export default function Card({ item }) {
	return (
		<article className="card">
			<h2 className="card__title">
				<a
					href={item.link}
					target="_blank"
					rel="noopener noreferrer"
					className="card__link"
				>
					{item.title}
				</a>
			</h2>
			<p className="card__date">
				<time dateTime={item.pubDate}>
					{new Date(item.pubDate).toLocaleDateString()}
				</time>
			</p>
			<div
				className="card__description"
				dangerouslySetInnerHTML={{ __html: item.description }}
			/>
		</article>
	);
}
