module.exports = {
    siteMetadata: {
        title: `StCss Gatsby Example`,
    },
    plugins: [
        {
            resolve: `@smiley-uriux/gatsby-plugin-stcss`,
            options: {
                mediaQueries: {
                    mobile: '(max-width: 719px)',
                    tablet: '(min-width: 720px) and (max-width: 991px)',
                    laptop: '(min-width: 992px) and (max-width: 1199px)',
                    desktop: '(min-width: 1200px)',
                },
                breakpoints: ['mobile', 'tablet', 'laptop', 'desktop'],
            },
        },
    ],
};
