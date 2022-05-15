import { resolveStStyle } from '../util';

describe('resolveStStyle', () => {
    test('resolves static rules', () => {
        const style = resolveStStyle({
            color: 'green',
            display: 'block',
        });
        expect(style).toEqual({
            '?|color': 'green',
            '?|display': 'block',
        });
    });

    test('resolves dynamic rules at the top level', () => {
        const style = resolveStStyle(
            ({ primary, show }) => ({
                color: primary,
                display: show ? 'block' : 'none',
            }),
            { primary: 'green', show: true }
        );
        expect(style).toEqual({
            '?|color': 'green',
            '?|display': 'block',
        });
    });

    test('resolves dynamic rules at the property level', () => {
        const style = resolveStStyle(
            {
                color: ({ primary }) => primary,
                display: ({ show }) => (show ? 'block' : 'none'),
            },
            { primary: 'green', show: true }
        );
        expect(style).toEqual({
            '?|color': 'green',
            '?|display': 'block',
        });
    });

    test('resolves dynamic rules at multiple levels', () => {
        const style = resolveStStyle(
            ({ show }) => ({
                color: ({ primary }) => primary,
                display: show ? 'block' : 'none',
            }),
            { primary: 'green', show: true }
        );
        expect(style).toEqual({
            '?|color': 'green',
            '?|display': 'block',
        });
    });

    test('resolves psuedo selectors', () => {
        const style = resolveStStyle({
            color: 'green',
            ':hover': {
                color: 'purple',
            },
        });
        expect(style).toEqual({
            '?|color': 'green',
            '?:hover|color': 'purple',
        });
    });

    test('resolves nested selectors', () => {
        const style = resolveStStyle({
            color: 'green',
            '&': [
                '.parent & .child',
                {
                    color: 'purple',
                },
            ],
        });
        expect(style).toEqual({
            '?|color': 'green',
            '.parent ? .child|color': 'purple',
        });
    });

    test('resolves nested selectors without "&"', () => {
        const style = resolveStStyle({
            color: 'green',
            '&': [
                'p',
                {
                    color: 'purple',
                },
            ],
        });
        expect(style).toEqual({
            '?|color': 'green',
            '? p|color': 'purple',
        });
    });

    test('resolves nested selectors with expansions', () => {
        const style = resolveStStyle({
            color: 'green',
            '&': [
                '&:hover,p',
                {
                    color: 'purple',
                },
            ],
        });
        expect(style).toEqual({
            '?|color': 'green',
            '?:hover|color': 'purple',
            '? p|color': 'purple',
        });
    });

    test('resolves deeply nested selectors', () => {
        const style = resolveStStyle({
            color: 'green',
            '&': [
                'p',
                {
                    '&': [
                        '.parent & > span',
                        {
                            color: 'purple',
                            ':hover': {
                                color: 'red',
                            },
                        },
                    ],
                },
            ],
        });
        expect(style).toEqual({
            '?|color': 'green',
            '.parent ? p > span|color': 'purple',
            '.parent ? p > span:hover|color': 'red',
        });
    });

    test('resolves deeply nested selectors using "?" directly', () => {
        const style = resolveStStyle({
            color: 'green',
            '&': [
                'p',
                {
                    '&': [
                        '?',
                        {
                            color: 'purple',
                        },
                    ],
                },
            ],
        });
        expect(style).toEqual({
            '?|color': 'purple',
        });
    });

    test('leaves responsive values alone', () => {
        const style = resolveStStyle(
            ({ show }) => ({
                color: ({ primary }) => [primary, 'gold'],
                display: show ? ['flex', 'block'] : 'none',
            }),
            { primary: 'green', show: true }
        );
        expect(style).toEqual({
            '?|color': ['green', 'gold'],
            '?|display': ['flex', 'block'],
        });
    });
});
