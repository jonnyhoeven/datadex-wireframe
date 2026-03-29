/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const ckanBaseUrl = process.env.CKAN_BASE_URL || 'http://localhost:4000';

        return [
            {
                source: '/ckan/api/3/action/:path*',
                destination: `${ckanBaseUrl}/api/3/action/:path*`,
            }
        ]
    },
};

export default nextConfig;
