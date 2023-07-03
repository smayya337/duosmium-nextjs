export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'Duosmium Results',
	description:
		'Find the overall standings and event scores for hundreds of Science Olympiad tournaments!',
	mainNav: [
		{
			title: 'Tournament Scoring',
			href: 'https://scoring.duosmium.org'
		},
		{
			title: 'All Results',
			href: '/results/all'
		},
		{
			title: 'By School',
			href: '/results/schools'
		}
	],
	links: {
		github: 'https://github.com/duosmium/duosmium-nextjs'
	}
};
