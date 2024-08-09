/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath:
    process.env.NODE_ENV === "production" ? "/jamelouis.github.io" : "",
  assetPrefix:
    process.env.NODE_ENV === "production" ? "/jamelouis.github.io" : "",
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    output: 'export',
};

export default nextConfig;
