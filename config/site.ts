export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'Duosmium Results',
	description:
		'Find the overall standings and event scores for hundreds of Science Olympiad tournaments!',
	mainNav: [
		{
			title: 'Home',
			href: '/'
		},
		{
			title: 'All Results',
			href: '/results/all'
		}
	],
	links: {
		github: 'https://github.com/duosmium/duosmium-nextjs'
	}
};
