/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'saro-resume-2004.storage.c2.liara.space',
			},
		],
	},
};

module.exports = nextConfig;
