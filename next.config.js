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
	}
};

module.exports = nextConfig;
