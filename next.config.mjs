/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',  // Agrega el dominio del placeholder
                port: '',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'unzklawlrqtiwnsjxrga.supabase.co',  // Agrega el dominio del placeholder
                port: '',
                search: '',
            },
        ],
    }
};

export default nextConfig;
