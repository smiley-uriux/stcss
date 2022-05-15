import { st } from '../St';
import { renderAtBp, renderAtBps } from './utils';

describe('st', () => {
    describe('primitive components render', () => {
        test('with the correct tag', () => {
            const Title = st()({
                el: 'h1',
            });

            renderAtBps(<Title />, (el) => {
                expect(el?.nodeName).toEqual('H1');
            });
        });

        test('with the tag passed in "as" prop', () => {
            const Title = st()({
                el: 'h1',
            });

            renderAtBps(<Title as="h2" />, (el) => {
                expect(el?.nodeName).toEqual('H2');
            });
        });

        test('with single className string passed in options', () => {
            const Title = st()({
                el: 'h1',
                className: 'title',
            });

            renderAtBps(<Title />, (el) => {
                expect(el).toHaveClass('title');
            });
        });

        test('with dynamic and string classNames passed in options', () => {
            const Title = st<{ size: string }>()({
                el: 'h1',
                className: ['title', ({ size }) => size],
            });

            renderAtBps(<Title size="large" />, (el) => {
                expect(el).toHaveClass('title', 'large');
            });
        });

        test('attributes passed as defaults', () => {
            const Title = st()({
                el: 'h1',
                defaultAttrs: {
                    title: ['test-mobile', 'test-tablet', 'test-laptop', 'test-desktop'],
                },
            });

            renderAtBps(<Title attrs={{ title: ['test-mobile', 'test-tablet', 'test-laptop', 'test-desktop'] }} />, (el, bp) => {
                expect(el).toHaveAttribute('title', `test-${bp}`);
            });
        });

        test('atributes passed in attrs prop', () => {
            const Title = st()({
                el: 'h1',
            });

            renderAtBps(<Title attrs={{ title: ['test-mobile', 'test-tablet', 'test-laptop', 'test-desktop'] }} />, (el, bp) => {
                expect(el).toHaveAttribute('title', `test-${bp}`);
            });
        });

        test('atributes passed as forwarded prop', () => {
            const Title = st()({
                el: 'h1',
                forwardAttrs: ['title'],
            });

            renderAtBps(<Title title={['test-mobile', 'test-tablet', 'test-laptop', 'test-desktop']} />, (el, bp) => {
                expect(el).toHaveAttribute('title', `test-${bp}`);
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
                defaultAttrs: {
                    title: ['default-mobile', 'default-tablet', 'default-laptop', 'default-desktop'],
                },
                forwardAttrs: ['title'],
            });

            const [mobile, tablet, laptop, desktop] = renderAtBps(
                <Title title={['forward-mobile', null, 'forward-laptop', null]} attrs={{ title: [null, null, 'attrs-laptop-desktop'] }} />
            );

            expect(mobile).toHaveAttribute('title', 'forward-mobile');
            expect(tablet).toHaveAttribute('title', 'default-tablet');
            expect(laptop).toHaveAttribute('title', 'forward-laptop');
            expect(desktop).toHaveAttribute('title', 'attrs-laptop-desktop');
        });
    });
});
