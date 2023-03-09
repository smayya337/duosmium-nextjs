export function fullSchoolName(name: string, city: string | null, state: string) {
	const location = city ? `(${city}, ${state})` : `(${state})`;
	return `${name} ${location}`;
}
