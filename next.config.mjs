/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegurar que las variables de entorno se expongan correctamente
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MONGODB_URI: process.env.MONGODB_URI
  }
};

export default nextConfig;
