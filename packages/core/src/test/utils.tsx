/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { StProvider } from '../context';

const config = {
    theme: 'default',
    mediaQueries: {
        mobile: '(max-width: 719px)',
        tablet: '(min-width: 720px) and (max-width: 991px)',
        laptop: '(min-width: 992px) and (max-width: 1199px)',
        desktop: '(min-width: 1200px)',
    },
    breakpoints: ['mobile', 'tablet', 'laptop', 'desktop'],
};

export const renderAtBp = (bp: string, el: React.ReactElement) => {
    window.matchMedia = vi.fn().mockImplementation((mq) => {
        return {
            addEventListener: () => {},
            removeEventListener: () => {},
            matches: mq === (config.mediaQueries as any)[bp],
        };
    });

    cleanup();

    const { container } = render(el, {
        wrapper: ({ children }) => <StProvider config={config}>{children}</StProvider>,
    });

    // JSDOM uses CSSOM which cannot parse CSS media queries (and just ignores them)
    // to overcome this limitation, we copy over the rules within the media query / breakpoint
    // we are currently testing/rendering, and insert them into the style tag manually wihout
    // wrapping them inside a media query
    const style = document.getElementById(`st-${bp}`) as HTMLStyleElement;
    style.innerHTML = style.sheet?.cssRules[0]?.cssText.replace(/@media (?:[^{]*){([\s\S]*)}/, '$1') || '';

    return container.firstChild;
};

export const testAtBps = (el: React.ReactElement, bpTest: (el: ChildNode | null, bpIndex: number) => void) => {
    config.breakpoints.forEach((bp, i) => {
        test(`at ${bp} breakpoint`, () => {
            bpTest(renderAtBp(bp, el), i);
        });
    });
};
