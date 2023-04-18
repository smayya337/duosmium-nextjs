/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true
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
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'duosmium-*.vercel.app',
				port: '',
				pathname: '/images/**',
			},
			{
				protocol: 'https',
				hostname: '**.duosmium.org',
				port: '',
				pathname: '/images/**',
			}
		],
	},
};

module.exports = nextConfig;
