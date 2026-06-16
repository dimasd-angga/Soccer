/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    // Silence optional-peer warnings from wagmi / walletconnect / metamask
    // SDKs. These modules are only used in non-browser runtimes (React Native
    // and pino-pretty in dev), but webpack still warns when it can't find
    // them. Aliasing them to `false` resolves them to an empty module.
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'photo.yupoo.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/proxy-image/**',
      },
      {
        protocol: 'https',
        hostname: '*',
        port: '',
        pathname: '/api/proxy-image/**',
      },
    ],
    dangerouslyAllowSVG: true,
    // Ensure images render in-browser (not downloaded)
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Referer',
            value: 'https://jersey-factory.x.yupoo.com/',
          },
          {
            key: 'User-Agent',
            value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;