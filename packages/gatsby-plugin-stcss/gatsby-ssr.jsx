// eslint-disable-next-line @typescript-eslint/no-unused-vars
//import * as React from 'react';

//import type { GatsbySSR } from 'gatsby';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { canonizeStCss, isStCss, StProvider } = require('@smiley-uriux/stcss');

let stCss;

exports.wrapRootElement = ({ element }, { plugins: _plugins, ...stCssOrConfig }) => {
    stCss = isStCss(stCssOrConfig) ? stCssOrConfig : canonizeStCss(stCssOrConfig);
    return <StProvider value={stCss}>{element}</StProvider>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.onRenderBody = ({ setHeadComponents }) => {
    setHeadComponents([<style key="stcss" dangerouslySetInnerHTML={{ __html: stCss.styleManager.toString() }} />]);
};
