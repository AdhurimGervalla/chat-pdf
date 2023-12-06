const withPWA = require('next-pwa')
const runtimeCaching = require( 'next-pwa/cache.js');


/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    dest: 'public',
    runtimeCaching
})(
    {webpack: (config) => {
        config.resolve.alias.canvas = false;  
        return config;
    }}
);

module.exports = nextConfig
