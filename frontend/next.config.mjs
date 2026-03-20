/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/ckan/:path*',
                destination: 'http://ckan:5000/api/3/action/:path*',
            },
        ]
    },
};

export default nextConfig;
