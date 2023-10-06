/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true
	},
	webpack: (config, options) => {
		config.experiments = {
			...config.experiments,
			layers: true,
			topLevelAwait: true
		};
		return config;
	},
	images: {
		domains: [process.env.BASE_URL.replace(/https?:\/\//, '').replace(/:\d+/, '')]
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/results',
				permanent: true
			}
		];
	}
};

module.exports = nextConfig;
