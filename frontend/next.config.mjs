/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const ckanBaseUrl = process.env.CKAN_BASE_URL || 'http://127.0.0.1:4000';

        return [
            {
                source: '/api/3/action/:path*',
                destination: `${ckanBaseUrl}/api/3/action/:path*`,
            },
            {
                source: '/api/activity-predictor/:path*',
                destination: `http://127.0.0.1:8501/:path*`,
            },
        ]
    },
};

export default nextConfig;
