/** @type {import('next').NextConfig} */
const nextConfig = {
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
