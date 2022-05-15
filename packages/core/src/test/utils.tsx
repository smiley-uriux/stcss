/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach } from 'vitest';
import { makeStConfig, StProvider } from '../context';

const config = makeStConfig({
    theme: 'default',
    mediaQueries: {
        mobile: 'mobile',
        tablet: 'tablet',
        laptop: 'laptop',
        desktop: 'desktop',
    },
    breakpoints: ['mobile', 'tablet', 'laptop', 'desktop'],
});

afterEach(() => {
    cleanup();
});

export const renderAtBp = (bp: string, el: React.ReactElement) => {
    window.matchMedia = vi.fn().mockImplementation((mq) => {
        return {
            addEventListener: () => {},
            removeEventListener: () => {},
            matches: mq === bp,
        };
    });

    const { container } = render(el, {
        wrapper: ({ children }) => <StProvider config={config}>{children}</StProvider>,
    });

    //debug();

    return container.firstChild;
};

export const renderAtBps = (el: React.ReactElement, test?: (el: ChildNode | null, bp: string) => void) => {
    const els = config.breakpoints.map((bp) => renderAtBp(bp, el));
    if (test) {
        els.forEach((el, i) => test(el, config.breakpoints[i]));
    }
    return els;
};
