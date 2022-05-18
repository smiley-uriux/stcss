import { st } from '../St';
import { renderAtBp, testAtBps } from './utils';

describe('st', () => {
    describe('primitive components render', () => {
        test('with the correct tag', () => {
            const Title = st()({
                el: 'h1',
            });

            testAtBps(<Title />, (el) => {
                expect(el?.nodeName).toEqual('H1');
            });
        });

        test('with the tag passed in "as" prop', () => {
            const Title = st()({
                el: 'h1',
            });

            testAtBps(<Title as="h2" />, (el) => {
                expect(el?.nodeName).toEqual('H2');
            });
        });

        test('with single className string passed in options', () => {
            const Title = st()({
                el: 'h1',
                className: 'title',
            });

            testAtBps(<Title />, (el) => {
                expect(el).toHaveClass('title');
            });
        });

        test('with dynamic and string classNames passed in options', () => {
            const Title = st<{ size: string }>()({
                el: 'h1',
                className: ['title', ({ size }) => size],
            });

            testAtBps(<Title size="large" />, (el) => {
                expect(el).toHaveClass('title', 'large');
            });
        });

        test('attributes passed as defaults', () => {
            const title = ['test-mobile', 'test-tablet', 'test-laptop', 'test-desktop'];
            const Title = st()({
                el: 'h1',
                defaultAttrs: { title },
            });

            testAtBps(<Title />, (el, i) => {
                expect(el).toHaveAttribute('title', title[i]);
            });
        });

        test('atributes passed in attrs prop', () => {
            const title = ['test-mobile', 'test-tablet', 'test-laptop', 'test-desktop'];
            const Title = st()({
                el: 'h1',
            });

            testAtBps(<Title attrs={{ title }} />, (el, i) => {
                expect(el).toHaveAttribute('title', title[i]);
            });
        });

        test('atributes passed as forwarded prop', () => {
            const title = ['test-mobile', 'test-tablet', 'test-laptop', 'test-desktop'];
            const Title = st()({
                el: 'h1',
                forwardAttrs: ['title'],
            });

            testAtBps(<Title title={title} />, (el, i) => {
                expect(el).toHaveAttribute('title', title[i]);
            });
        });

        test('non-responsive attributes, following precedence rules', () => {
            const Title = st()({
                el: 'h1',
                defaultAttrs: {
                    title: 'default',
                    role: 'alert',
                },
                forwardAttrs: ['title'],
            });

            const el = renderAtBp('mobile', <Title title={'forwarded'} attrs={{ title: 'attrs', role: 'definition' }} />);
            expect(el).toHaveAttribute('title', 'forwarded');
            expect(el).toHaveAttribute('role', 'definition');
        });

        test('responsive attributes, following precedence rules', () => {
            const Title = st()({
                el: 'h1',
                defaultAttrs: { title: ['default-mobile', 'default-tablet', 'default-laptop', 'default-desktop'] },
                forwardAttrs: ['title'],
            });

            testAtBps(<Title title={['forward-mobile', null, 'forward-laptop', null]} attrs={{ title: [null, null, 'attrs-laptop-desktop'] }} />, (el, i) => {
                expect(el).toHaveAttribute('title', ['forward-mobile', 'default-tablet', 'forward-laptop', 'attrs-laptop-desktop'][i]);
            });
        });

        test('css passed in options', () => {
            const Title = st()({
                el: 'h1',
                css: {
                    color: ['green', 'blue'],
                    fontSize: '12px',
                },
            });

            testAtBps(<Title>Testing</Title>, (el, i) => {
                expect(el).toHaveStyle({
                    color: ['green', 'blue', 'blue', 'blue'][i],
                    fontSize: '12px',
                });
            });
        });

        test('css passed in css prop', () => {
            const Title = st()({
                el: 'h1',
            });

            testAtBps(<Title css={{ color: ['yellow', 'red'], fontSize: '14px' }}>Testing</Title>, (el, i) => {
                expect(el).toHaveStyle({
                    color: ['yellow', 'red', 'red', 'red'][i],
                    fontSize: '14px',
                });
            });
        });

        test('css passed as forwarded prop', () => {
            const Title = st()({
                el: 'h1',
                forwardCss: ['color'],
            });

            testAtBps(<Title color={['green', 'blue']}>Testing</Title>, (el, i) => {
                expect(el).toHaveStyle({
                    color: ['green', 'blue', 'blue', 'blue'][i],
                });
            });
        });

        test('non-responsive css, following precedence rules', () => {
            const Title = st()({
                el: 'h1',
                css: {
                    color: 'red',
                    display: 'flex',
                    opacity: 0,
                },
                forwardCss: ['color', 'display'],
            });

            const el = renderAtBp('mobile', <Title color="blue" css={{ color: 'yellow', display: 'block' }} />);
            expect(el).toHaveStyle({
                color: 'blue',
                display: 'block',
                opacity: 0,
            });
        });

        test('responsive css, following precedence rules', () => {
            const Title = st()({
                el: 'h1',
                css: { color: ['red', , 'blue'] },
                forwardCss: ['color'],
            });

            testAtBps(<Title color={[null, null, 'green']} css={{ color: ['yellow', null] }} />, (el, i) => {
                expect(el).toHaveStyle({
                    color: ['yellow', 'red', 'green', 'blue'][i],
                });
            });
        });
    });
});
