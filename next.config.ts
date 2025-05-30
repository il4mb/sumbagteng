import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
	output: 'standalone',
	async rewrites() {
		return [
			{
				source: '/storage/:path*',
				destination: `https://is3.cloudhost.id/${process.env.S3_BUCKET_NAME}/:path*`,
			}
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
				port: '',
				pathname: '**',
			},
		],
	},
};

export default nextConfig;