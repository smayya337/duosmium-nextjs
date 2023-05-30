export function ResultCardGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className="mdc-layout-grid">
			<div className="mdc-layout-grid__inner">{children}</div>
		</div>
	);
}
