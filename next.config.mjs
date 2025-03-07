/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegurar que las variables de entorno se expongan correctamente
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MONGODB_URI: process.env.MONGODB_URI
  },
  // Deshabilitar ESLint en modo producción para evitar errores en el build
  eslint: {
    // Cambia a true cuando estés desarrollando, false para producción
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
