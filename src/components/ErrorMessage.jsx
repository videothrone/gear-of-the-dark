export default function ErrorMessage({ message }) {
	return (
		<div className="error-message" role="alert" aria-live="assertive">
			<div className="error-message__content">
				<p className="error-message__text">{message}</p>
			</div>
		</div>
	);
}
