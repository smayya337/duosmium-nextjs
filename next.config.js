/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
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
	}
};

module.exports = nextConfig;
