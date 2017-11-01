module.exports = {
  "globDirectory": "dist/",
  "globPatterns": [
    "**/*.{ico,html,js,map}"
  ],
  "swDest": "dist/sw.js",
  "globIgnores": [
    "../workbox-cli-config.js"
  ],
  "maximumFileSizeToCacheInBytes": 5242880,
  "runtimeCaching": [
    {
      urlPattern: 'https://res.cloudinary.com/dc3dnmmpx/image/upload/(.*)',
      handler: 'staleWhileRevalidate'
    }
  ]
};
