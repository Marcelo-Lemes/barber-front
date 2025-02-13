/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    trailingSlash: false, // Certifique-se de que está como false
    async redirects() {
      return [
        {
          source: '/404.html',
          destination: '/',
          permanent: false, // Define que o redirecionamento é temporário
        },
      ]
    }
  }
  

export default nextConfig;
