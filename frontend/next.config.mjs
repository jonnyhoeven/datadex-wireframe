/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/dataset',
                destination: '/dataset.html',
            },
        ];
    },
};

export default nextConfig;
