/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const ckanBaseUrl = process.env.CKAN_BASE_URL || 'http://127.0.0.1:5000';

        return [
            {
                source: '/api/3/action/:path*',
                destination: `${ckanBaseUrl}/api/3/action/:path*`,
            },
        ]
    },
};

export default nextConfig;
