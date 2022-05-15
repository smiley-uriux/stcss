/* eslint-disable @typescript-eslint/no-explicit-any */
import { MaybeArray, Obj, StDynamicValue, StObj, StResponsiveObj, StStyle } from './types';

export const resolveDynamicValue = <V, A>(value: StDynamicValue<V, A>, args: A): V | undefined => {
    return typeof value === 'function' ? (value as any)(args) : value;
};

export const objForEach = (obj: any, args: any | undefined, cb: (c: [string, any]) => void): void => {
    if (obj === undefined) return;
    if (typeof obj === 'function') return objForEach(obj(args), args, cb);
    if (obj && typeof obj === 'object') {
        Object.entries(obj).forEach(([key, val]) => {
            if (typeof val === 'function') {
                val = val(args);
            }
            cb([key, val]);
        });
    }
};

export const resolveStStyle = <A>(
    style: StStyle<A> | undefined,
    args?: A,
    sel = '?',
    result: Record<string, string> = {}
): Record<string, MaybeArray<string | number>> | undefined => {
    if (style) {
        objForEach(style, args, ([key, val]) => {
            if (typeof val === 'object') {
                if (key === '&') {
                    const nestedSel = val[0].split(',');
                    return nestedSel.forEach((ns: string) => {
                        let newSel = ns.replaceAll('&', sel);
                        if (!newSel.includes('?')) {
                            newSel = '? ' + newSel;
                        }
                        resolveStStyle(val[1], args, newSel, result);
                    });
                } else if (!Array.isArray(val)) {
                    return resolveStStyle(val, args, sel + key, result);
                }
            }
            // this is where transformations will happen
            result[`${sel}|${key}`] = val;
        });
    }
    return result;
};

export function resolveStObj<O extends Obj, A extends Obj>(
    obj: StObj<O, A> | StResponsiveObj<O> | undefined,
    bpIndex: number,
    args: A = {} as any
): O | undefined {
    if (obj === undefined) return undefined;
    if (typeof obj === 'function') {
        return resolveStObj(obj(args), bpIndex, args);
    }
    return Object.entries(obj).reduce((obj, [prop, value]) => {
        if (typeof value === 'function') {
            obj[prop] = resolveStObj(value(args), bpIndex, args);
        } else if (Array.isArray(value)) {
            let v;
            for (let i = bpIndex + 1; i--; i >= 0) {
                if (value[i] !== undefined) {
                    v = value[i];
                    break;
                }
            }
            if (v !== null && v !== undefined) {
                obj[prop] = v;
            }
        } else {
            obj[prop] = value && typeof value === 'object' ? resolveStObj(value, bpIndex, args) : value;
        }
        return obj;
    }, {} as Record<string, unknown>) as O;
}

export const mergeStObjs = <O extends Obj, A extends Obj>(bpIndex: number, objs: (StObj<O, A> | undefined)[], args: A = {} as any): O => {
    const mergedObj: Obj = {};
    for (const obj of objs) {
        Object.assign(mergedObj, resolveStObj(obj, bpIndex, args));
    }
    return mergedObj as O;
};

/*
export const variant =
    <P, K extends keyof P>(
        prop: K,
        styles: Exclude<P[K], undefined> extends string
            ? Partial<Record<Exclude<P[K], undefined>, StStyles<P>>>
            : never,
        defaultValue?: Exclude<P[K], undefined>
    ): StDynamicStyles<P> =>
    (props: P): StStyles<P> | undefined => {
        const val = props[prop] || defaultValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return val === undefined ? undefined : (styles as any)[val];
    };
*/
