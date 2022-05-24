/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react';
import { useMediaQueries } from './hooks';
import { StyleManager } from './style-manager';

export type StConfig<MQ extends Record<string, string> = any> = {
    mediaQueries: MQ;
    breakpoints: (keyof MQ)[];
};

/*
const defaultConfig = {
    mediaQueries: {
        mobile: '(max-width: 719px)',
        tablet: '(min-width: 720px) and (max-width: 991px)',
        laptop: '(min-width: 992px) and (max-width: 1199px)',
        desktop: '(min-width: 1200px)',
    },
    breakpoints: ['mobile', 'tablet', 'laptop', 'desktop'],
};
*/

export type StContext<MQ extends Record<string, string> = any> = StCss<MQ> & { bpIndex: number; mediaQueries: Record<keyof MQ, boolean> };

export type StCss<MQ extends Record<string, string> = any> = StConfig<MQ> & {
    styleManager: StyleManager;
};

export const isStCss = <MQ extends Record<string, string> = any>(config: StConfig<MQ> | StCss<MQ>): config is StCss<MQ> => {
    return (config as StCss<MQ>).styleManager !== undefined;
};

export const canonizeStCss = <MQ extends Record<string, string> = any>(config: StConfig<MQ>): StCss<MQ> => {
    const styleManager = new StyleManager(config);
    return {
        ...config,
        styleManager,
    };
};

export const StContext = createContext({} as StContext);

export const StProvider = <MQ extends Record<string, string> = any>({ children, value }: { children: React.ReactNode; value: StCss<MQ> }) => {
    const { mediaQueries: mqs, breakpoints } = value;
    const mediaQueries = useMediaQueries(mqs);
    const bpIndex = breakpoints.findIndex((bp) => mediaQueries[bp]);
    return <StContext.Provider value={{ ...value, bpIndex, mediaQueries }}>{children}</StContext.Provider>;
};
