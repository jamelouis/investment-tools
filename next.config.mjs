/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath:
    process.env.NODE_ENV === "production" ? "/jamelouis.github.io/" : "",
  assetPrefix:
    process.env.NODE_ENV === "production" ? "/jamelouis.github.io/" : "",
};

export default nextConfig;
