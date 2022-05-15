import React, { CSSProperties, FC } from 'react';
import * as CSS from 'csstype';

// eslint-disable-next-line @typescript-eslint/ban-types
export type Obj = object;

export type MaybeArray<V> = V | V[];

export type MergeDefaults<T, K> = Omit<T, Extract<K, keyof T>> & Required<Pick<T, Extract<K, keyof T>>>;
export type PartialSome<T, K> = Omit<T, Extract<K, keyof T>> & Partial<Pick<T, Extract<K, keyof T>>>;
export type RequiredLiteralKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : Obj extends Pick<T, K> ? never : K]: 0;
};
export type OptionalLiteralKeys<T> = keyof {
    [K in keyof T as string extends K ? never : number extends K ? never : Obj extends Pick<T, K> ? K : never]: 0;
};

export type RequiredKeys<T> = { [K in keyof T]-?: Obj extends Pick<T, K> ? never : K }[keyof T];
export type PickRequired<T> = Pick<T, RequiredKeys<T>>;
export type PickOptional<T> = Omit<T, RequiredKeys<T>>;

export type ExcludeUnassignable<T, U> = T extends U ? T : never;

// V = type of value that is to become responsive
// undefined indicates a values should inherit from smaller breakpoints
// null indicates the lack of (and removal) of a value
export type StResponsiveValue<V> = V | (V | undefined | null)[];

// O = object to make all values responsive
export type StResponsiveObj<O> = {
    [K in keyof O]: StResponsiveValue<O[K]>;
};

// V = type of value that should become dynamic
// A = args used to produce values dynamically
export type StDynamicValue<V, A> = V | ((args: A) => V | undefined);

// O = object to make all values responsive
// A = args used to produce values dynamically
export type StDynamicObj<O, A> = {
    [K in keyof O]: StDynamicValue<O[K], A>;
};

// O = object to make all values responsive
// A = args used to produce values dynamically
// the ultimate dynamic responsive object
export type StObj<O, A> = StDynamicValue<StDynamicObj<StResponsiveObj<O>, A>, A>;

export type StCssProps = CSS.Properties;

// A = args used to produce values dynamically
export type StCssPseudos<A> = {
    [K in CSS.Pseudos]?: StStyle<A>;
};

// A = args used to produce values dynamically
export type StStyle<A> = StObj<StCssProps, A> &
    StCssPseudos<A> & {
        '&'?: [string, StStyle<A>];
    };

// I = intrinsic element type
export type StCreateOptions<
    I extends keyof JSX.IntrinsicElements,
    P extends Obj = Obj,
    DP extends Partial<P> = Obj,
    FA extends Exclude<keyof JSX.IntrinsicElements[I], 'className'> = never,
    FC extends keyof StCssProps = never
> = {
    el: I;
    className?: MaybeArray<StDynamicValue<string, MergeDefaults<P, keyof DP>>>;
    defaultAttrs?: MaybeArray<StObj<Omit<JSX.IntrinsicElements[I], 'className'>, MergeDefaults<P, keyof DP>>>;
    defaultProps?: MaybeArray<StResponsiveObj<DP>>;
    forwardAttrs?: FA[];
    forwardCss?: FC[];
    render?: (props: MergeDefaults<P, keyof DP> & { C: I; attrs: JSX.IntrinsicElements[I] & { children?: React.ReactNode } }) => React.ReactNode;
    styles?: MaybeArray<StStyle<MergeDefaults<P, keyof DP>>>;
};

// I = intrinsic element type
// P = props of a StComponent (before dynamic/responsive)
// represents a component's props along with those
// provided by the library before resolving responsive props
export type StComponentProps<I extends keyof JSX.IntrinsicElements, P extends Obj = Obj> = StResponsiveObj<P> & {
    as?: keyof JSX.IntrinsicElements;
    css?: StResponsiveObj<CSSProperties>;
    attrs?: StResponsiveObj<Omit<JSX.IntrinsicElements[I], 'className'>>;
    className?: string;
    children?: React.ReactNode;
};

export type StExtendOptions<
    I extends keyof JSX.IntrinsicElements,
    P extends Obj = Obj,
    E extends Obj = Obj,
    DP extends Omit<PickRequired<P>, RequiredKeys<E>> & Partial<E> = Omit<PickRequired<P>, RequiredKeys<E>> & Partial<E>,
    A extends keyof JSX.IntrinsicElements = I,
    FA extends Exclude<keyof JSX.IntrinsicElements[A], 'className'> = never,
    FS extends keyof StCssProps = never
> = {
    as?: A;
    className?: StDynamicValue<string, MergeDefaults<P, keyof DP>>;
    defaultAttrs?: StObj<Omit<JSX.IntrinsicElements[A], 'className'>, MergeDefaults<P, keyof DP>>;
    forwardAttrs?: FA[];
    forwardCss?: FS[];
    styles?:
        | StStyle<MergeDefaults<P, keyof DP> & { attrs: JSX.IntrinsicElements[A] }>
        | StStyle<MergeDefaults<P, keyof DP> & { attrs: JSX.IntrinsicElements[A] }>[];
} & ([RequiredKeys<DP>] extends [never]
    ? {
          defaultProps?: StResponsiveObj<DP>;
      }
    : {
          defaultProps: StResponsiveObj<DP>;
      });

// I = intrinsic element type
// P = props of a StComponent (before dynamic/responsive)
// the type of component the library outputs
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

export const stTest =
    <P extends Obj = Obj>() =>
    <
        I extends keyof JSX.IntrinsicElements,
        PD extends Partial<P> = Obj,
        FA extends Exclude<keyof JSX.IntrinsicElements[I], 'className'> = never,
        FS extends keyof StCssProps = never
    >(
        options: StCreateOptions<I, P, PD, FA, FS>
    ) => {
        return options as unknown as StComponent<I, PartialSome<P, keyof PD> & Pick<JSX.IntrinsicElements[I], FA> & Pick<StCssProps, FS>>;
    };

const Test = stTest<{ size: number }>()({
    el: 'h1',
    forwardCss: ['transition'],
});

const TestExtend = Test.extend<{ newProps?: string; size: number }>()({
    defaultAttrs: {
        title: 'test',
    },
    forwardAttrs: ['title'],
    forwardCss: ['margin'],
});

<TestExtend title={['test']} margin={'1px'} size={[3]} />;
