import React, { createContext } from 'react';
import { useMediaQueries } from './hooks';
import { StyleManager } from './style-manager';

export type StConfig<MQ extends Record<string, string> = Record<string, string>> = {
    theme?: string;
    mediaQueries: MQ;
    breakpoints: (keyof MQ)[];
};

export const makeStConfig = <MQ extends Record<string, string>>(config: StConfig<MQ>) => config;

const defaultConfig = {
    theme: 'default',
    mediaQueries: {
        mobile: '(max-width: 719px)',
        tablet: '(min-width: 720px) and (max-width: 991px)',
        laptop: '(min-width: 992px) and (max-width: 1199px)',
        desktop: '(min-width: 1200px)',
    },
    breakpoints: ['mobile', 'tablet', 'laptop', 'desktop'],
};

const styleManager = new StyleManager(defaultConfig);

export const StContext = createContext({ bpIndex: 0, styleManager });

export const StProvider = ({ children, config }: { children: React.ReactNode; config?: StConfig }) => {
    //const hasMounted = useHasMounted();
    const conf = config || defaultConfig;
    const mq = useMediaQueries(conf.mediaQueries);
    const bpIndex = conf.breakpoints.findIndex((bp) => mq[bp]);

    const value = {
        bpIndex,
        styleManager,
    };

    return <StContext.Provider value={value}>{children}</StContext.Provider>;
};
