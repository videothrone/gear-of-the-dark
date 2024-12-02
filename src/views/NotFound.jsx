import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<div>
			<h1>404 - Seite nicht gefunden</h1>
			<p>Die von Ihnen gesuchte Seite existiert leider nicht.</p>
			<Link to="/">Zurück zur Startseite</Link>
		</div>
	);
}
