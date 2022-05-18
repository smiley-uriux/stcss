/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement } from 'react';
import { useSt } from './hooks';
import { Obj, PartialSome, PickRequired, RequiredKeys, StComponent, StCreateOptions, StCssProps, StExtendOptions, StResponsiveObj } from './types';
import { mergeResponsiveObjs, mergeStObjs, resolveDynamicValue, resolveStStyle } from './util';

export const st = <P extends Obj = Obj>() => {
    return function st<
        I extends keyof JSX.IntrinsicElements,
        PD extends Partial<P> = Obj,
        FA extends Exclude<keyof JSX.IntrinsicElements[I], 'className'> = never,
        FC extends keyof StCssProps = never
    >(options: StCreateOptions<I, P, PD, FA, FC>): StComponent<I, PartialSome<P, keyof PD> & Pick<JSX.IntrinsicElements[I], FA> & Pick<StCssProps, FC>> {
        const { el, defaultAttrs = [], defaultProps = [], className = [], forwardAttrs = [], forwardCss = [], css = [], render } = options;

        const defaultAttrsArray = Array.isArray(defaultAttrs) ? defaultAttrs : [defaultAttrs];
        const defaultPropsArray = Array.isArray(defaultProps) ? defaultProps : [defaultProps];
        const defaultCssArray = Array.isArray(css) ? css : [css];
        const classNameArray = Array.isArray(className) ? className : [className];

        const St = function St({
            children,
            as,
            attrs,
            css,
            className,
            ...props
        }: Record<string, unknown> & {
            children?: React.ReactNode;
            as?: I;
            attrs?: Record<string, unknown>;
            className?: string;
            css?: StResponsiveObj<Record<string, string>>;
        }) {
            const { bpIndex, styleManager } = useSt();

            const forwardedAttrs: Record<string, unknown> = {};
            const forwardedCss: Record<string, unknown> = {};
            if (forwardAttrs.length || forwardCss.length) {
                Object.keys(props).forEach((prop) => {
                    if (forwardAttrs.includes(prop as FA)) {
                        forwardedAttrs[prop] = props[prop];
                    } else if (forwardCss.includes(prop as FC)) {
                        forwardedCss[prop] = props[prop];
                    }
                });
            }

            const mergedProps = mergeStObjs<any, any>(bpIndex, [...defaultPropsArray, props]);
            const mergedAttrs = mergeStObjs<any, any>(bpIndex, [...defaultAttrsArray, attrs, forwardedAttrs], mergedProps);

            const mergedCss = mergeResponsiveObjs(
                [...defaultCssArray, css, forwardedCss].map((style) => resolveStStyle(style, mergedProps)),
                styleManager.config.breakpoints.length
            );
            const cssClassNames = styleManager.getClassesForStyle(mergedCss);
            const classNames = [...classNameArray.map((c) => resolveDynamicValue(c, mergedProps)), className, ...cssClassNames].filter(Boolean);
            if (classNames.length) {
                mergedAttrs['className'] = classNames.join(' ');
            }

            if (!render) {
                // TODO: investigate why this any is necessary
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return createElement(as || el, mergedAttrs, children) as any;
            }

            return render({ C: as || el, attrs: { children, ...mergedAttrs }, ...mergedProps });
        };

        St.extend = (<E extends Obj = Obj>() => {
            return function stExtend<
                ED extends Omit<PickRequired<PartialSome<P, keyof PD>>, RequiredKeys<E>> & Partial<E> = Omit<
                    PickRequired<PartialSome<P, keyof PD>>,
                    RequiredKeys<E>
                > &
                    Partial<E>,
                A extends keyof JSX.IntrinsicElements = I,
                EFA extends Exclude<keyof JSX.IntrinsicElements[A], 'className'> = never,
                EFS extends keyof StCssProps = never
            >(options: StExtendOptions<I, PartialSome<P, keyof PD>, E, ED, A, EFA, EFS>) {
                const extendedCss = options.css || [];
                return st({
                    el: options.as || (el as any),
                    className: options.className as any,
                    forwardAttrs: options.forwardAttrs as any,
                    forwardCss: options.forwardCss as any,
                    defaultAttrs: [...defaultAttrsArray, options.defaultAttrs as any],
                    defaultProps: [...defaultPropsArray, options.defaultProps as any],
                    css: [...defaultCssArray, ...(Array.isArray(extendedCss) ? extendedCss : [extendedCss])] as any,
                    render,
                });
            };
        }) as any;

        return St as any;
    };
};

/*

const Test = st<{ size: number }>()({
    el: 'h1',
    forwardCss: ['transition'],
});

<Test size={2} transition="asdf" />;

const TestExtend = Test.extend<{ newProps?: string; size: number }>()({
    defaultAttrs: {
        title: 'test',
    },
    forwardAttrs: ['title'],
    forwardCss: ['margin'],
});

export type StComponent<I extends keyof JSX.IntrinsicElements, P extends Obj = Obj> = FC<StComponentProps<I, P>> & {
    extend: <E extends Obj = Obj>() => <
        ED extends Omit<PickRequired<P>, RequiredKeys<E>> & Partial<E> = Omit<PickRequired<P>, RequiredKeys<E>> & Partial<E>,
        A extends keyof JSX.IntrinsicElements = I,
        FA extends Exclude<keyof JSX.IntrinsicElements[A], 'className'> = never,
        FS extends keyof StCssProps = never
    >(
        options: StExtendOptions<I, P, E, ED, A, FA, FS>
    ) => StComponent<A, PartialSome<E, keyof PickRequired<ED>> & Pick<JSX.IntrinsicElements[A], FA> & Pick<StCssProps, FS>>;
};



export const stOld: St = <I extends keyof JSX.IntrinsicElements, E extends Obj = Obj>(
    elOrComponent: I | StComponent<I, E>,
    options: StExtendOptions<I, E> = {}
) => {
    return function st<P extends Obj = Obj>(...stylesOrInline: any[]): StComponent<I, E & P> {
        return function St({ children, as, css: _css, attrs, ...componentProps }) {

            return createElement(as || elOrComponent, mergedAttrs, children);

            const { defaultAttrs, defaultProps } = options;

            let meta: StMeta<I, E & P> = [];

            meta.push({
                defaultProps,
                defaultAttrs,
            });

            if (typeof elOrComponent !== 'string') {
                meta = ((elOrComponent as any).meta || []).concat(meta);
            }

            const mergedAttrs = mergeResponsiveObjs(bpIndex, ...meta.map((m) => m.defaultAttrs), attrs);

            const mergedProps = mergeResponsiveObjs<any>(bpIndex, ...meta.map((m) => m.defaultProps), componentProps);

            (St as any).meta = meta || [];

            const tag = typeof elOrComponent === 'string' ? elOrComponent : (elOrComponent as any).el;

            if (Array.isArray(stylesOrInline[0])) {
                console.log('inline', attrs);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [component, ...styles] = stylesOrInline[0] as StCreateInlineArgs<I, E, P>;
                const Tag: FC = ({ children, ...props }) => {
                    return createElement(as || elOrComponent, props as any, children);
                };
                (St as any).component = component;
                (St as any).el = tag;
                return component({
                    Tag: Tag as any,
                    attrs: mergedAttrs,
                    children,
                    ...mergedProps,
                });
            }

            //const styles = stylesOrInline as StStyle<E & P & { attrs: JSX.IntrinsicElements[I] }>;

            if (typeof elOrComponent === 'string') {
                console.log('primitive', attrs);
                return createElement(as || elOrComponent, mergedAttrs, children);
            } else if ((elOrComponent as any).component) {
                console.log('are we getting here...');
                const Tag: FC<JSX.IntrinsicElements[I]> = (attrs) => {
                    return createElement(as || tag, attrs);
                };
                return (elOrComponent as any).component({
                    Tag: Tag as any,
                    children,
                    attrs: mergedAttrs,
                    ...(mergedProps as P),
                });
            }
        };
    };
};
*/
