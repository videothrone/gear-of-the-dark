export default function About() {
	return (
		<section className="about" aria-labelledby="about__title">
			<h1 className="about__title">Straight outta Florida und Oregon</h1>
			<div className="about__content">
				<img
					src="/img/promo2024.webp"
					alt="Gear of the Dark - Der Podcast"
					className="about__image"
				/>
				<div className="about__text">
					<p>
						... erzählen die beiden Exil-Kartoffeln Hanno Klänhardt (Mantar) und
						Simon Hawemann (ex-War From A Harlots Mouth/Nightmarer) aus dem
						skurrilen Alltag eines sogenannten &quot;Heavy Metal
						Berufsmusikers&quot;.
					</p>

					<p>
						Gewagte Thesen wechseln sich ab mit reißerischen Halbwahrheiten und
						Gags am Tellerrand. Straßengeschichten aus erster Hand treffen auf
						eiskalte Business-Insides und endnerdigen Equipment-Talk.
					</p>

					<p>
						Und all das ausgerechnet aus Liebe. Aus Liebe zur Musik. Von
						Musikern für Musiker und alle die es werden woll(t)en...
					</p>

					<p>Präsentiert von ESP Guitars.</p>

					<div className="about__social-links">
						<h2>Folgt uns auf:</h2>
						<ul className="about__social-list">
							<li>
								<a
									href="https://facebook.com/gearofthedark"
									target="_blank"
									rel="noopener noreferrer"
									className="about__social-link"
								>
									Facebook
								</a>
							</li>
							<li>
								<a
									href="https://instagram.com/gearofthedark_podcast"
									target="_blank"
									rel="noopener noreferrer"
									className="about__social-link"
								>
									Instagram
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
