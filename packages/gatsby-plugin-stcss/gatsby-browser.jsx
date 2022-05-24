// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import * as React from 'react';
//import type { GatsbyBrowser } from 'gatsby';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { canonizeStCss, isStCss, StProvider } = require('@smiley-uriux/stcss');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.wrapRootElement = ({ element }, { plugins: _plugins, ...stCssOrConfig }) => {
    stCss = isStCss(stCssOrConfig) ? stCssOrConfig : canonizeStCss(stCssOrConfig);
    return <StProvider value={stCss}>{element}</StProvider>;
};
