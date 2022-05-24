import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { canonizeStCss, StProvider } from './context';
import { st } from './St';

const stCss = canonizeStCss({
    mediaQueries: {
        mobile: '(max-width: 719px)',
        tablet: '(min-width: 720px) and (max-width: 991px)',
        laptop: '(min-width: 992px) and (max-width: 1199px)',
        desktop: '(min-width: 1200px)',
    },
    breakpoints: ['mobile', 'tablet', 'laptop', 'desktop'],
});

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

const Title = st()({
    el: 'h1',
    className: 'title',
    forwardAttrs: ['title'],
    defaultAttrs: {
        title: 'testing title',
    },
    css: {
        color: ['green', 'red'],
    },
    render: ({ C, attrs }) => {
        return <C {...attrs} />;
    },
});

const Subtitle = Title.extend()({
    as: 'h2',
    className: 'subtitle',
    defaultAttrs: {
        title: 'testing subtitle',
    },
});

const Text = Subtitle.extend()({
    as: 'h3',
});

root.render(
    <StrictMode>
        <StProvider value={stCss}>
            <Text attrs={{ title: ['text-mobile', 'text'] }}>I am text</Text>
        </StProvider>
    </StrictMode>
);
