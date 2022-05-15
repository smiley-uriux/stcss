import React, { createContext } from 'react';
import { useMediaQueries } from './hooks';

export type StMediaQuery = string | [undefined, number] | [number, undefined] | [number, number];

export type StConfig<MQ extends Record<string, StMediaQuery>> = {
    theme?: string;
    mediaQueries: MQ;
    breakpoints: (keyof MQ)[];
};

export const makeStConfig = <MQ extends Record<string, string>>(config: StConfig<MQ>) => config;

const defaultConfig = makeStConfig({
    theme: 'default',
    mediaQueries: {
        mobile: '(max-width: 719px)',
        tablet: '(min-width: 720px) and (max-width: 991px)',
        laptop: '(min-width: 992px) and (max-width: 1199px)',
        desktop: '(min-width: 1200px)',
    },
    breakpoints: ['mobile', 'tablet', 'laptop', 'desktop'],
});

export const StContext = createContext({ bpIndex: 0 });

export const StProvider = <MQ extends Record<string, string>>({ children, config }: { children: React.ReactNode; config?: StConfig<MQ> }) => {
    //const hasMounted = useHasMounted();
    const conf = config || defaultConfig;
    const mq = useMediaQueries(conf.mediaQueries);
    const bpIndex = conf.breakpoints.findIndex((bp) => mq[bp]);

    const value = {
        bpIndex,
    };

    return <StContext.Provider value={value}>{children}</StContext.Provider>;
};
