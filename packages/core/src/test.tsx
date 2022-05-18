import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { StProvider } from './context';
import { st } from './St';

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
        <StProvider>
            <Text attrs={{ title: ['text-mobile', 'text'] }}>I am text</Text>
        </StProvider>
    </StrictMode>
);
