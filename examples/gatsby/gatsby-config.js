module.exports = {
  siteMetadata: {
    title: `StCss Gatsby Example`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-stcss`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    }
  ],
}
