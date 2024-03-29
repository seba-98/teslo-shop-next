/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
  images:{
    domains:['res.cloudinary.com', 'localhost', 'https://teslos-shop-app.herokuapp.com/' ]
  },
  experimental:{
    outputStandalone:true
  },
  staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig
