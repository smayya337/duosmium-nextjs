export function Navbar() {
	return (
		<header className="mdc-top-app-bar">
			<div className="mdc-top-app-bar__row">
				<section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
					<span className="mdc-top-app-bar__title">Duosmium Results</span>
				</section>
				<section
					className="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
					role="toolbar"
				>
					<button
						className="material-icons mdc-top-app-bar__action-item mdc-icon-button"
						aria-label="Account"
					>
						account_circle
					</button>
				</section>
			</div>
		</header>
	);
}
